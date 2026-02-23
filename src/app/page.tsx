import { getAllTrips } from "@/lib/trips";
import { HeroSection } from "@/components/home/HeroSection";
import { TripList } from "@/components/home/TripList";

export default function HomePage() {
  const trips = getAllTrips();

  return (
    <>
      <HeroSection />
      <TripList trips={trips} />
    </>
  );
}
