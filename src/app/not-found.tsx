import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <h1 className="font-serif text-2xl font-medium text-[#2c2c2c]">
        Pagina non trovata
      </h1>
      <p className="mt-2 text-neutral-light">
        Il viaggio che cerchi non esiste o è stato spostato.
      </p>
      <Link
        href="/"
        className="mt-6 text-leaf hover:text-leaf-dark font-medium transition-colors"
      >
        Torna alla home
      </Link>
    </div>
  );
}
