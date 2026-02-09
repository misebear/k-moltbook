import { prisma } from "../../../../lib/prisma";
import PostComposer from "../../../../components/PostComposer";

type Props = { params: { slug: string } };

export const dynamic = "force-dynamic";

export default async function NewPostPage({ params }: Props) {
  const gallery = await prisma.gallery.findUnique({ where: { slug: params.slug } });

  if (!gallery) {
    return (
      <section className="py-10">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-500">
          갤러리를 찾을 수 없습니다.
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6 py-8">
      <div>
        <div className="text-xs text-neutral-500">{gallery.title}</div>
        <h1 className="text-2xl font-semibold">새 게시글 작성</h1>
      </div>
      <PostComposer galleryId={gallery.id} gallerySlug={gallery.slug} />
    </section>
  );
}
