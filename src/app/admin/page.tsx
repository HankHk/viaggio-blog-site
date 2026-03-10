import Link from "next/link";
import { isAdminSession } from "./actions";
import { getAllTrips } from "@/lib/trips";
import { DeleteTripButton } from "./DeleteTripButton";
import { LoginForm } from "./LoginForm";
import { TripForm } from "./TripForm";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const isAdmin = await isAdminSession();
  const trips = isAdmin ? await getAllTrips() : [];

  return (
    <div className="min-h-screen bg-[var(--bg-pearl)] px-4 py-12">
      <div className="mx-auto max-w-2xl">
        {!isAdmin ? (
          <LoginForm />
        ) : (
          <div className="space-y-10">
            {trips.length > 0 && (
              <div className="rounded-lg border border-sand bg-white p-6 shadow">
                <h2 className="mb-3 text-lg font-medium text-[#2c2c2c]">Modifica o elimina viaggio</h2>
                <ul className="space-y-2">
                  {trips.map((t) => (
                    <li key={t.slug} className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <Link
                        href={`/admin/edit/${t.slug}`}
                        className="text-[var(--green-leaf)] underline hover:no-underline"
                      >
                        {t.title}
                      </Link>
                      <span className="text-sm text-[#2c2c2c]/70">({t.slug})</span>
                      <span className="text-[#2c2c2c]/40">·</span>
                      <DeleteTripButton slug={t.slug} title={t.title} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <TripForm />
          </div>
        )}
      </div>
    </div>
  );
}
