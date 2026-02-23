import Link from "next/link";

const quote =
  "«Il viaggio non è mai solo andare da un posto all’altro: è lasciare qualcosa e trovare qualcos’altro.»";

export function Footer() {
  return (
    <footer className="border-t border-sand bg-pearl mt-24">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <blockquote className="font-serif text-lg italic text-neutral-light text-center max-w-2xl mx-auto mb-8">
          {quote}
        </blockquote>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
          <Link
            href="/"
            className="text-sm text-leaf hover:text-leaf-dark transition-colors"
          >
            Torna alla home
          </Link>
        </div>
        <p className="mt-8 text-center text-xs text-neutral-light">
          © {new Date().getFullYear()} Viaggio — Blog di viaggi
        </p>
      </div>
    </footer>
  );
}
