"use client";

import { useEffect } from "react";

/**
 * Nasconde la cornice decorativa su tutte le pagine admin (login, lista, creazione, modifica).
 */
export function AdminFrameHide() {
  useEffect(() => {
    document.body.classList.add("admin-page");
    return () => {
      document.body.classList.remove("admin-page");
    };
  }, []);
  return null;
}
