import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getAllTrips, saveTrips } from "@/lib/trips";

const BROWSER_ID_COOKIE = "trip_browser_id";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function POST(_req: Request, context: RouteContext) {
  try {
    const { slug } = await context.params;
    if (!slug) {
      return NextResponse.json({ error: "Slug mancante." }, { status: 400 });
    }

    const cookieStore = await cookies();
    let browserId = cookieStore.get(BROWSER_ID_COOKIE)?.value;
    const shouldSetCookie = !browserId;
    if (!browserId) browserId = randomUUID();

    const trips = await getAllTrips();
    const tripIndex = trips.findIndex((trip) => trip.slug === slug);
    if (tripIndex === -1) {
      return NextResponse.json({ error: "Viaggio non trovato." }, { status: 404 });
    }

    const trip = trips[tripIndex];
    const likedBySet = new Set((trip.likedByBrowsers ?? []).filter(Boolean));

    let liked: boolean;
    if (likedBySet.has(browserId)) {
      likedBySet.delete(browserId);
      liked = false;
    } else {
      likedBySet.add(browserId);
      liked = true;
    }

    const likedByBrowsers = Array.from(likedBySet);
    const likes = likedByBrowsers.length;
    trips[tripIndex] = {
      ...trip,
      likedByBrowsers,
      likes,
    };

    await saveTrips(trips);

    const response = NextResponse.json({ liked, likes }, { status: 200 });
    if (shouldSetCookie) {
      response.cookies.set(BROWSER_ID_COOKIE, browserId, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: ONE_YEAR_SECONDS,
      });
    }

    return response;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Errore sconosciuto.";
    console.error("[trip-like] ", err);
    return NextResponse.json(
      { error: "Errore server like.", message },
      { status: 500 },
    );
  }
}

