"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export interface TravelPatchProps {
  city: string;
  country: string;
  /** URL immagine opzionale (icona/landmark) */
  image?: string;
  /** Posizione verticale in percentuale (0–100) */
  top: number;
  /** Posizione orizzontale in percentuale (0–100) */
  left: number;
  /** Rotazione in gradi (es. ±5–15) */
  rotation: number;
}

/**
 * Toppa da viaggio decorativa in stile badge ricamato / vintage.
 * Puramente decorativa (pointer-events: none), con hover leggero.
 */
export function TravelPatch({
  city,
  country,
  image,
  top,
  left,
  rotation,
}: TravelPatchProps) {
  return (
    <motion.div
      className="absolute z-0 pointer-events-none w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28"
      style={{
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
      }}
      initial={false}
      whileHover={{
        scale: 1.08,
        rotate: rotation + 3,
        transition: { duration: 0.2 },
      }}
      aria-hidden
    >
      {/* Forma a patch con bordo "cucito" e ombra */}
      <div
        className="h-full w-full rounded-full flex flex-col items-center justify-center overflow-hidden border-2 border-[#3d6b4a]/60 bg-[#f8f6f3]/95 shadow-[0_4px_14px_rgba(61,107,74,0.15)]"
        style={{
          boxShadow:
            "0 4px 14px rgba(61,107,74,0.15), inset 0 1px 0 rgba(255,255,255,0.4)",
        }}
      >
        {image ? (
          <div className="relative w-full h-full flex-shrink-0">
            <Image
              src={image}
              alt=""
              fill
              className="object-cover opacity-90"
              sizes="112px"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#2c2c2c]/20 rounded-full">
              <span className="text-[10px] sm:text-xs font-serif font-medium text-white drop-shadow-md text-center px-1">
                {city}
              </span>
              <span className="text-[8px] sm:text-[10px] text-white/90 drop-shadow">
                {country}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-1 text-center">
            <span className="text-[10px] sm:text-xs font-serif font-medium text-[#3d6b4a] leading-tight">
              {city}
            </span>
            <span className="text-[8px] sm:text-[10px] text-[#4a7c59]/80">
              {country}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
