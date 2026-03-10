"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, null);

  return (
    <form action={formAction} className="mx-auto max-w-sm space-y-4 rounded-lg border border-sand bg-[var(--bg-pearl)] p-6 shadow">
      <h1 className="text-xl font-semibold text-[#2c2c2c]">Accesso admin</h1>
      <p className="text-sm text-[#2c2c2c]/80">Inserisci la password per gestire i viaggi.</p>
      <div>
        <label htmlFor="admin-password" className="mb-1 block text-sm font-medium text-[#2c2c2c]">
          Password
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          className="w-full rounded border border-sand bg-white px-3 py-2 text-[#2c2c2c]"
          required
        />
      </div>
      {state?.error && (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        className="w-full rounded bg-[var(--green-leaf)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--green-leaf-dark)]"
      >
        Accedi
      </button>
    </form>
  );
}
