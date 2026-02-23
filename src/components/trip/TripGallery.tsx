import Image from "next/image";
import type { Trip } from "@/types/trip";

interface TripGalleryProps {
  images: Trip["images"];
}

export function TripGallery({ images }: TripGalleryProps) {
  if (!images.length) return null;

  return (
    <section aria-label="Galleria immagini">
      <h2 className="font-serif text-2xl font-medium text-leaf mb-6">
        Galleria
      </h2>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((src, i) => (
          <li key={i} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-sand">
            <Image
              src={src}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
