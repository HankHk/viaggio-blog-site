"use client";

import Image from "next/image";
import type { BookPageData } from "@/types/book";

interface BookPageFaceProps {
  page: BookPageData;
  /** Per stile consistente con le pagine del libro (altezza/area contenuto) */
  className?: string;
}

/**
 * Singola faccia di una pagina del libro: contenuto + stile "pagina" (carta, padding) e backface-hidden.
 */
export function BookPageFace({ page, className = "" }: BookPageFaceProps) {
  const base =
    "h-full w-full min-h-0 overflow-auto bg-[var(--bg-pearl)] border border-sand/80 shadow-md flex flex-col [backface-visibility:hidden] " +
    className;

  switch (page.type) {
    case "cover-left":
      return (
        <div className={base + " justify-center px-5 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10"}>
          <h1 className="font-serif text-xl font-medium text-[#2c2c2c] sm:text-2xl md:text-3xl">
            {page.title}
          </h1>
          <p className="mt-3 text-neutral-light text-sm sm:text-base">
            {page.location} · {page.date}
          </p>
        </div>
      );

    case "cover-right":
      if (!page.coverImage) return <div className={base} />;
      return (
        <div className={base + " relative p-0 overflow-hidden"}>
          <Image
            src={page.coverImage}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      );

    case "text":
      return (
        <div className={base + " px-5 py-5 sm:px-6 sm:py-6 md:px-8 md:py-8"}>
          <div className="prose prose-neutral max-w-none flex-1">
            {page.title && (
              <h2 className="font-serif text-lg font-medium text-[var(--green-leaf)] mb-2 sm:text-xl sm:mb-3">
                {page.title}
              </h2>
            )}
            {page.text && (
              <div className="whitespace-pre-line text-[#2c2c2c]/90 leading-relaxed text-base sm:text-base md:text-base">
                {page.text}
              </div>
            )}
            {page.images && page.images.length > 0 && (
              <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {page.images.map((src, i) => (
                  <li
                    key={i}
                    className="relative aspect-[4/3] overflow-hidden rounded-lg bg-sand"
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      );

    case "gallery":
      if (!page.images?.length) return <div className={base} />;
      return (
        <div className={base + " px-5 py-5 sm:px-6 sm:py-6 md:px-8 md:py-8"}>
          <h2 className="font-serif text-lg font-medium text-leaf mb-3 sm:text-xl sm:mb-4">Galleria</h2>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {page.images.map((src, i) => (
              <li
                key={i}
                className="relative aspect-[4/3] overflow-hidden rounded-lg bg-sand"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
              </li>
            ))}
          </ul>
        </div>
      );

    case "curiosities":
      if (!page.curiosities?.length) return <div className={base} />;
      return (
        <div className={base + " px-5 py-5 sm:px-6 sm:py-6 md:px-8 md:py-8"}>
          <h2 className="font-serif text-lg font-medium text-leaf mb-3 sm:text-xl sm:mb-4">Curiosità</h2>
          <ul className="space-y-2">
            {page.curiosities.map((text, i) => (
              <li key={i} className="flex gap-2 text-[#2c2c2c]/90 text-base">
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf"
                  aria-hidden
                />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      );

    case "blank":
    default:
      return <div className={base} aria-hidden />;
  }
}
