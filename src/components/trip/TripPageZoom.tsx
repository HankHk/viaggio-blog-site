"use client";

import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

const ZOOM_EASING: [number, number, number, number] = [0.33, 1, 0.68, 1];
const HOLD_MS = 450;

interface TripPageZoomProps {
  children: React.ReactNode;
}

/**
 * Effetto "camera che si avvicina" all'ingresso della pagina viaggio.
 *
 * Strategia SSR-safe:
 * - initial={false}: Framer Motion non scrive mai transform inline durante SSR,
 *   così server e client rendono la stessa struttura DOM (no hydration mismatch).
 * - animate={{ scale: 1 }} di default: nessun transform applicato lato server.
 * - Dopo il mount (useEffect): snap istantaneo a 0.9, poi dopo HOLD_MS
 *   transizione fluida a 1.
 * - Se useReducedMotion è true: il useEffect non tocca lo scale, resta a 1.
 */
export function TripPageZoom({ children }: TripPageZoomProps) {
  const [scale, setScale] = useState(1);
  const [animating, setAnimating] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    setScale(0.9);

    const t = setTimeout(() => {
      setAnimating(true);
      setScale(1);
    }, HOLD_MS);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      initial={false}
      animate={{ scale }}
      transition={
        animating
          ? { duration: 1.9, ease: ZOOM_EASING }
          : { duration: 0 }
      }
      style={{ transformOrigin: "center" }}
    >
      {children}
    </motion.div>
  );
}
