import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllTrips, getTripBySlug, getAllSlugs } from "@/lib/trips";
import { tripToBookPages } from "@/lib/tripBookPages";
import { BackLink } from "@/components/trip/BackLink";
import { TripBook } from "@/components/trip/TripBook";
import { DecorativePattern } from "@/components/ui/DecorativePattern";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const trip = getTripBySlug(slug);
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
  const trip = getTripBySlug(slug);
  if (!trip) notFound();

  const pages = tripToBookPages(trip);

  return (
    <article className="relative">
      <DecorativePattern variant="leaves" animated={false} className="opacity-50" />
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <BackLink />
        </div>
        <TripBook pages={pages} />
      </div>
    </article>
  );
}
