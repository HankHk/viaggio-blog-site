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
          className="font-serif text-xl font-medium text-leaf transition-colors hover:text-leaf-dark"
        >
          Viaggio
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
