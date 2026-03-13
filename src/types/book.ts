/** Tipo di pagina del libro */
export type BookPageType =
  | "cover-left"
  | "cover-right"
  | "text"
  | "gallery"
  | "curiosities"
  | "blank";

/** Dati per una singola pagina del libro (serializzabili per passaggio server → client) */
export interface BookPageData {
  type: BookPageType;
  /** Copertina sinistra: titolo viaggio */
  title?: string;
  /** Copertina sinistra: luogo */
  location?: string;
  /** Copertina sinistra: data */
  date?: string;
  /** Copertina destra: URL immagine */
  coverImage?: string;
  /** Pagina testo: corpo del paragrafo; tipo text può usare anche title (titolo blocco) e images (foto blocco) */
  text?: string;
  /** Pagina galleria: elenco URL. Pagina testo: immagini del blocco (opzionale). */
  images?: string[];
  /** Pagina curiosità */
  curiosities?: string[];
}
