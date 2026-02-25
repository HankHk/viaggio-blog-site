"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#viaggi", label: "Viaggi" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-sand bg-pearl/95 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="flex flex-col sm:flex-row sm:items-baseline gap-0 sm:gap-1.5 transition-colors hover:text-leaf-dark text-leaf"
        >
          <span className="font-serif text-lg sm:text-xl font-semibold leading-tight">
            Between Places
          </span>
          <span className="font-sans text-xs sm:text-sm text-neutral-light font-normal">
            a moving travel journal
          </span>
        </Link>
        <ul className="flex gap-6">
          {navLinks.map(({ href, label }) => {
            const isActive =
              pathname === href || (href === "/#viaggi" && pathname.startsWith("/viaggi"));
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`text-sm font-medium transition-colors ${
                    isActive
                      ? "text-leaf-dark"
                      : "text-neutral-light hover:text-leaf"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
