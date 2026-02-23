import type { Trip } from "@/types/trip";

interface TripCuriositiesProps {
  curiosities: NonNullable<Trip["curiosities"]>;
}

export function TripCuriosities({ curiosities }: TripCuriositiesProps) {
  if (!curiosities.length) return null;

  return (
    <section aria-label="Curiosità e highlight">
      <h2 className="font-serif text-2xl font-medium text-leaf mb-6">
        Curiosità
      </h2>
      <ul className="space-y-3">
        {curiosities.map((text, i) => (
          <li
            key={i}
            className="flex gap-3 text-[#2c2c2c]/90"
          >
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf" aria-hidden />
            <span>{text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
