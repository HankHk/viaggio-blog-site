import { getAllTrips } from "@/lib/trips";
import { HeroSection } from "@/components/home/HeroSection";
import { TripList } from "@/components/home/TripList";
import { TravelPatch } from "@/components/home/TravelPatch";
import { travelPatches } from "@/data/travelPatches";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const trips = await getAllTrips();
  const browserId = (await cookies()).get("trip_browser_id")?.value;

  const tripsForView = trips.map((trip) => {
    const browserLiked =
      !!browserId && (trip.likedByBrowsers ?? []).includes(browserId);
    const browserLikes = trip.likes ?? (trip.likedByBrowsers?.length ?? 0);
    return {
      ...trip,
      browserLiked,
      browserLikes,
    };
  });

  return (
    <div className="relative min-h-screen">
      {/* Toppe da viaggio decorative (patch vintage) */}
      {travelPatches.map((patch, index) => (
        <TravelPatch
          key={`${patch.city}-${index}`}
          city={patch.city}
          country={patch.country}
          image={patch.image}
          top={patch.top}
          left={patch.left}
          rotation={patch.rotation}
        />
      ))}
      <div className="relative z-10">
        <HeroSection />
        <TripList trips={tripsForView} />
      </div>
    </div>
  );
}
