"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import type { BookPageData } from "@/types/book";
import { BookPageFace } from "./BookPageFace";

const MD_BREAKPOINT = 768;
const FLIP_DURATION = 0.6;
const FLIP_EASE: [number, number, number, number] = [0.45, 0.05, 0.55, 0.95];

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

type FlipState = "idle" | "flipping-next" | "flipping-prev";

export function TripBook({ pages }: TripBookProps) {
  const isMobile = useIsMobile();
  const mobilePages = pages.filter((p) => p.type !== "blank");
  const totalSpreads = spreadCount(pages);
  const totalMobilePages = mobilePages.length;

  const [currentSpread, setCurrentSpread] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [flipState, setFlipState] = useState<FlipState>("idle");
  const [mobileDirection, setMobileDirection] = useState(0);

  const flipRotation = useMotionValue(0);
  const flipProgress = useTransform(flipRotation, (v) => Math.abs(v) / 180);
  const frontOpacity = useTransform(
    flipProgress,
    [0, 0.49, 0.5, 1],
    [1, 1, 0, 0],
  );
  const backOpacity = useTransform(
    flipProgress,
    [0, 0.49, 0.5, 1],
    [0, 0, 1, 1],
  );
  const shadowIntensity = useTransform(
    flipProgress,
    [0, 0.5, 1],
    [0, 0.3, 0],
  );

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
    ? currentPage < totalMobilePages - 1
    : currentSpread < totalSpreads - 1;

  const goNext = useCallback(() => {
    if (isMobile) {
      if (currentPage >= totalMobilePages - 1) return;
      setMobileDirection(1);
      setCurrentPage((p) => p + 1);
    } else {
      if (flipState !== "idle" || currentSpread >= totalSpreads - 1) return;
      setFlipState("flipping-next");
    }
  }, [isMobile, currentPage, totalMobilePages, flipState, currentSpread, totalSpreads]);

  const goPrev = useCallback(() => {
    if (isMobile) {
      if (currentPage <= 0) return;
      setMobileDirection(-1);
      setCurrentPage((p) => p - 1);
    } else {
      if (flipState !== "idle" || currentSpread <= 0) return;
      setFlipState("flipping-prev");
    }
  }, [isMobile, currentPage, flipState, currentSpread]);

  useEffect(() => {
    if (flipState === "idle") return;

    flipRotation.set(0);
    const target = flipState === "flipping-next" ? -180 : 180;
    const captured = flipState;

    const controls = animate(flipRotation, target, {
      duration: FLIP_DURATION,
      ease: FLIP_EASE,
      onComplete: () => {
        if (captured === "flipping-next") {
          setCurrentSpread((s) => s + 1);
        } else {
          setCurrentSpread((s) => s - 1);
        }
        setFlipState("idle");
      },
    });

    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flipState]);

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

  const leftPage = pages[currentSpread * 2];
  const rightPage = pages[currentSpread * 2 + 1];

  const nextLeftPage =
    currentSpread < totalSpreads - 1
      ? pages[(currentSpread + 1) * 2]
      : null;
  const nextRightPage =
    currentSpread < totalSpreads - 1
      ? pages[(currentSpread + 1) * 2 + 1]
      : null;
  const prevLeftPage =
    currentSpread > 0 ? pages[(currentSpread - 1) * 2] : null;
  const prevRightPage =
    currentSpread > 0 ? pages[(currentSpread - 1) * 2 + 1] : null;

  const pageIndicator = isMobile
    ? `${currentPage + 1} / ${totalMobilePages}`
    : `${currentSpread + 1} / ${totalSpreads}`;

  const navBtnClass =
    "rounded-lg border border-sand bg-[var(--bg-pearl)] px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-medium text-[#2c2c2c] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-sand/50 transition-colors";

  const isFlipping = flipState !== "idle";

  const mobileVariants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -60 : 60 }),
  };

  return (
    <div className="flex flex-col items-center gap-4 py-4 md:gap-6 md:py-8">
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

      <div
        className="w-full max-w-5xl mx-auto px-2 sm:px-4"
        role="region"
        aria-label="Libro del viaggio"
      >
        {isMobile ? (
          <div
            className="relative w-full rounded-xl bg-sand/30 shadow-xl overflow-hidden"
            style={{
              height: "min(68vh, 520px)",
              boxShadow: "0 15px 40px -10px rgba(0,0,0,0.12)",
            }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <AnimatePresence mode="wait" custom={mobileDirection}>
              <motion.div
                key={currentPage}
                custom={mobileDirection}
                variants={mobileVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <BookPageFace page={mobilePages[currentPage]} />
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          <div
            className="relative w-full rounded-xl bg-sand/30 shadow-xl overflow-hidden"
            style={{
              height: "min(70vh, 560px)",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)",
              perspective: "1800px",
            }}
          >
            {/* Center spine */}
            <div
              className="absolute left-1/2 top-0 bottom-0 w-px z-[5] bg-sand/80 -translate-x-px"
              aria-hidden
            />

            {/* Edge click zones */}
            <button
              type="button"
              className="absolute left-0 top-0 bottom-0 w-12 z-[40] cursor-pointer opacity-0 hover:opacity-100 transition-opacity flex items-center justify-start pl-2 disabled:cursor-default"
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
              className="absolute right-0 top-0 bottom-0 w-12 z-[40] cursor-pointer opacity-0 hover:opacity-100 transition-opacity flex items-center justify-end pr-2 disabled:cursor-default"
              onClick={goNext}
              disabled={!canGoNext || isFlipping}
              aria-label="Volta pagina avanti"
            >
              <span className="text-[#2c2c2c]/30 text-2xl select-none">
                &#8250;
              </span>
            </button>

            {flipState === "flipping-next" &&
            nextLeftPage &&
            nextRightPage ? (
              <>
                {/* Layer 0: next spread (background, revealed as page turns) */}
                <div className="absolute inset-0 flex">
                  <div className="w-1/2 h-full shrink-0">
                    <div className="h-full w-full rounded-l-lg overflow-hidden">
                      <BookPageFace page={nextLeftPage} />
                    </div>
                  </div>
                  <div className="w-1/2 h-full shrink-0">
                    <div className="h-full w-full rounded-r-lg overflow-hidden">
                      <BookPageFace page={nextRightPage} />
                    </div>
                  </div>
                </div>

                {/* Layer 1: current left page masks left half of background */}
                <div className="absolute top-0 left-0 w-1/2 h-full z-[1]">
                  <div className="h-full w-full rounded-l-lg overflow-hidden">
                    <BookPageFace page={leftPage} />
                  </div>
                </div>

                {/* Shadow cast on the page being revealed */}
                <motion.div
                  className="absolute top-0 right-0 w-1/2 h-full z-[2] pointer-events-none"
                  style={{
                    opacity: shadowIntensity,
                    background:
                      "linear-gradient(to right, rgba(0,0,0,0.4), transparent 70%)",
                  }}
                />

                {/* Layer 2: flipping page (right half turns onto left) */}
                <motion.div
                  className="absolute top-0 right-0 w-1/2 h-full z-[3]"
                  style={{
                    rotateY: flipRotation,
                    transformOrigin: "left center",
                  }}
                >
                  <motion.div
                    className="absolute inset-0 rounded-r-lg overflow-hidden"
                    style={{ opacity: frontOpacity }}
                  >
                    <BookPageFace page={rightPage} />
                  </motion.div>
                  <motion.div
                    className="absolute inset-0 rounded-l-lg overflow-hidden"
                    style={{ opacity: backOpacity, scaleX: -1 }}
                  >
                    <BookPageFace page={nextLeftPage} />
                  </motion.div>
                </motion.div>
              </>
            ) : flipState === "flipping-prev" &&
              prevLeftPage &&
              prevRightPage ? (
              <>
                {/* Layer 0: prev spread (background, revealed as page turns) */}
                <div className="absolute inset-0 flex">
                  <div className="w-1/2 h-full shrink-0">
                    <div className="h-full w-full rounded-l-lg overflow-hidden">
                      <BookPageFace page={prevLeftPage} />
                    </div>
                  </div>
                  <div className="w-1/2 h-full shrink-0">
                    <div className="h-full w-full rounded-r-lg overflow-hidden">
                      <BookPageFace page={prevRightPage} />
                    </div>
                  </div>
                </div>

                {/* Layer 1: current right page masks right half of background */}
                <div className="absolute top-0 right-0 w-1/2 h-full z-[1]">
                  <div className="h-full w-full rounded-r-lg overflow-hidden">
                    <BookPageFace page={rightPage} />
                  </div>
                </div>

                {/* Shadow cast on the page being revealed */}
                <motion.div
                  className="absolute top-0 left-0 w-1/2 h-full z-[2] pointer-events-none"
                  style={{
                    opacity: shadowIntensity,
                    background:
                      "linear-gradient(to left, rgba(0,0,0,0.4), transparent 70%)",
                  }}
                />

                {/* Layer 2: flipping page (left half turns onto right) */}
                <motion.div
                  className="absolute top-0 left-0 w-1/2 h-full z-[3]"
                  style={{
                    rotateY: flipRotation,
                    transformOrigin: "right center",
                  }}
                >
                  <motion.div
                    className="absolute inset-0 rounded-l-lg overflow-hidden"
                    style={{ opacity: frontOpacity }}
                  >
                    <BookPageFace page={leftPage} />
                  </motion.div>
                  <motion.div
                    className="absolute inset-0 rounded-r-lg overflow-hidden"
                    style={{ opacity: backOpacity, scaleX: -1 }}
                  >
                    <BookPageFace page={prevRightPage} />
                  </motion.div>
                </motion.div>
              </>
            ) : (
              <div className="flex w-full h-full">
                <div className="w-1/2 h-full shrink-0">
                  <div className="h-full w-full rounded-l-lg overflow-hidden">
                    <BookPageFace page={leftPage} />
                  </div>
                </div>
                <div className="w-1/2 h-full shrink-0">
                  <div className="h-full w-full rounded-r-lg overflow-hidden">
                    <BookPageFace page={rightPage} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
