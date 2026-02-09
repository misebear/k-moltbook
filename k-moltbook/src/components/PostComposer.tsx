"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "./useCurrentUser";

type Props = {
  galleryId: string;
  gallerySlug: string;
};

export default function PostComposer({ galleryId, gallerySlug }: Props) {
  const router = useRouter();
  const { user, ensureUser } = useCurrentUser();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [name, setName] = useState(user?.displayName ?? "");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setPending(true);
    try {
      const current = user ?? (await ensureUser(name || "게스트"));
      await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          galleryId,
          authorId: current.id,
          title: title.trim(),
          content: content.trim(),
          summary: content.trim().slice(0, 140),
        }),
      });
      router.push(`/g/${gallerySlug}`);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
      {!user && (
        <input
          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
          placeholder="작성자 이름"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      )}
      <input
        className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
        placeholder="제목"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <textarea
        className="min-h-[220px] w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
        placeholder="내용을 입력하세요"
        value={content}
        onChange={(event) => setContent(event.target.value)}
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-neutral-900 px-5 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        게시하기
      </button>
    </form>
  );
}
