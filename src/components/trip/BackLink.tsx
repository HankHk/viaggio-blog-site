import Link from "next/link";

export function BackLink() {
  return (
    <Link
      href="/#viaggi"
      className="inline-flex items-center gap-2 text-sm font-medium text-leaf hover:text-leaf-dark transition-colors"
    >
      <span aria-hidden>←</span>
      Torna ai viaggi
    </Link>
  );
}
