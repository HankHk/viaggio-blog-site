import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllTrips, getTripBySlug, getAllSlugs } from "@/lib/trips";
import { BackLink } from "@/components/trip/BackLink";
import { TripHeader } from "@/components/trip/TripHeader";
import { TripGallery } from "@/components/trip/TripGallery";
import { TripCuriosities } from "@/components/trip/TripCuriosities";
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

  return (
    <article className="relative">
      <DecorativePattern variant="leaves" animated={false} className="opacity-50" />
      <div className="relative z-10 mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="mb-8">
          <BackLink />
        </div>

        <TripHeader trip={trip} />

        <div className="mt-12 border-t border-sand pt-12">
          <div className="prose prose-neutral max-w-none">
            <div className="whitespace-pre-line text-[#2c2c2c]/90 leading-relaxed">
              {trip.content}
            </div>
          </div>
        </div>

        {trip.images.length > 1 && (
          <div className="mt-16 border-t border-sand pt-12">
            <TripGallery images={trip.images} />
          </div>
        )}

        {trip.curiosities && trip.curiosities.length > 0 && (
          <div className="mt-16 border-t border-sand pt-12">
            <TripCuriosities curiosities={trip.curiosities} />
          </div>
        )}
      </div>
    </article>
  );
}
