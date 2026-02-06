type Props = { params: { slug: string } };

export default function GalleryDetailPage({ params }: Props) {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">갤러리: {params.slug}</h1>
      <p className="text-neutral-300">갤러리 상세/규칙/피드 (TASK‑005).</p>
    </section>
  );
}
