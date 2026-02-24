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
  /** Pagina testo */
  text?: string;
  /** Pagina galleria */
  images?: string[];
  /** Pagina curiosità */
  curiosities?: string[];
}
