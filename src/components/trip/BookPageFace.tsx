"use client";

import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { BookPageData } from "@/types/book";

interface BookPageFaceProps {
  page: BookPageData;
  className?: string;
}

export function BookPageFace({ page, className = "" }: BookPageFaceProps) {
  const base =
    "h-full w-full min-h-0 overflow-hidden bg-[var(--bg-pearl)] border border-sand/80 shadow-md flex flex-col " +
    className;

  switch (page.type) {
    case "cover-left":
      return (
        <div
          className={
            base +
            " justify-center px-4 py-5 sm:px-6 sm:py-8 md:px-8 md:py-10"
          }
        >
          <h1 className="font-serif text-xl font-medium text-[#2c2c2c] sm:text-2xl md:text-3xl">
            {page.title}
          </h1>
          <p className="mt-2 text-neutral-light text-sm sm:mt-3 sm:text-base">
            {page.location} &middot; {page.date}
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
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      );

    case "text":
      return (
        <div
          className={
            base + " px-4 py-4 sm:px-5 sm:py-5 md:px-8 md:py-8"
          }
        >
          {page.title && (
            <h2 className="font-serif text-base font-semibold text-[var(--green-leaf)] mb-1.5 shrink-0 sm:text-lg sm:mb-2 md:text-xl md:mb-3">
              {page.title}
            </h2>
          )}

          {page.text && (
            <div className="prose prose-neutral prose-img:my-2 max-w-none flex-1 min-h-0 overflow-hidden">
              <div className="text-[#2c2c2c]/90 leading-relaxed text-sm sm:text-base">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => (
                      <h2 className="font-serif text-base font-semibold text-[#2c2c2c] mb-1.5 sm:text-lg sm:mb-2 md:text-xl">
                        {children}
                      </h2>
                    ),
                    h2: ({ children }) => (
                      <h3 className="font-serif text-sm font-semibold text-[#2c2c2c] mb-1.5 sm:text-base sm:mb-2 md:text-lg">
                        {children}
                      </h3>
                    ),
                    h3: ({ children }) => (
                      <h4 className="font-serif text-sm font-semibold text-[#2c2c2c] mb-1 sm:text-base">
                        {children}
                      </h4>
                    ),
                    p: ({ children }) => (
                      <p className="mb-2 last:mb-0 sm:mb-3">{children}</p>
                    ),
                    img: ({ src, alt }) => (
                      <span className="my-2 flex justify-center sm:my-3">
                        <img
                          src={src ?? ""}
                          alt={alt ?? ""}
                          className="max-w-full w-auto max-h-[180px] sm:max-h-[200px] object-contain rounded-lg"
                        />
                      </span>
                    ),
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--green-leaf)] underline underline-offset-2"
                      >
                        {children}
                      </a>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold">{children}</strong>
                    ),
                    em: ({ children }) => (
                      <em className="italic">{children}</em>
                    ),
                  }}
                >
                  {page.text}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {page.images && page.images.length > 0 && (
            <ul className="mt-3 grid grid-cols-1 gap-2 shrink-0 sm:mt-4 sm:grid-cols-2">
              {page.images.map((src, i) => (
                <li
                  key={i}
                  className="relative aspect-[16/10] overflow-hidden rounded-lg bg-sand"
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      );

    case "gallery":
      if (!page.images?.length) return <div className={base} />;
      return (
        <div
          className={
            base + " px-4 py-4 sm:px-5 sm:py-5 md:px-8 md:py-8"
          }
        >
          <h2 className="font-serif text-base font-medium text-leaf mb-2 shrink-0 sm:text-lg sm:mb-3 md:text-xl md:mb-4">
            Galleria
          </h2>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
            {page.images.map((src, i) => (
              <li
                key={i}
                className="relative aspect-[16/10] overflow-hidden rounded-lg bg-sand"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                />
              </li>
            ))}
          </ul>
        </div>
      );

    case "curiosities":
      if (!page.curiosities?.length) return <div className={base} />;
      return (
        <div
          className={
            base + " px-4 py-4 sm:px-5 sm:py-5 md:px-8 md:py-8"
          }
        >
          <h2 className="font-serif text-base font-medium text-leaf mb-2 sm:text-lg sm:mb-3 md:text-xl md:mb-4">
            Curiosit&agrave;
          </h2>
          <ul className="space-y-1.5 sm:space-y-2">
            {page.curiosities.map((text, i) => (
              <li
                key={i}
                className="flex gap-2 text-[#2c2c2c]/90 text-sm sm:text-base"
              >
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
