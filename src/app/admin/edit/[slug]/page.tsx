import { notFound } from "next/navigation";
import Link from "next/link";
import { getTripBySlug } from "@/lib/trips";
import { TripForm } from "../../TripForm";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function AdminEditTripPage({ params }: Props) {
  const { slug } = await params;
  const trip = await getTripBySlug(slug);
  if (!trip) notFound();

  return (
    <div className="min-h-screen bg-[var(--bg-pearl)] px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <p className="mb-4 text-sm text-[#2c2c2c]/70">
          <Link href="/admin" className="underline hover:no-underline">
            ← Torna all’admin
          </Link>
        </p>
        <TripForm initialTrip={trip} />
      </div>
    </div>
  );
}
