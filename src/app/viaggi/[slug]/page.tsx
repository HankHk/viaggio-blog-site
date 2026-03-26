import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { getTripBySlug } from "@/lib/trips";
import { tripToBookPages } from "@/lib/tripBookPages";
import { BackLink } from "@/components/trip/BackLink";
import { TripBook } from "@/components/trip/TripBook";
import { TripPageZoom } from "@/components/trip/TripPageZoom";
import { DecorativePattern } from "@/components/ui/DecorativePattern";
import { TripLikeButton } from "@/components/trip/TripLikeButton";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const trip = await getTripBySlug(slug);
  if (!trip) return { title: "Viaggio non trovato" };
  return {
    title: trip.title,
    description: trip.description,
    openGraph: {
      title: trip.title,
      description: trip.description,
    },
  };
}

export default async function TripPage({ params }: PageProps) {
  const { slug } = await params;
  const trip = await getTripBySlug(slug);
  if (!trip) notFound();

  const pages = tripToBookPages(trip);
  const browserId = (await cookies()).get("trip_browser_id")?.value;
  const initialLiked =
    !!browserId && (trip.likedByBrowsers ?? []).includes(browserId);
  const initialLikes = trip.likes ?? 0;

  return (
    <TripPageZoom>
      <article className="relative">
        <DecorativePattern variant="leaves" animated={false} className="opacity-50" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="mb-6 flex items-center justify-between gap-3">
            <BackLink />
            <TripLikeButton
              slug={trip.slug}
              initialLiked={initialLiked}
              initialLikes={initialLikes}
            />
          </div>
          <TripBook pages={pages} />
        </div>
      </article>
    </TripPageZoom>
  );
}
