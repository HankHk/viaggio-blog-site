"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { BookPageData } from "@/types/book";
import { BookPageFace } from "./BookPageFace";

const FLIP_DURATION = 0.6;
const EASING = [0.33, 1, 0.68, 1] as const;
const MD_BREAKPOINT = 768;

interface TripBookProps {
  pages: BookPageData[];
}

function spreadCount(pages: BookPageData[]) {
  return Math.floor(pages.length / 2);
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MD_BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile;
}

export function TripBook({ pages }: TripBookProps) {
  const totalSpreads = spreadCount(pages);
  const totalPages = pages.length;

  const [currentSpread, setCurrentSpread] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<"next" | "prev" | null>(
    null,
  );
  const [mounted, setMounted] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  useEffect(() => setMounted(true), []);

  /* Sync mobile page <-> desktop spread when switching between modes */
  useEffect(() => {
    if (isMobile) {
      setCurrentPage(currentSpread * 2);
    } else {
      setCurrentSpread(Math.floor(currentPage / 2));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  const canGoPrev = isMobile ? currentPage > 0 : currentSpread > 0;
  const canGoNext = isMobile
    ? currentPage < totalPages - 1
    : currentSpread < totalSpreads - 1;

  const goNext = useCallback(() => {
    if (!canGoNext || isFlipping) return;
    if (isMobile) {
      setCurrentPage((p) => p + 1);
      return;
    }
    if (mounted && prefersReducedMotion) {
      setCurrentSpread((s) => s + 1);
      return;
    }
    setFlipDirection("next");
    setIsFlipping(true);
  }, [canGoNext, isFlipping, isMobile, mounted, prefersReducedMotion]);

  const goPrev = useCallback(() => {
    if (!canGoPrev || isFlipping) return;
    if (isMobile) {
      setCurrentPage((p) => p - 1);
      return;
    }
    if (mounted && prefersReducedMotion) {
      setCurrentSpread((s) => s - 1);
      return;
    }
    setFlipDirection("prev");
    setIsFlipping(true);
  }, [canGoPrev, isFlipping, isMobile, mounted, prefersReducedMotion]);

  const flipDuration = mounted && prefersReducedMotion ? 0 : FLIP_DURATION;

  const onFlipComplete = useCallback(() => {
    if (flipDirection === "next") setCurrentSpread((s) => s + 1);
    if (flipDirection === "prev") setCurrentSpread((s) => s - 1);
    setFlipDirection(null);
    setIsFlipping(false);
  }, [flipDirection]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goPrev, goNext]);

  /* Touch swipe for mobile: horizontal swipe navigates, vertical scrolls */
  const touchStartRef = useRef({ x: 0, y: 0 });
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  }, []);
  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const dx = touchStartRef.current.x - e.changedTouches[0].clientX;
      const dy = touchStartRef.current.y - e.changedTouches[0].clientY;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        if (dx > 0) goNext();
        else goPrev();
      }
    },
    [goNext, goPrev],
  );

  /* Desktop spread pages */
  const leftPageIndex = currentSpread * 2;
  const rightPageIndex = currentSpread * 2 + 1;
  const leftPage = pages[leftPageIndex];
  const rightPage = pages[rightPageIndex];
  const prevRightPage =
    leftPageIndex >= 2 ? pages[leftPageIndex - 1] : null;
  const nextLeftPage =
    rightPageIndex + 1 < pages.length ? pages[rightPageIndex + 1] : null;

  const pageIndicator = isMobile
    ? `${currentPage + 1} / ${totalPages}`
    : `${currentSpread + 1} / ${totalSpreads}`;

  const navBtnClass =
    "rounded-lg border border-sand bg-[var(--bg-pearl)] px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-medium text-[#2c2c2c] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-sand/50 transition-colors";

  return (
    <div className="flex flex-col items-center gap-4 py-4 md:gap-6 md:py-8">
      {/* Navigation controls */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
        <button
          type="button"
          onClick={goPrev}
          disabled={!canGoPrev || isFlipping}
          className={navBtnClass}
          aria-label="Pagina precedente"
        >
          <span aria-hidden>&#8592;</span> Indietro
        </button>
        <span
          className="text-sm text-[#2c2c2c]/80 tabular-nums min-w-[4rem] text-center"
          aria-live="polite"
        >
          {pageIndicator}
        </span>
        <button
          type="button"
          onClick={goNext}
          disabled={!canGoNext || isFlipping}
          className={navBtnClass}
          aria-label="Pagina successiva"
        >
          Avanti <span aria-hidden>&#8594;</span>
        </button>
      </div>

      {/* Book container */}
      <div
        className="w-full max-w-5xl mx-auto px-2 sm:px-4"
        style={{ perspective: isMobile ? undefined : "2000px" }}
        role="region"
        aria-label="Libro del viaggio"
      >
        {isMobile ? (
          /* ===== MOBILE: single-page view ===== */
          <div
            className="relative w-full rounded-xl bg-sand/30 shadow-xl"
            style={{
              height: "min(68vh, 520px)",
              boxShadow: "0 15px 40px -10px rgba(0,0,0,0.12)",
            }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div className="h-full">
              <BookPageFace page={pages[currentPage]} />
            </div>
          </div>
        ) : (
          /* ===== DESKTOP: spread (2-page) view ===== */
          <div
            className="relative flex w-full rounded-xl overflow-hidden bg-sand/30 shadow-xl"
            style={{
              height: "min(70vh, 560px)",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)",
            }}
          >
            {/* Center spine */}
            <div
              className="absolute left-1/2 top-0 bottom-0 w-px z-10 bg-sand/80 -translate-x-px"
              aria-hidden
            />

            {/* Click zones: narrow strips along the edges instead of full overlay */}
            <button
              type="button"
              className="absolute left-0 top-0 bottom-0 w-12 z-20 cursor-pointer opacity-0 hover:opacity-100 transition-opacity flex items-center justify-start pl-2 disabled:cursor-default"
              onClick={goPrev}
              disabled={!canGoPrev || isFlipping}
              aria-label="Volta pagina indietro"
            >
              <span className="text-[#2c2c2c]/30 text-2xl select-none">
                &#8249;
              </span>
            </button>
            <button
              type="button"
              className="absolute right-0 top-0 bottom-0 w-12 z-20 cursor-pointer opacity-0 hover:opacity-100 transition-opacity flex items-center justify-end pr-2 disabled:cursor-default"
              onClick={goNext}
              disabled={!canGoNext || isFlipping}
              aria-label="Volta pagina avanti"
            >
              <span className="text-[#2c2c2c]/30 text-2xl select-none">
                &#8250;
              </span>
            </button>

            <div
              className="flex w-full h-full"
              style={{ height: "min(70vh, 560px)" }}
            >
              {/* Left page */}
              <div
                className="relative w-1/2 flex-shrink-0"
                style={{ transformStyle: "preserve-3d" }}
              >
                {currentSpread > 0 && prevRightPage ? (
                  <motion.div
                    className="absolute inset-0 flex"
                    style={{
                      transformStyle: "preserve-3d",
                      transformOrigin: "right center",
                    }}
                    initial={false}
                    animate={{
                      rotateY: flipDirection === "prev" ? 0 : -180,
                    }}
                    transition={{ duration: flipDuration, ease: EASING }}
                    onAnimationComplete={
                      flipDirection === "prev" ? onFlipComplete : undefined
                    }
                  >
                    <div
                      className="absolute inset-0 w-full h-full"
                      style={{ backfaceVisibility: "hidden" }}
                    >
                      <div className="h-full w-full rounded-l-lg overflow-hidden">
                        <BookPageFace page={prevRightPage} />
                      </div>
                    </div>
                    <div
                      className="absolute inset-0 w-full h-full"
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                    >
                      <div className="h-full w-full rounded-l-lg overflow-hidden">
                        <BookPageFace page={leftPage} />
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-full w-full rounded-l-lg overflow-hidden">
                    <BookPageFace page={leftPage} />
                  </div>
                )}
              </div>

              {/* Right page */}
              <div
                className="relative w-1/2 flex-shrink-0"
                style={{ transformStyle: "preserve-3d" }}
              >
                {currentSpread < totalSpreads - 1 && nextLeftPage ? (
                  <motion.div
                    className="absolute inset-0 flex"
                    style={{
                      transformStyle: "preserve-3d",
                      transformOrigin: "left center",
                    }}
                    initial={false}
                    animate={{
                      rotateY: flipDirection === "next" ? -180 : 0,
                    }}
                    transition={{ duration: flipDuration, ease: EASING }}
                    onAnimationComplete={
                      flipDirection === "next" ? onFlipComplete : undefined
                    }
                  >
                    <div
                      className="absolute inset-0 w-full h-full"
                      style={{ backfaceVisibility: "hidden" }}
                    >
                      <div className="h-full w-full rounded-r-lg overflow-hidden">
                        <BookPageFace page={rightPage} />
                      </div>
                    </div>
                    <div
                      className="absolute inset-0 w-full h-full"
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                    >
                      <div className="h-full w-full rounded-r-lg overflow-hidden">
                        <BookPageFace page={nextLeftPage} />
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-full w-full rounded-r-lg overflow-hidden">
                    <BookPageFace page={rightPage} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {mounted && prefersReducedMotion && (
        <p className="text-xs text-[#2c2c2c]/60" role="status">
          Animazione ridotta per preferenze di accessibilit&agrave;.
        </p>
      )}
    </div>
  );
}
