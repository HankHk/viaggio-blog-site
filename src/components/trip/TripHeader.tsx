import Image from "next/image";
import type { Trip } from "@/types/trip";

interface TripHeaderProps {
  trip: Trip;
}

export function TripHeader({ trip }: TripHeaderProps) {
  const coverImage = trip.images[0] ?? "";

  return (
    <header className="space-y-6">
      <h1 className="font-serif text-3xl font-medium text-[#2c2c2c] sm:text-4xl md:text-5xl">
        {trip.title}
      </h1>
      <p className="text-neutral-light">
        {trip.location} · {trip.date}
      </p>
      <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl bg-sand">
        <Image
          src={coverImage}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 1024px"
          priority
        />
      </div>
    </header>
  );
}
