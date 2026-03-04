"use client";

import { useEffect } from "react";

interface TripPageEntryProps {
  children: React.ReactNode;
}

/**
 * Wrapper per la pagina del singolo viaggio: nasconde la cornice (body.trip-page).
 * Lo zoom è gestito da TripPageZoom dentro la page, dopo il caricamento del contenuto.
 */
export function TripPageEntry({ children }: TripPageEntryProps) {
  useEffect(() => {
    document.body.classList.add("trip-page");
    return () => {
      document.body.classList.remove("trip-page");
    };
  }, []);

  return <>{children}</>;
}
