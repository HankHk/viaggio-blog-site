"use client";

import { useTransition } from "react";
import { deleteTripAction } from "./actions";

interface DeleteTripButtonProps {
  slug: string;
  title: string;
}

export function DeleteTripButton({ slug, title }: DeleteTripButtonProps) {
  const [pending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm(`Eliminare il viaggio "${title}"? L’operazione non si può annullare.`))
      return;
    startTransition(() => {
      deleteTripAction(slug);
    });
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={pending}
      className="text-sm text-red-600 underline hover:no-underline disabled:opacity-50"
      aria-label={`Elimina viaggio ${title}`}
    >
      {pending ? "Eliminazione…" : "Elimina"}
    </button>
  );
}
