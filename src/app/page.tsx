import { getAllTrips } from "@/lib/trips";
import { HeroSection } from "@/components/home/HeroSection";
import { TripList } from "@/components/home/TripList";
import { ForestBorders } from "@/components/home/ForestBorders";

export default function HomePage() {
  const trips = getAllTrips();

  return (
    <div className="relative">
      <ForestBorders />
      <div className="relative z-10">
        <HeroSection />
        <TripList trips={trips} />
      </div>
    </div>
  );
}
