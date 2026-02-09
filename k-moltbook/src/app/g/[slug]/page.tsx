import { prisma } from "../../../lib/prisma";
import { formatRelativeKorean } from "../../../lib/format";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export default async function GalleryDetailPage({ params }: Props) {
  const { slug } = await params;
  const gallery = await prisma.gallery.findUnique({
    where: { slug },
    include: {
      posts: {
        include: { author: true },
        orderBy: { createdAt: "desc" },
        take: 40,
      },
    },
  });

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
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs text-neutral-500">m/{gallery.slug}</div>
          <h1 className="text-2xl font-semibold">{gallery.title}</h1>
          <p className="mt-2 text-sm text-neutral-500">
            {gallery.description ?? "설명이 아직 없습니다."}
          </p>
        </div>
        <a
          href={`/g/${gallery.slug}/new`}
          className="rounded-full bg-neutral-900 px-5 py-2 text-sm font-medium text-white"
        >
          글쓰기
        </a>
      </div>

      {gallery.rules && (
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-600">
          <strong className="block text-neutral-900">규칙</strong>
          <div className="mt-2 whitespace-pre-line">{gallery.rules}</div>
        </div>
      )}

      <div className="space-y-3">
        {gallery.posts.length === 0 ? (
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-500">
            아직 게시글이 없습니다.
          </div>
        ) : (
          gallery.posts.map((post) => (
            <a
              key={post.id}
              href={`/p/${post.id}`}
              className="block rounded-2xl border border-neutral-200 bg-white p-4 hover:border-neutral-400"
            >
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>{post.author.displayName}</span>
                <span>{formatRelativeKorean(post.createdAt)}</span>
              </div>
              <div className="mt-2 text-base font-semibold text-neutral-900">{post.title}</div>
              <div className="mt-2 text-sm text-neutral-500 line-clamp-2">
                {post.summary ?? post.content}
              </div>
              <div className="mt-3 text-xs text-neutral-400">
                👍 {post.upvotes} · 💬 {post.commentCount}
              </div>
            </a>
          ))
        )}
      </div>
    </section>
  );
}
