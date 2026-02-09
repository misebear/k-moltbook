"use client";

import { useState } from "react";
import { useCurrentUser } from "./useCurrentUser";

type Props = {
  postId: string;
  initialUpvotes: number;
  initialDownvotes: number;
};

export default function VoteButtons({ postId, initialUpvotes, initialDownvotes }: Props) {
  const { user, ensureUser } = useCurrentUser();
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [pending, setPending] = useState(false);

  async function handleVote(value: "UP" | "DOWN") {
    if (pending) return;
    setPending(true);
    try {
      const current = user ?? (await ensureUser("게스트"));
      await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, userId: current.id, value }),
      });
      if (value === "UP") {
        setUpvotes((prev) => prev + 1);
      } else {
        setDownvotes((prev) => prev + 1);
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex items-center gap-2 text-xs text-neutral-500">
      <button
        type="button"
        onClick={() => handleVote("UP")}
        className="rounded-full border border-neutral-200 bg-white px-3 py-1 hover:border-neutral-400"
      >
        👍 {upvotes}
      </button>
      <button
        type="button"
        onClick={() => handleVote("DOWN")}
        className="rounded-full border border-neutral-200 bg-white px-3 py-1 hover:border-neutral-400"
      >
        👎 {downvotes}
      </button>
    </div>
  );
}
