import { readFile, writeFile } from "fs/promises";
import path from "path";
import { get, put } from "@vercel/blob";
import type { Trip, ContentBlock } from "@/types/trip";

const TRIPS_BLOB_PATHNAME = "trips.json";
const TRIPS_FILE = path.join(process.cwd(), "data", "trips.json");

function isBlobStorageEnabled(): boolean {
  if (process.env.NODE_ENV === "development") return false;
  return typeof process.env.BLOB_READ_WRITE_TOKEN === "string" && process.env.BLOB_READ_WRITE_TOKEN.length > 0;
}

/** Converte content da formato legacy (string[]) a ContentBlock[] se necessario. */
export function normalizeTrip(trip: Trip): Trip {
  const raw = trip.content;
  if (!Array.isArray(raw)) return { ...trip, content: [] };
  const content: ContentBlock[] = raw.map((item): ContentBlock => {
    if (typeof item === "string") return { text: item };
    const block = item as ContentBlock;
    return {
      title: block.title,
      text: block.text ?? "",
      images: block.images,
    };
  });
  const likedByBrowsers = Array.isArray(trip.likedByBrowsers)
    ? trip.likedByBrowsers.filter(
        (id): id is string => typeof id === "string" && id.trim().length > 0,
      )
    : [];
  const likes =
    typeof trip.likes === "number" && trip.likes >= 0
      ? Math.max(trip.likes, likedByBrowsers.length)
      : likedByBrowsers.length;

  return { ...trip, content, likedByBrowsers, likes };
}

async function loadTripsFromFile(): Promise<Trip[]> {
  const data = await readFile(TRIPS_FILE, "utf-8");
  const trips = JSON.parse(data) as Trip[];
  return trips.map(normalizeTrip);
}


async function loadTrips(): Promise<Trip[]> {
  if (isBlobStorageEnabled()) {
    try {
      const result = await get(TRIPS_BLOB_PATHNAME, { access: "private" });
      if (result && result.statusCode === 200 && result.stream) {
        const text = await new Response(result.stream).text();
        const parsed = JSON.parse(text || "[]") as Trip[];
        return parsed.map(normalizeTrip);
      }
    } catch {
      // Errore di rete o blob non trovato
    }
    const trips = await loadTripsFromFile();
    try {
      await saveTripsToBlob(trips);
    } catch {
      // Prima migrazione può fallire se il file non esiste in build
    }
    return trips;
  }
  return loadTripsFromFile();
}

async function saveTripsToBlob(trips: Trip[]): Promise<void> {
  await put(TRIPS_BLOB_PATHNAME, JSON.stringify(trips, null, 2), {
    access: "private",
    allowOverwrite: true,
    contentType: "application/json",
  });
}

export function getTripsFilePath(): string {
  return TRIPS_FILE;
}

export async function getAllTrips(): Promise<Trip[]> {
  return loadTrips();
}

export async function getTripBySlug(slug: string): Promise<Trip | undefined> {
  const trips = await loadTrips();
  return trips.find((t) => t.slug === slug);
}

export async function getAllSlugs(): Promise<string[]> {
  const trips = await loadTrips();
  return trips.map((t) => t.slug);
}

export async function saveTrips(trips: Trip[]): Promise<void> {
  if (isBlobStorageEnabled()) {
    await saveTripsToBlob(trips);
    return;
  }
  await writeFile(TRIPS_FILE, JSON.stringify(trips, null, 2), "utf-8");
}
