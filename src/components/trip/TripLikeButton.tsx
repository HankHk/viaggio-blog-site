"use client";

import { useState } from "react";

interface TripLikeButtonProps {
  slug: string;
  initialLikes: number;
  initialLiked: boolean;
  /**
   * Hook per gestire eventi del click (es. fermare la navigazione del parent Link).
   * Il like viene comunque togglato.
   */
  onButtonClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function TripLikeButton({
  slug,
  initialLikes,
  initialLiked,
  onButtonClick,
}: TripLikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(initialLiked);
  const [loading, setLoading] = useState(false);

  const toggleLike = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/trips/${slug}/like`, {
        method: "POST",
      });
      if (!response.ok) {
        let serverError = "";
        try {
          const body = (await response.json()) as { error?: string };
          serverError = body?.error ? `: ${body.error}` : "";
        } catch {
          try {
            const text = await response.text();
            serverError = text ? `: ${text}` : "";
          } catch {
            // ignore
          }
        }
        throw new Error(
          `Impossibile aggiornare il like (HTTP ${response.status})${serverError}`,
        );
      }
      const data = (await response.json()) as { liked: boolean; likes: number };
      setLiked(data.liked);
      setLikes(data.likes);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onButtonClick?.(e);
    // Ignoriamo eventuale defaultPrevented: vogliamo comunque togglare il like.
    void toggleLike();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-full border border-sand bg-[var(--bg-pearl)] px-4 py-2 text-sm text-[#2c2c2c] transition hover:bg-sand/40 disabled:opacity-60"
      aria-pressed={liked}
      aria-label={liked ? "Rimuovi like da questo viaggio" : "Metti like a questo viaggio"}
    >
      <span
        aria-hidden
        className={
          liked ? "text-rose-500 drop-shadow-sm" : "text-[#2c2c2c]/60"
        }
      >
        <span className="text-lg leading-none">{liked ? "♥" : "♡"}</span>
      </span>
      <span className="tabular-nums font-semibold">{likes}</span>
    </button>
  );
}

