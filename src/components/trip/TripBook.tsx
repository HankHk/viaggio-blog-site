"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { BookPageData } from "@/types/book";
import { BookPageFace } from "./BookPageFace";

const FLIP_DURATION = 0.6;
const EASING = [0.33, 1, 0.68, 1] as const;

interface TripBookProps {
  pages: BookPageData[];
}

/**
 * Restituisce il numero di spread (coppie di pagine). pages.length è pari.
 */
function spreadCount(pages: BookPageData[]) {
  return Math.floor(pages.length / 2);
}

export function TripBook({ pages }: TripBookProps) {
  const totalSpreads = spreadCount(pages);
  const [currentSpread, setCurrentSpread] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<"next" | "prev" | null>(null);
  const [mounted, setMounted] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => setMounted(true), []);

  /** Usato solo dopo mount per evitare mismatch server/client (useReducedMotion non disponibile in SSR). */
  const use3DFlip = !mounted || !prefersReducedMotion;

  const canGoPrev = currentSpread > 0;
  const canGoNext = currentSpread < totalSpreads - 1;

  const goNext = useCallback(() => {
    if (!canGoNext || isFlipping) return;
    if (mounted && prefersReducedMotion) {
      setCurrentSpread((s) => s + 1);
      return;
    }
    setFlipDirection("next");
    setIsFlipping(true);
  }, [canGoNext, isFlipping, mounted, prefersReducedMotion]);

  const goPrev = useCallback(() => {
    if (!canGoPrev || isFlipping) return;
    if (mounted && prefersReducedMotion) {
      setCurrentSpread((s) => s - 1);
      return;
    }
    setFlipDirection("prev");
    setIsFlipping(true);
  }, [canGoPrev, isFlipping, mounted, prefersReducedMotion]);

  const flipDuration = mounted && prefersReducedMotion ? 0 : FLIP_DURATION;

  // Al termine dell'animazione aggiorna lo spread
  const onFlipComplete = useCallback(() => {
    if (flipDirection === "next") setCurrentSpread((s) => s + 1);
    if (flipDirection === "prev") setCurrentSpread((s) => s - 1);
    setFlipDirection(null);
    setIsFlipping(false);
  }, [flipDirection]);

  // Tastiera: frecce sinistra/destra
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

  const leftPageIndex = currentSpread * 2;
  const rightPageIndex = currentSpread * 2 + 1;
  const leftPage = pages[leftPageIndex];
  const rightPage = pages[rightPageIndex];
  const prevRightPage = leftPageIndex >= 2 ? pages[leftPageIndex - 1] : null;
  const nextLeftPage = rightPageIndex + 1 < pages.length ? pages[rightPageIndex + 1] : null;

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      {/* Indicatore pagina e controlli */}
      <div className="flex items-center justify-center gap-4 flex-wrap">
        <button
          type="button"
          onClick={goPrev}
          disabled={!canGoPrev || isFlipping}
          className="rounded-lg border border-sand bg-[var(--bg-pearl)] px-4 py-2 text-sm font-medium text-[#2c2c2c] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-sand/50 transition-colors"
          aria-label="Pagina precedente"
        >
          Indietro
        </button>
        <span className="text-sm text-[#2c2c2c]/80" aria-live="polite">
          Pagina {currentSpread + 1} di {totalSpreads}
        </span>
        <button
          type="button"
          onClick={goNext}
          disabled={!canGoNext || isFlipping}
          className="rounded-lg border border-sand bg-[var(--bg-pearl)] px-4 py-2 text-sm font-medium text-[#2c2c2c] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-sand/50 transition-colors"
          aria-label="Pagina successiva"
        >
          Avanti
        </button>
      </div>

      {/* Libro: container 3D con perspective */}
      <div
        className="w-full max-w-5xl mx-auto px-2 sm:px-4"
        style={{ perspective: "2000px" }}
        role="region"
        aria-label="Libro del viaggio"
      >
        <div
          className="relative flex w-full rounded-xl overflow-hidden bg-sand/30 shadow-xl min-h-[65vh] sm:min-h-[min(70vh,520px)]"
          style={{
            minHeight: "min(70vh, 520px)",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)",
          }}
        >
          {/* Spina centrale (solo desktop, tra le due pagine) */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-px z-10 bg-sand/80 -translate-x-px hidden md:block"
            aria-hidden
          />

          {/* Metà sinistra cliccabile per indietro */}
          <button
            type="button"
            className="absolute left-0 top-0 bottom-0 w-1/2 z-20 cursor-pointer disabled:cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-leaf focus-visible:ring-inset"
            onClick={goPrev}
            disabled={!canGoPrev || isFlipping}
            aria-label="Volta pagina indietro"
          />

          {/* Metà destra cliccabile per avanti */}
          <button
            type="button"
            className="absolute right-0 top-0 bottom-0 w-1/2 z-20 cursor-pointer disabled:cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-leaf focus-visible:ring-inset"
            onClick={goNext}
            disabled={!canGoNext || isFlipping}
            aria-label="Volta pagina avanti"
          />

          <div
            className="flex w-full h-full min-h-[65vh] sm:min-h-[min(70vh,520px)]"
            style={{ minHeight: "min(70vh, 520px)" }}
          >
            {/* Pagina sinistra: su mobile nascosta, su desktop metà sinistra */}
            <div
              className="relative w-0 flex-shrink-0 overflow-hidden md:w-1/2 md:overflow-visible"
              style={{ transformStyle: "preserve-3d" }}
            >
              {canGoPrev && prevRightPage ? (
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
                  transition={{
                    duration: flipDuration,
                    ease: EASING,
                  }}
                  onAnimationComplete={flipDirection === "prev" ? onFlipComplete : undefined}
                >
                  {/* Fronte (visibile a 0°): pagina destra dello spread precedente */}
                  <div
                    className="absolute inset-0 w-full h-full"
                    style={{
                      backfaceVisibility: "hidden",
                    }}
                  >
                    <div className="h-full w-full rounded-l-lg overflow-hidden">
                      <BookPageFace page={prevRightPage} />
                    </div>
                  </div>
                  {/* Retro (visibile a -180°): pagina sinistra corrente */}
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

            {/* Pagina destra: su mobile full width, su desktop metà destra */}
            <div
              className="relative w-full flex-shrink-0 md:w-1/2"
              style={{ transformStyle: "preserve-3d" }}
            >
              {canGoNext && nextLeftPage ? (
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
                  transition={{
                    duration: flipDuration,
                    ease: EASING,
                  }}
                  onAnimationComplete={flipDirection === "next" ? onFlipComplete : undefined}
                >
                  {/* Fronte: pagina destra corrente */}
                  <div
                    className="absolute inset-0 w-full h-full"
                    style={{
                      backfaceVisibility: "hidden",
                    }}
                  >
                    <div className="h-full w-full rounded-r-lg overflow-hidden">
                      <BookPageFace page={rightPage} />
                    </div>
                  </div>
                  {/* Retro: pagina sinistra dello spread successivo */}
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
      </div>

      {mounted && prefersReducedMotion && (
        <p className="text-xs text-[#2c2c2c]/60" role="status">
          Animazione ridotta per preferenze di accessibilità.
        </p>
      )}
    </div>
  );
}
