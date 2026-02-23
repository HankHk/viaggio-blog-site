"use client";

import { TripCard } from "./TripCard";
import type { Trip } from "@/types/trip";

interface TripListProps {
  trips: Trip[];
}

export function TripList({ trips }: TripListProps) {
  return (
    <section
      id="viaggi"
      className="mx-auto max-w-4xl space-y-8 px-4 py-12 sm:px-6"
      aria-label="Elenco viaggi"
    >
      <h2 className="font-serif text-2xl font-medium text-leaf">I viaggi</h2>
      <ul className="space-y-8">
        {trips.map((trip, index) => (
          <li key={trip.slug}>
            <TripCard trip={trip} index={index} priority={index === 0} />
          </li>
        ))}
      </ul>
    </section>
  );
}
