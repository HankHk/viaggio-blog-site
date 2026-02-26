"use client";

import { useEffect } from "react";

/**
 * Imposta la variabile CSS --vh (1% dell'altezza visibile) per fallback su browser
 * che non supportano 100dvh. Aggiorna al resize e al cambio di visualViewport
 * (es. barra URL che appare/scompare su mobile).
 * Non modifica il layout desktop.
 */
function setViewportHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}

export function ViewportHeightProvider() {
  useEffect(() => {
    setViewportHeight();

    window.addEventListener("resize", setViewportHeight);
    if (typeof window.visualViewport !== "undefined") {
      window.visualViewport.addEventListener("resize", setViewportHeight);
      window.visualViewport.addEventListener("scroll", setViewportHeight);
    }

    return () => {
      window.removeEventListener("resize", setViewportHeight);
      if (typeof window.visualViewport !== "undefined") {
        window.visualViewport.removeEventListener("resize", setViewportHeight);
        window.visualViewport.removeEventListener("scroll", setViewportHeight);
      }
    };
  }, []);

  return null;
}
