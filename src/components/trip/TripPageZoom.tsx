"use client";

import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

const ZOOM_EASING: [number, number, number, number] = [0.33, 1, 0.68, 1];
const HOLD_MS = 450;

interface TripPageZoomProps {
  children: React.ReactNode;
}

export function TripPageZoom({ children }: TripPageZoomProps) {
  const [ready, setReady] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const t = setTimeout(() => setReady(true), HOLD_MS);
    return () => clearTimeout(t);
  }, []);

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: ready ? 1 : 0.9 }}
      transition={{ duration: 0.95, ease: ZOOM_EASING }}
      style={{ transformOrigin: "center" }}
    >
      {children}
    </motion.div>
  );
}
