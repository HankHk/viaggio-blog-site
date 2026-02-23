import type { Trip } from "@/types/trip";
import tripsData from "../../data/trips.json";

const trips = tripsData as Trip[];

export function getAllTrips(): Trip[] {
  return trips;
}

export function getTripBySlug(slug: string): Trip | undefined {
  return trips.find((t) => t.slug === slug);
}

export function getAllSlugs(): string[] {
  return trips.map((t) => t.slug);
}
