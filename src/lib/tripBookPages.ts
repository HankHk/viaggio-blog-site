import type { Trip } from "@/types/trip";
import type { BookPageData } from "@/types/book";

const MAX_CHARS_PER_TEXT_PAGE = 750;
const MAX_PARAGRAPHS_PER_PAGE = 2;

/**
 * Distribuisce un array di paragrafi in pagine (max 2 paragrafi / 750 caratteri per pagina).
 */
function splitContentIntoPages(paragraphs: string[]): string[] {
  const filtered = (paragraphs ?? [])
    .map((p) => p.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim())
    .filter(Boolean);
  if (filtered.length === 0) return [];

  const pages: string[] = [];
  let currentPage: string[] = [];
  let currentLength = 0;

  for (const para of filtered) {
    const wouldExceed =
      currentLength + para.length > MAX_CHARS_PER_TEXT_PAGE ||
      currentPage.length >= MAX_PARAGRAPHS_PER_PAGE;

    if (wouldExceed && currentPage.length > 0) {
      pages.push(currentPage.join("\n\n"));
      currentPage = [];
      currentLength = 0;
    }

    currentPage.push(para);
    currentLength += para.length;
  }

  if (currentPage.length > 0) {
    pages.push(currentPage.join("\n\n"));
  }

  return pages;
}

/**
 * Dato un Trip, restituisce un array di pagine per il libro (numero pari).
 */
export function tripToBookPages(trip: Trip): BookPageData[] {
  const pages: BookPageData[] = [];

  // Spread 0: copertina — sinistra (titolo, location, date), destra (immagine)
  const coverImage = trip.images[0] ?? "";
  pages.push({
    type: "cover-left",
    title: trip.title,
    location: trip.location,
    date: trip.date,
  });
  pages.push({
    type: "cover-right",
    coverImage,
  });

  // Pagine di testo
  const textChunks = splitContentIntoPages(trip.content);
  for (const text of textChunks) {
    pages.push({ type: "text", text });
  }

  // Galleria (una pagina se ci sono più immagini)
  if (trip.images.length > 1) {
    pages.push({
      type: "gallery",
      images: trip.images,
    });
  }

  // Curiosità (una pagina)
  if (trip.curiosities && trip.curiosities.length > 0) {
    pages.push({
      type: "curiosities",
      curiosities: trip.curiosities,
    });
  }

  // Numero pari di pagine: aggiungi blank se necessario
  if (pages.length % 2 !== 0) {
    pages.push({ type: "blank" });
  }

  return pages;
}
