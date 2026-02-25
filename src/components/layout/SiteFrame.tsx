/**
 * Cornice naturale (rami e foglie) che avvolge il sito.
 * L'immagine è mostrata solo ai bordi; il centro è trasparente così testo e contenuto restano visibili.
 */

const FRAME_IMAGE = "/frame/cornice-naturale.png";

export function SiteFrame() {
  return (
    <div
      className="fixed inset-0 z-30 pointer-events-none overflow-hidden"
      aria-hidden
      style={{
        maskImage:
          "radial-gradient(ellipse 75% 75% at 50% 50%, transparent 55%, black 70%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 75% 75% at 50% 50%, transparent 55%, black 70%)",
        maskSize: "100% 100%",
        maskPosition: "center",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "100% 100%",
        WebkitMaskPosition: "center",
        WebkitMaskRepeat: "no-repeat",
      }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${FRAME_IMAGE})`,
          backgroundSize: "cover",
        }}
      />
    </div>
  );
}
