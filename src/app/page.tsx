import { getAllTrips } from "@/lib/trips";
import { HeroSection } from "@/components/home/HeroSection";
import { TripList } from "@/components/home/TripList";
import { TravelPatch } from "@/components/home/TravelPatch";
import { travelPatches } from "@/data/travelPatches";

export default function HomePage() {
  const trips = getAllTrips();

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
        <TripList trips={trips} />
      </div>
    </div>
  );
}
