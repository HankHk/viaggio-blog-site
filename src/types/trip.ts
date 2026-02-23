export interface Trip {
  title: string;
  slug: string;
  location: string;
  date: string;
  description: string;
  content: string;
  images: string[];
  tags: string[];
  /** Sezione curiosità o highlight (opzionale) */
  curiosities?: string[];
}
