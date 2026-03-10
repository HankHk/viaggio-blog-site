"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";
import { getAllTrips, saveTrips } from "@/lib/trips";
import type { Trip } from "@/types/trip";

const COOKIE_NAME = "admin_session";
const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 1 giorno

function getSecret(): string {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) throw new Error("ADMIN_PASSWORD non configurata");
  return secret;
}

function signPayload(payload: object): string {
  const secret = getSecret();
  const data = JSON.stringify(payload);
  const sig = createHmac("sha256", secret).update(data).digest("base64url");
  const b64 = Buffer.from(data, "utf-8").toString("base64url");
  return `${b64}.${sig}`;
}

function verifyPayload(token: string): boolean {
  try {
    const secret = getSecret();
    const [b64, sig] = token.split(".");
    if (!b64 || !sig) return false;
    const data = Buffer.from(b64, "base64url").toString("utf-8");
    const expected = createHmac("sha256", secret).update(data).digest("base64url");
    if (!timingSafeEqual(Buffer.from(sig, "utf-8"), Buffer.from(expected, "utf-8")))
      return false;
    const payload = JSON.parse(data) as { exp: number };
    return Date.now() < payload.exp;
  } catch {
    return false;
  }
}

export async function loginAction(_prev: unknown, formData: FormData): Promise<{ error?: string }> {
  const password = formData.get("password") as string | null;
  if (!password?.trim()) return { error: "Inserisci la password." };
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected)
    return {
      error:
        "Variabile ADMIN_PASSWORD mancante. Su Vercel: Project → Settings → Environment Variables, aggiungi ADMIN_PASSWORD, poi rifai il deploy.",
    };
  const hash = (s: string) => createHmac("sha256", "admin-login").update(s).digest();
  if (!timingSafeEqual(hash(password.trim()), hash(expected)))
    return { error: "Password non corretta." };
  const payload = { exp: Date.now() + SESSION_MAX_AGE_MS };
  const value = signPayload(payload);
  const store = await cookies();
  store.set(COOKIE_NAME, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 86400,
    path: "/admin",
  });
  return {};
}

export async function isAdminSession(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  return !!token && verifyPayload(token);
}

function parseList(value: string): string[] {
  return value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

type AddTripResult =
  | { success: true }
  | { success: false; error: string }
  | { success: false; copyJson: string };

export async function addTripAction(_prev: unknown, formData: FormData): Promise<AddTripResult> {
  const ok = await isAdminSession();
  if (!ok) return { success: false, error: "Sessione scaduta. Esegui di nuovo l’accesso." };

  const title = (formData.get("title") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim().toLowerCase().replace(/\s+/g, "-");
  const location = (formData.get("location") as string)?.trim();
  const date = (formData.get("date") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();
  const imagesRaw = (formData.get("images") as string)?.trim();
  const tagsRaw = (formData.get("tags") as string)?.trim();
  const curiositiesRaw = (formData.get("curiosities") as string)?.trim();

  if (!title) return { success: false, error: "Titolo obbligatorio." };
  if (!slug) return { success: false, error: "Slug obbligatorio." };
  const DEFAULT_IMAGE =
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200";
  const images = parseList(imagesRaw || "");
  const imagesToUse = images.length > 0 ? images : [DEFAULT_IMAGE];
  const editSlug = (formData.get("_editSlug") as string)?.trim() || null;
  const isEdit = !!editSlug;

  const trips = await getAllTrips();
  let trip: Trip;
  if (isEdit) {
    const index = trips.findIndex((t) => t.slug === editSlug);
    if (index === -1) return { success: false, error: "Viaggio da modificare non trovato." };
    trip = {
      title,
      slug: editSlug,
      location: location || "",
      date: date || "",
      description: description || "",
      content: content || "",
      images: imagesToUse,
      tags: parseList(tagsRaw || ""),
    };
    if (parseList(curiositiesRaw || "").length > 0) trip.curiosities = parseList(curiositiesRaw || "");
    trips[index] = trip;
  } else {
    if (trips.some((t) => t.slug === slug))
      return { success: false, error: "Esiste già un viaggio con questo slug." };
    trip = {
      title,
      slug,
      location: location || "",
      date: date || "",
      description: description || "",
      content: content || "",
      images: imagesToUse,
      tags: parseList(tagsRaw || ""),
    };
    if (parseList(curiositiesRaw || "").length > 0) trip.curiosities = parseList(curiositiesRaw || "");
    trips.push(trip);
  }

  try {
    await saveTrips(trips);
    redirect(`/viaggi/${trip.slug}`);
  } catch {
    return { success: false, copyJson: JSON.stringify(trip, null, 2) };
  }
}

export async function deleteTripAction(slug: string): Promise<{ error?: string }> {
  const ok = await isAdminSession();
  if (!ok) return { error: "Sessione scaduta. Esegui di nuovo l'accesso." };

  const trips = await getAllTrips();
  const filtered = trips.filter((t) => t.slug !== slug);
  if (filtered.length === trips.length)
    return { error: "Viaggio non trovato." };

  try {
    await saveTrips(filtered);
    redirect("/admin");
  } catch {
    return { error: "Impossibile eliminare il viaggio." };
  }
}
