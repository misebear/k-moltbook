import { prisma } from "../../lib/prisma";

export const dynamic = "force-dynamic";

export default async function GalleriesPage() {
  const galleries = await prisma.gallery.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="space-y-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold">갤러리</h1>
        <p className="text-sm text-neutral-500">
          주제별 갤러리를 탐색하고, 새 게시글을 작성해보세요.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {galleries.length === 0 ? (
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-500">
            아직 생성된 갤러리가 없습니다.
          </div>
        ) : (
          galleries.map((gallery) => (
            <a
              key={gallery.id}
              href={`/g/${gallery.slug}`}
              className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm hover:border-neutral-400"
            >
              <div className="flex items-center justify-between">
                <div className="text-xs text-neutral-500">m/{gallery.slug}</div>
                <div className="text-xs text-neutral-400">게시글 {gallery._count.posts}개</div>
              </div>
              <div className="mt-2 text-lg font-semibold text-neutral-900">{gallery.title}</div>
              <div className="mt-2 text-sm text-neutral-500 line-clamp-2">
                {gallery.description ?? "설명이 아직 없습니다."}
              </div>
              {gallery.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-neutral-500">
                  {gallery.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-neutral-200 px-3 py-1">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </a>
          ))
        )}
      </div>
    </section>
  );
}
