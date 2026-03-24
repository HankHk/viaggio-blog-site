import type { Trip, ContentBlock } from "@/types/trip";
import type { BookPageData } from "@/types/book";
import { normalizeTrip } from "@/lib/trips";

interface TextPagePayload {
  title?: string;
  text?: string;
  images?: string[];
}

const MAX_CHARS_PER_TEXT_PAGE = 600;
const MAX_PARAGRAPHS_PER_PAGE = 2;

/** Peso fisso assegnato a un paragrafo che è solo un'immagine Markdown `![alt](url)`. */
const MARKDOWN_IMAGE_WEIGHT = 500;

/** Restituisce true se il paragrafo è esclusivamente una o più righe immagine Markdown. */
function isMarkdownImageParagraph(para: string): boolean {
  return para
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .every((l) => /^!\[.*?\]\(.+?\)$/.test(l));
}

/**
 * Spezza un testo lungo in chunk di al massimo maxChars, preferendo tagli dopo \n o spazio.
 * I paragrafi che contengono solo immagini Markdown non vengono mai spezzati.
 */
function splitLongText(text: string, maxChars: number): string[] {
  if (isMarkdownImageParagraph(text)) return [text];
  if (text.length <= maxChars) return [text];
  const chunks: string[] = [];
  let rest = text;
  while (rest.length > 0) {
    if (rest.length <= maxChars) {
      chunks.push(rest);
      break;
    }
    const slice = rest.slice(0, maxChars + 1);
    const lastNewline = slice.lastIndexOf("\n");
    const lastSpace = slice.lastIndexOf(" ");
    const breakAt =
      lastNewline >= maxChars * 0.5
        ? lastNewline + 1
        : lastSpace >= maxChars * 0.5
          ? lastSpace + 1
          : maxChars;
    chunks.push(rest.slice(0, breakAt).trimEnd());
    rest = rest.slice(breakAt).replace(/^\s+/, "");
  }
  return chunks;
}

/**
 * Distribuisce i paragrafi in pagine: nessuna pagina supera MAX_CHARS_PER_TEXT_PAGE
 * e al massimo MAX_PARAGRAPHS_PER_PAGE paragrafi. I paragrafi lunghi vengono spezzati
 * in più pagine così tutto il testo è leggibile senza tagli.
 * Le righe di immagini Markdown `![alt](url)` sono atomiche e non vengono mai spezzate:
 * vengono conteggiate con un peso fisso (MARKDOWN_IMAGE_WEIGHT) indipendentemente dalla
 * lunghezza dell'URL.
 */
function splitParagraphsIntoPageTexts(paragraphs: string[]): string[] {
  const filtered = (paragraphs ?? [])
    .map((p) => p.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim())
    .filter(Boolean);
  if (filtered.length === 0) return [];

  const pages: string[] = [];
  let currentPage: string[] = [];
  let currentLength = 0;

  for (const para of filtered) {
    const isImage = isMarkdownImageParagraph(para);
    const paraWeight = isImage ? MARKDOWN_IMAGE_WEIGHT : para.length;

    // I paragrafi di testo puro troppo lunghi vengono spezzati in più chunk.
    // Le righe immagine Markdown non vengono mai spezzate (isImage = true).
    if (!isImage && para.length > MAX_CHARS_PER_TEXT_PAGE) {
      if (currentPage.length > 0) {
        pages.push(currentPage.join("\n\n"));
        currentPage = [];
        currentLength = 0;
      }
      const chunks = splitLongText(para, MAX_CHARS_PER_TEXT_PAGE);
      for (const chunk of chunks) {
        pages.push(chunk);
      }
      continue;
    }

    const wouldExceed =
      currentLength + paraWeight > MAX_CHARS_PER_TEXT_PAGE ||
      currentPage.length >= MAX_PARAGRAPHS_PER_PAGE;

    if (wouldExceed && currentPage.length > 0) {
      pages.push(currentPage.join("\n\n"));
      currentPage = [];
      currentLength = 0;
    }

    currentPage.push(para);
    currentLength += paraWeight;
  }

  if (currentPage.length > 0) {
    pages.push(currentPage.join("\n\n"));
  }

  return pages;
}

/**
 * Converte ContentBlock[] in sequenza di pagine.
 * Le immagini del blocco vengono incluse nella prima pagina di testo del blocco.
 */
function contentBlocksToTextPages(blocks: ContentBlock[]): TextPagePayload[] {
  const result: TextPagePayload[] = [];
  for (const block of blocks) {
    const text = (block.text ?? "").replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
    const hasImages = block.images && block.images.length > 0;

    if (!text && hasImages) {
      result.push({ title: block.title, images: block.images });
      continue;
    }

    if (!text) continue;

    const paragraphs = text.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
    const textChunks = splitParagraphsIntoPageTexts(paragraphs);
    for (let i = 0; i < textChunks.length; i++) {
      result.push({
        title: i === 0 ? block.title : undefined,
        text: textChunks[i],
        images: i === 0 && hasImages ? block.images : undefined,
      });
    }
  }
  return result;
}

/**
 * Dato un Trip, restituisce un array di pagine per il libro (numero pari).
 * trip.content può essere ContentBlock[] (nuovo) o string[] (legacy); viene normalizzato.
 */
export function tripToBookPages(trip: Trip): BookPageData[] {
  const normalized = normalizeTrip(trip);
  const pages: BookPageData[] = [];

  // Spread 0: copertina — sinistra (titolo, location, date), destra (immagine)
  const coverImage = normalized.images[0] ?? "";
  pages.push({
    type: "cover-left",
    title: normalized.title,
    location: normalized.location,
    date: normalized.date,
  });
  pages.push({
    type: "cover-right",
    coverImage,
  });

  // Pagine di testo (con titolo e immagini per blocco)
  const textPages = contentBlocksToTextPages(normalized.content);
  for (const payload of textPages) {
    pages.push({
      type: "text",
      title: payload.title,
      text: payload.text,
      images: payload.images,
    });
  }

  // Galleria (una pagina se ci sono più immagini)
  if (normalized.images.length > 1) {
    pages.push({
      type: "gallery",
      images: normalized.images,
    });
  }

  // Curiosità (una pagina)
  if (normalized.curiosities && normalized.curiosities.length > 0) {
    pages.push({
      type: "curiosities",
      curiosities: normalized.curiosities,
    });
  }

  // Numero pari di pagine: aggiungi blank se necessario
  if (pages.length % 2 !== 0) {
    pages.push({ type: "blank" });
  }

  return pages;
}
