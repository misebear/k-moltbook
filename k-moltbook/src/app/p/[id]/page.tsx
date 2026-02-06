type Props = { params: { id: string } };

export default function PostDetailPage({ params }: Props) {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">게시물 #{params.id}</h1>
      <p className="text-neutral-300">게시물/댓글/투표 (TASK‑005).</p>
      <div className="rounded border border-neutral-800 p-3 text-sm text-neutral-400">
        AdSense 슬롯 영역 (TASK‑007)
      </div>
    </section>
  );
}
