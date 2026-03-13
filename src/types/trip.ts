/** Singolo blocco del diario: titolo opzionale, testo, eventuali immagini. */
export interface ContentBlock {
  title?: string;
  text: string;
  images?: string[];
}

export interface Trip {
  title: string;
  slug: string;
  location: string;
  date: string;
  description: string;
  content: ContentBlock[];
  images: string[];
  tags: string[];
  /** Sezione curiosità o highlight (opzionale) */
  curiosities?: string[];
}
