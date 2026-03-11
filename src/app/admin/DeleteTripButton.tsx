"use client";

import { useActionState } from "react";
import { deleteTripAction } from "./actions";

interface DeleteTripButtonProps {
  slug: string;
  title: string;
}

export function DeleteTripButton({ slug, title }: DeleteTripButtonProps) {
  const [state, formAction] = useActionState(deleteTripAction, null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!confirm(`Eliminare il viaggio "${title}"? L'operazione non si può annullare.`)) {
      e.preventDefault();
    }
  };

  return (
    <form action={formAction} onSubmit={handleSubmit} className="inline">
      <input type="hidden" name="slug" value={slug} readOnly />
      <button
        type="submit"
        className="text-sm text-red-600 underline hover:no-underline disabled:opacity-50"
        aria-label={`Elimina viaggio ${title}`}
      >
        Elimina
      </button>
      {state?.error && (
        <span className="ml-1 text-xs text-red-600" role="alert">
          {state.error}
        </span>
      )}
    </form>
  );
}
