import Image from "next/image";

/**
 * Cornice decorativa nella parte superiore della pagina: alberi stilizzati,
 * rami e petali ai lati sinistro e destro (specchiati), stile zen / primavera giapponese.
 * Non copre il contenuto: la banda ha altezza fissa, il main inizia sotto.
 */
export function TopFrame() {
  return (
    <div
      className="relative h-24 w-full overflow-hidden pointer-events-none sm:h-32 md:h-40 shrink-0 shadow-[0_4px_12px_rgba(74,124,89,0.06)]"
      aria-hidden
    >
      {/* Lato sinistro */}
      <div className="absolute left-0 top-0 bottom-0 w-[120px] sm:w-[160px] md:w-[200px]">
        <Image
          src="/frame/top-frame.svg"
          alt=""
          className="h-full w-auto object-cover object-left"
          width={100}
          height={200}
        />
      </div>
      {/* Lato destro (stesso SVG specchiato) */}
      <div className="absolute right-0 top-0 bottom-0 w-[120px] sm:w-[160px] md:w-[200px]">
        <Image
          src="/frame/top-frame.svg"
          alt=""
          className="h-full w-auto object-cover object-right scale-x-[-1]"
          width={100}
          height={200}
        />
      </div>
    </div>
  );
}
