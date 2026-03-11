import { readFile, writeFile } from "fs/promises";
import path from "path";
import { get, put } from "@vercel/blob";
import type { Trip } from "@/types/trip";

const TRIPS_BLOB_PATHNAME = "trips.json";
const TRIPS_FILE = path.join(process.cwd(), "data", "trips.json");

function isBlobStorageEnabled(): boolean {
  if (process.env.NODE_ENV === "development") return false;
  return typeof process.env.BLOB_READ_WRITE_TOKEN === "string" && process.env.BLOB_READ_WRITE_TOKEN.length > 0;
}

async function loadTripsFromFile(): Promise<Trip[]> {
  const data = await readFile(TRIPS_FILE, "utf-8");
  return JSON.parse(data) as Trip[];
}


async function loadTrips(): Promise<Trip[]> {
  if (isBlobStorageEnabled()) {
    try {
      const result = await get(TRIPS_BLOB_PATHNAME, { access: "private" });
      if (result && result.statusCode === 200 && result.stream) {
        const text = await new Response(result.stream).text();
        return JSON.parse(text || "[]") as Trip[];
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
