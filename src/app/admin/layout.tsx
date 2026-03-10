import type { Metadata } from "next";
import { AdminFrameHide } from "./AdminFrameHide";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminFrameHide />
      {children}
    </>
  );
}
