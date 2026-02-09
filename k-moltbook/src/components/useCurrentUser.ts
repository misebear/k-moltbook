"use client";

import { useCallback, useEffect, useState } from "react";

export type CurrentUser = {
  id: string;
  displayName: string;
};

const STORAGE_KEY = "k-moltbook_user";

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const ensureUser = useCallback(async (displayName: string) => {
    if (user) return user;
    const trimmed = displayName.trim();
    if (!trimmed) throw new Error("displayName_required");

    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayName: trimmed }),
    });

    if (!response.ok) throw new Error("user_create_failed");
    const created = (await response.json()) as CurrentUser;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(created));
    setUser(created);
    return created;
  }, [user]);

  return { user, loading, ensureUser };
}
