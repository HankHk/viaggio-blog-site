"use client";

import { useMemo, useState } from "react";
import { TripCard } from "./TripCard";
import type { Trip } from "@/types/trip";

interface TripListItem extends Trip {
  browserLiked: boolean;
  browserLikes: number;
}

interface TripListProps {
  trips: TripListItem[];
}

export function TripList({ trips }: TripListProps) {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "likes">("recent");

  const normalizeForSearch = (value: string) =>
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[-_]/g, " ")
      .trim();

  const filteredTrips = useMemo(() => {
    const normalizedQuery = normalizeForSearch(query);
    if (!normalizedQuery) return trips;

    const queryTerms = normalizedQuery.split(/\s+/).filter(Boolean);

    return trips.filter((trip) => {
      const title = normalizeForSearch(trip.title);
      const slug = normalizeForSearch(trip.slug);
      const tags = (trip.tags ?? []).map(normalizeForSearch);

      return queryTerms.every(
        (term) =>
          title.includes(term) ||
          slug.includes(term) ||
          tags.some((tag) => tag.includes(term)),
      );
    });
  }, [trips, query]);

  const visibleTrips = useMemo(() => {
    const withIndex = filteredTrips.map((trip, idx) => ({
      ...trip,
      _idx: idx,
    }));

    withIndex.sort((a, b) => {
      if (sortBy === "likes") {
        const dl = (b.browserLikes ?? 0) - (a.browserLikes ?? 0);
        if (dl !== 0) return dl;
        return (b._idx ?? 0) - (a._idx ?? 0);
      }
      // "recent": ordine originale (ultimi in `trips.json` più recenti)
      return (b._idx ?? 0) - (a._idx ?? 0);
    });

    return withIndex;
  }, [filteredTrips, sortBy]);

  return (
    <section
      id="viaggi"
      className="mx-auto max-w-4xl space-y-6 sm:space-y-8 px-3 py-8 sm:px-6 sm:py-12"
      aria-label="Elenco viaggi"
    >
      <h2 className="font-serif text-2xl font-medium text-leaf">I viaggi</h2>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex-1 space-y-2">
          <label
            htmlFor="trip-search"
            className="block text-sm font-medium text-[#2c2c2c]"
          >
            Cerca il viaggio
          </label>
          <input
            id="trip-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Es. kyoto oppure kyoto-primavera"
            className="w-full rounded border border-sand bg-white px-3 py-2 text-sm text-[#2c2c2c] placeholder:text-[#2c2c2c]/50"
            aria-label="Cerca viaggi per titolo o slug"
          />
        </div>

        <div className="space-y-1">
          <div className="text-xs font-medium text-[#2c2c2c]/70">Ordina</div>
          <div
            className="inline-flex rounded-full border border-sand bg-white p-1 shadow-sm"
            role="tablist"
            aria-label="Ordinamento viaggi"
          >
            <button
              type="button"
              role="tab"
              aria-selected={sortBy === "recent"}
              onClick={() => setSortBy("recent")}
              className={
                "rounded-full px-3 py-1 text-xs font-medium transition " +
                (sortBy === "recent"
                  ? "bg-[var(--green-leaf)] text-white"
                  : "bg-transparent text-[#2c2c2c]/80 hover:bg-sand/30")
              }
            >
              Più recenti
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={sortBy === "likes"}
              onClick={() => setSortBy("likes")}
              className={
                "rounded-full px-3 py-1 text-xs font-medium transition " +
                (sortBy === "likes"
                  ? "bg-[var(--green-leaf)] text-white"
                  : "bg-transparent text-[#2c2c2c]/80 hover:bg-sand/30")
              }
            >
              Più like
            </button>
          </div>
        </div>
      </div>
      <ul className="space-y-6 sm:space-y-8">
        {visibleTrips.map((trip, index) => (
          <li key={trip.slug}>
            <TripCard
              trip={trip}
              index={index}
              priority={index === 0}
              browserLiked={trip.browserLiked}
              browserLikes={trip.browserLikes}
            />
          </li>
        ))}
      </ul>
      {visibleTrips.length === 0 && (
        <p className="text-sm text-[#2c2c2c]/70" role="status">
          Nessun viaggio trovato per questa ricerca.
        </p>
      )}
    </section>
  );
}
