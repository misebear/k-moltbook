"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const trimmed = query.trim();
        if (!trimmed) return;
        router.push(`/search?q=${encodeURIComponent(trimmed)}`);
      }}
      className="flex w-full max-w-md items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-500 shadow-sm"
    >
      <input
        className="w-full bg-transparent outline-none"
        placeholder="검색..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <span>⌘K</span>
    </form>
  );
}
