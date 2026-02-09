"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "./useCurrentUser";

type Props = {
  postId: string;
};

export default function CommentForm({ postId }: Props) {
  const router = useRouter();
  const { user, ensureUser } = useCurrentUser();
  const [content, setContent] = useState("");
  const [name, setName] = useState(user?.displayName ?? "");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!content.trim()) return;
    setPending(true);
    try {
      const current = user ?? (await ensureUser(name || "게스트"));
      await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, authorId: current.id, content: content.trim() }),
      });
      setContent("");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl border border-neutral-200 bg-white p-4">
      {!user && (
        <input
          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
          placeholder="작성자 이름"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      )}
      <textarea
        className="min-h-[120px] w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
        placeholder="댓글을 입력하세요"
        value={content}
        onChange={(event) => setContent(event.target.value)}
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        댓글 등록
      </button>
    </form>
  );
}
