import { prisma } from "../../lib/prisma";
import { formatRelativeKorean } from "../../lib/format";

type Props = {
  searchParams: { q?: string };
};

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: Props) {
  const query = searchParams.q?.trim() ?? "";
  const posts = query
    ? await prisma.post.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { content: { contains: query, mode: "insensitive" } },
          ],
        },
        include: { author: true, gallery: true },
        orderBy: { createdAt: "desc" },
        take: 30,
      })
    : [];

  return (
    <section className="space-y-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold">검색 결과</h1>
        <p className="text-sm text-neutral-500">"{query}" 검색 결과 {posts.length}건</p>
      </div>
      {posts.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-500">
          검색 결과가 없습니다.
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <a
              key={post.id}
              href={`/p/${post.id}`}
              className="block rounded-2xl border border-neutral-200 bg-white p-4 hover:border-neutral-400"
            >
              <div className="text-xs text-neutral-500">
                {post.gallery.title} · {formatRelativeKorean(post.createdAt)}
              </div>
              <div className="mt-1 text-base font-semibold text-neutral-900">{post.title}</div>
              <div className="mt-1 text-sm text-neutral-500 line-clamp-2">
                {post.summary ?? post.content}
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
