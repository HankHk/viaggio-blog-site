import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SiteFrame } from "@/components/layout/SiteFrame";
import { ViewportHeightProvider } from "@/components/layout/ViewportHeightProvider";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Between Places - a moving travel journal",
    template: "%s | Between Places",
  },
  description:
    "A moving travel journal. Storie e luoghi dal mondo, un passo alla volta.",
  openGraph: {
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="min-h-screen font-sans antialiased flex flex-col">
        <ViewportHeightProvider />
        <Navbar />
        <main className="flex-1 flex-shrink-0">{children}</main>
        <Footer />
        <SiteFrame />
      </body>
    </html>
  );
}
