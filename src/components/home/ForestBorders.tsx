import Image from "next/image";

/** Immagini Unsplash: bordo sinistro (fogliame), bordo destro (fiori/piante). */
const LEFT_IMAGE =
  "https://images.unsplash.com/photo-1511497584788-876760111969?w=400&q=80";
const RIGHT_IMAGE =
  "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&q=80";

/**
 * Bordi fissi ai lati della homepage: piante e fiori (effetto "entrare in un bosco").
 * Solo visibili sulla homepage, position fixed, sotto il contenuto (z-index basso).
 */
export function ForestBorders() {
  return (
    <>
      {/* Bordo sinistro: fogliame / bosco */}
      <div
        className="fixed inset-y-0 left-0 z-0 w-[80px] overflow-hidden opacity-90 pointer-events-none sm:w-[120px] md:w-[160px] lg:w-[180px]"
        aria-hidden
      >
        <Image
          src={LEFT_IMAGE}
          alt=""
          fill
          className="object-cover object-right"
          sizes="180px"
          priority={false}
        />
      </div>

      {/* Bordo destro: fiori / piante */}
      <div
        className="fixed inset-y-0 right-0 z-0 w-[80px] overflow-hidden opacity-90 pointer-events-none sm:w-[120px] md:w-[160px] lg:w-[180px]"
        aria-hidden
      >
        <Image
          src={RIGHT_IMAGE}
          alt=""
          fill
          className="object-cover object-left"
          sizes="180px"
          priority={false}
        />
      </div>
    </>
  );
}
