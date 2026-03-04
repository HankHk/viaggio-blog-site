import { TripPageEntry } from "@/components/trip/TripPageEntry";

export default function TripSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TripPageEntry>{children}</TripPageEntry>;
}
