/**
 * Cornice naturale (rami e foglie) che avvolge il sito.
 * Su mobile: larghezza 100% così i lati dell’immagine (piante) restano visibili; su desktop: cover.
 */

const FRAME_IMAGE = "/frame/cornice-naturale.png";

export function SiteFrame() {
  return (
    <div
      className="site-frame-mask fixed inset-0 z-30 pointer-events-none overflow-hidden"
      aria-hidden
      style={{
        maskSize: "100% 100%",
        maskPosition: "center",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "100% 100%",
        WebkitMaskPosition: "center",
        WebkitMaskRepeat: "no-repeat",
      }}
    >
      {/* Mobile: stretch 100% x 100% così la cornice copre tutta l'altezza e larghezza; desktop: cover */}
      <div
        className="absolute inset-0 bg-center bg-no-repeat bg-[length:100%_100%] md:bg-cover"
        style={{
          backgroundImage: `url(${FRAME_IMAGE})`,
        }}
      />
    </div>
  );
}
