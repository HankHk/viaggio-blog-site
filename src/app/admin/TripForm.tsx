"use client";

import { useActionState, useState } from "react";
import { addTripAction } from "./actions";
import type { Trip, ContentBlock } from "@/types/trip";

const defaultCopyLabel = "Copia JSON";

export interface DraftMeta {
  title: string;
  slug: string;
  location: string;
  date: string;
  description: string;
  images: string[];
  tags: string[];
  curiosities: string[];
}

const emptyMeta: DraftMeta = {
  title: "",
  slug: "",
  location: "",
  date: "",
  description: "",
  images: [],
  tags: [],
  curiosities: [],
};

function tripToDraftMeta(t: Trip): DraftMeta {
  return {
    title: t.title,
    slug: t.slug,
    location: t.location,
    date: t.date,
    description: t.description,
    images: t.images,
    tags: t.tags,
    curiosities: t.curiosities ?? [],
  };
}

function parseList(value: string): string[] {
  return value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

interface TripFormProps {
  /** Se fornito, il form è in modalità modifica (slug non modificabile, submit aggiorna il viaggio). */
  initialTrip?: Trip | null;
}

export function TripForm({ initialTrip = null }: TripFormProps) {
  const isEdit = !!initialTrip;
  const [step, setStep] = useState<1 | 2>(1);
  const [draftTripMeta, setDraftTripMeta] = useState<DraftMeta>(
    initialTrip ? tripToDraftMeta(initialTrip) : emptyMeta
  );
  const [curiositiesInput, setCuriositiesInput] = useState(
    (initialTrip?.curiosities ?? []).join("\n")
  );
  const [draftBlocks, setDraftBlocks] = useState<ContentBlock[]>(
    initialTrip?.content?.length
      ? initialTrip.content.map((b) => ({ title: b.title, text: b.text, images: b.images ?? [] }))
      : [{ text: "" }]
  );
  const [state, formAction] = useActionState(addTripAction, null);
  const [copyLabel, setCopyLabel] = useState(defaultCopyLabel);

  const handleCopy = () => {
    if (state && !state.success && "copyJson" in state) {
      navigator.clipboard.writeText(state.copyJson);
      setCopyLabel("Copiato!");
      setTimeout(() => setCopyLabel(defaultCopyLabel), 2000);
    }
  };

  const goToDiary = () => {
    const { title, slug } = draftTripMeta;
    if (!title?.trim()) return;
    if (!slug?.trim()) return;
    setStep(2);
  };

  const backToMeta = () => setStep(1);

  if (step === 1) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-xl font-semibold text-[#2c2c2c]">
          {isEdit ? "Modifica viaggio — Dati viaggio" : "Aggiungi viaggio — Dati viaggio"}
        </h1>
        <div className="space-y-4 rounded-lg border border-sand bg-[var(--bg-pearl)] p-6 shadow">
          <div>
            <label htmlFor="title" className="mb-1 block text-sm font-medium text-[#2c2c2c]">Titolo *</label>
            <input
              id="title"
              type="text"
              required
              value={draftTripMeta.title}
              onChange={(e) => setDraftTripMeta((p) => ({ ...p, title: e.target.value }))}
              className="w-full rounded border border-sand bg-white px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="slug" className="mb-1 block text-sm font-medium text-[#2c2c2c]">Slug * (univoco, es. kyoto-primavera)</label>
            <input
              id="slug"
              type="text"
              required
              readOnly={isEdit}
              value={draftTripMeta.slug}
              onChange={(e) =>
                setDraftTripMeta((p) => ({
                  ...p,
                  slug: e.target.value.trim().toLowerCase().replace(/\s+/g, "-"),
                }))
              }
              className="w-full rounded border border-sand bg-white px-3 py-2 lowercase disabled:bg-sand/30"
            />
            {isEdit && <p className="mt-1 text-xs text-[#2c2c2c]/70">Lo slug non si può modificare (identifica l’URL del viaggio).</p>}
          </div>
          <div>
            <label htmlFor="location" className="mb-1 block text-sm font-medium text-[#2c2c2c]">Luogo</label>
            <input
              id="location"
              type="text"
              value={draftTripMeta.location}
              onChange={(e) => setDraftTripMeta((p) => ({ ...p, location: e.target.value }))}
              className="w-full rounded border border-sand bg-white px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="date" className="mb-1 block text-sm font-medium text-[#2c2c2c]">Data (es. Marzo 2024)</label>
            <input
              id="date"
              type="text"
              value={draftTripMeta.date}
              onChange={(e) => setDraftTripMeta((p) => ({ ...p, date: e.target.value }))}
              className="w-full rounded border border-sand bg-white px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="description" className="mb-1 block text-sm font-medium text-[#2c2c2c]">Descrizione breve</label>
            <textarea
              id="description"
              rows={2}
              value={draftTripMeta.description}
              onChange={(e) => setDraftTripMeta((p) => ({ ...p, description: e.target.value }))}
              className="w-full rounded border border-sand bg-white px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="images" className="mb-1 block text-sm font-medium text-[#2c2c2c]">URL immagini (uno per riga, opzionale)</label>
            <textarea
              id="images"
              rows={4}
              value={draftTripMeta.images.join("\n")}
              onChange={(e) => setDraftTripMeta((p) => ({ ...p, images: parseList(e.target.value) }))}
              className="w-full rounded border border-sand bg-white px-3 py-2 font-mono text-sm"
              placeholder="https://..."
            />
          </div>
          <div>
            <label htmlFor="tags" className="mb-1 block text-sm font-medium text-[#2c2c2c]">Tag (uno per riga)</label>
            <textarea
              id="tags"
              rows={2}
              value={draftTripMeta.tags.join("\n")}
              onChange={(e) => setDraftTripMeta((p) => ({ ...p, tags: parseList(e.target.value) }))}
              className="w-full rounded border border-sand bg-white px-3 py-2"
              placeholder="Giappone&#10;Natura"
            />
          </div>
          <div>
            <label htmlFor="curiosities" className="mb-1 block text-sm font-medium text-[#2c2c2c]">Curiosità (uno per riga)</label>
            <textarea
              id="curiosities"
              rows={4}
              value={curiositiesInput}
              onChange={(e) => {
                const value = e.target.value;
                setCuriositiesInput(value);
                setDraftTripMeta((p) => ({ ...p, curiosities: parseList(value) }));
              }}
              className="w-full rounded border border-sand bg-white px-3 py-2"
            />
          </div>
          <button
            type="button"
            onClick={goToDiary}
            className="w-full rounded bg-[var(--green-leaf)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--green-leaf-dark)]"
          >
            Prosegui al diario
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-xl font-semibold text-[#2c2c2c]">
        {isEdit ? "Modifica viaggio — Contenuto del diario" : "Aggiungi viaggio — Contenuto del diario"}
      </h1>
      <form action={formAction} className="space-y-6">
        {isEdit && <input type="hidden" name="_editSlug" value={draftTripMeta.slug} readOnly />}
        <input type="hidden" name="title" value={draftTripMeta.title} readOnly />
        <input type="hidden" name="slug" value={draftTripMeta.slug} readOnly />
        <input type="hidden" name="location" value={draftTripMeta.location} readOnly />
        <input type="hidden" name="date" value={draftTripMeta.date} readOnly />
        <input type="hidden" name="description" value={draftTripMeta.description} readOnly />
        <input type="hidden" name="images" value={draftTripMeta.images.join("\n")} readOnly />
        <input type="hidden" name="tags" value={draftTripMeta.tags.join("\n")} readOnly />
        <input type="hidden" name="curiosities" value={draftTripMeta.curiosities.join("\n")} readOnly />
        <input
          type="hidden"
          name="contentJson"
          value={JSON.stringify(draftBlocks.map((b) => ({ title: b.title || undefined, text: b.text, images: b.images?.length ? b.images : undefined })))}
          readOnly
        />
        <div className="space-y-4 rounded-lg border border-sand bg-[var(--bg-pearl)] p-6 shadow">
          <div>
            <p className="text-sm font-medium text-[#2c2c2c]">Contenuto del diario</p>
            <p className="mt-0.5 text-xs text-[#2c2c2c]/70">
              Ogni blocco può avere un titolo (opzionale), il testo e eventuali immagini (URL uno per riga).
              Il sistema impagina automaticamente nelle pagine del libro.
            </p>
          </div>
          <div className="space-y-4">
            {draftBlocks.map((block, i) => (
              <div key={i} className="space-y-2 rounded border border-sand/60 bg-white p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#2c2c2c]/60">Blocco {i + 1}</span>
                  {draftBlocks.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setDraftBlocks((prev) => prev.filter((_, idx) => idx !== i))
                      }
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Rimuovi
                    </button>
                  )}
                </div>
                <div>
                  <label className="mb-0.5 block text-xs font-medium text-[#2c2c2c]/70">Titolo (opzionale)</label>
                  <input
                    type="text"
                    value={block.title ?? ""}
                    onChange={(e) =>
                      setDraftBlocks((prev) =>
                        prev.map((b, idx) =>
                          idx === i ? { ...b, title: e.target.value || undefined } : b
                        )
                      )
                    }
                    className="w-full rounded border border-sand bg-white px-3 py-2 text-sm"
                    placeholder="es. 12 agosto - Partenza"
                  />
                </div>
                <div>
                  <label className="mb-0.5 block text-xs font-medium text-[#2c2c2c]/70">Testo *</label>
                  <textarea
                    rows={6}
                    value={block.text}
                    onChange={(e) =>
                      setDraftBlocks((prev) =>
                        prev.map((b, idx) => (idx === i ? { ...b, text: e.target.value } : b))
                      )
                    }
                    className="w-full rounded border border-sand bg-white px-3 py-2 font-sans text-sm"
                    placeholder={`Testo del blocco ${i + 1}…`}
                  />
                  <p className="mt-1 text-xs text-[#2c2c2c]/50">
                    Markdown supportato:{" "}
                    <code className="rounded bg-sand/60 px-1">**grassetto**</code>,{" "}
                    <code className="rounded bg-sand/60 px-1">*corsivo*</code>,{" "}
                    <code className="rounded bg-sand/60 px-1">[link](url)</code>,{" "}
                    <code className="rounded bg-sand/60 px-1">![immagine](url)</code> (su riga separata per posizionarla).
                  </p>
                </div>
                <div>
                  <label className="mb-0.5 block text-xs font-medium text-[#2c2c2c]/70">Immagini (URL uno per riga, opzionale)</label>
                  <textarea
                    rows={2}
                    value={(block.images ?? []).join("\n")}
                    onChange={(e) =>
                      setDraftBlocks((prev) =>
                        prev.map((b, idx) =>
                          idx === i
                            ? { ...b, images: parseList(e.target.value) }
                            : b
                        )
                      )
                    }
                    className="w-full rounded border border-sand bg-white px-3 py-2 font-mono text-sm"
                    placeholder="https://..."
                  />
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setDraftBlocks((prev) => [...prev, { text: "" }])}
            className="rounded border border-[var(--green-leaf)] px-4 py-2 text-sm font-medium text-[var(--green-leaf)] hover:bg-[var(--green-leaf)]/10"
          >
            + Aggiungi blocco
          </button>
        </div>
        {state?.success && (
          <p className="text-sm text-green-600" role="status">
            {isEdit ? "Modifiche salvate." : "Viaggio aggiunto correttamente."}
          </p>
        )}
        {state && !state.success && "error" in state && (
          <p className="text-sm text-red-600" role="alert">
            {state.error}
          </p>
        )}
        {state && !state.success && "copyJson" in state && (
          <div className="space-y-3 rounded-lg border border-amber-200 bg-amber-50/80 p-4">
            <p className="text-sm font-medium text-amber-800">
              Impossibile scrivere su file (es. deploy serverless).
            </p>
            <ol className="list-inside list-decimal space-y-1 text-sm text-amber-800">
              <li>Apri il file <code className="bg-amber-100 px-1 rounded">data/trips.json</code> nel progetto.</li>
              <li>Nell’array dei viaggi, aggiungi una virgola dopo l’ultimo elemento (dopo la <code className="bg-amber-100 px-1 rounded">{`}`}</code> finale).</li>
              <li>Incolla sotto il blocco qui sotto (è un singolo oggetto viaggio).</li>
              <li>Salva il file e rifai il deploy.</li>
            </ol>
            <pre className="max-h-48 overflow-auto rounded border border-amber-200 bg-white p-3 text-xs">{state.copyJson}</pre>
            <button
              type="button"
              onClick={handleCopy}
              className="rounded border border-amber-300 bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-900 hover:bg-amber-200"
            >
              {copyLabel}
            </button>
          </div>
        )}
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={backToMeta}
            className="rounded border border-sand bg-white px-4 py-2 text-sm font-medium text-[#2c2c2c] hover:bg-sand/30"
          >
            Torna ai dati viaggio
          </button>
          <button
            type="submit"
            className="rounded bg-[var(--green-leaf)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--green-leaf-dark)]"
          >
            {isEdit ? "Salva modifiche" : "Completa viaggio"}
          </button>
        </div>
      </form>
    </div>
  );
}
