# Viaggio — Blog di viaggi

Blog di viaggi minimal ed elegante, realizzato con Next.js (App Router), TypeScript e Tailwind CSS. Pronto per il deploy su Vercel.

## Requisiti

- **Node.js** 18.x o superiore
- **npm** (o yarn/pnpm)

## Avvio in locale

```bash
# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000) nel browser.

## Build per produzione

```bash
npm run build
npm run start
```

## Deploy su Vercel

1. Collega il repository GitHub (o altro Git) a [Vercel](https://vercel.com).
2. Vercel rileva automaticamente Next.js. Non modificare:
   - **Build Command:** `next build` (o lasciare vuoto)
   - **Output Directory:** (default Next.js)
   - **Install Command:** `npm install`
3. Clicca su **Deploy**. Il sito sarà online con URL tipo `https://tuo-progetto.vercel.app`.

Per deploy da CLI:

```bash
npm i -g vercel
vercel
```

## Aggiungere un nuovo viaggio

1. Apri il file **`data/trips.json`**.
2. Aggiungi un nuovo oggetto all’array, con tutti i campi richiesti:

```json
{
  "title": "Titolo del viaggio",
  "slug": "slug-url-univoco",
  "location": "Città, Paese",
  "date": "Mese Anno",
  "description": "Breve descrizione per la card in home.",
  "content": "Testo lungo del post, con eventuali paragrafi separati da \\n\\n.",
  "images": ["url-copertina", "url-2", "url-3"],
  "tags": ["Tag1", "Tag2"],
  "curiosities": ["Curiosità 1.", "Curiosità 2."]
}
```

3. Salva il file. Alla prossima build (o al refresh in dev) il nuovo viaggio apparirà in home e avrà la pagina `/viaggi/slug-url-univoco`.

**Immagini:** puoi usare path locali in `public/images/` (es. `/images/mio-viaggio.jpg`) oppure URL esterni (es. Unsplash). Per domini esterni, aggiungili in `next.config.ts` in `images.remotePatterns`.

## Struttura del progetto

- **`src/app/`** — Pagine e layout (App Router)
- **`src/components/`** — Componenti riutilizzabili (layout, home, trip, ui)
- **`src/lib/`** — Logica dati (lettura viaggi)
- **`src/types/`** — Tipi TypeScript
- **`data/trips.json`** — Dati dei viaggi
- **`public/`** — Immagini e pattern SVG

## Licenza

Progetto privato. Tutti i diritti riservati.
