"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Trip } from "@/types/trip";

interface TripCardProps {
  trip: Trip;
  index: number;
  priority?: boolean;
}

export function TripCard({ trip, index, priority = false }: TripCardProps) {
  const coverImage = trip.images[0] ?? "";

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group"
    >
      <Link href={`/viaggi/${trip.slug}`} className="block">
        <div className="overflow-hidden rounded-2xl border border-sand bg-pearl shadow-md transition-all duration-300 ease-out hover:border-leaf/30 hover:shadow-lg">
          <div className="flex flex-col sm:flex-row">
            <div className="relative h-48 w-full shrink-0 sm:h-52 sm:w-56">
              <Image
                src={coverImage}
                alt=""
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, 224px"
                priority={priority}
              />
            </div>
            <div className="flex flex-1 flex-col justify-center p-4 sm:p-6">
              <h2 className="font-serif text-xl font-semibold text-leaf group-hover:text-leaf-dark transition-colors">
                {trip.title}
              </h2>
              <p className="mt-1 text-sm text-neutral-light">
                {trip.location} · {trip.date}
              </p>
              <p className="mt-2 line-clamp-2 text-sm text-[#2c2c2c]/85">
                {trip.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {trip.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-sand px-2.5 py-0.5 text-xs text-leaf"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
