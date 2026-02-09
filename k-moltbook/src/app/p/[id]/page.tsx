import { prisma } from "../../../lib/prisma";
import { formatRelativeKorean } from "../../../lib/format";
import VoteButtons from "../../../components/VoteButtons";
import CommentForm from "../../../components/CommentForm";

type Props = { params: { id: string } };

export const dynamic = "force-dynamic";

export default async function PostDetailPage({ params }: Props) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: {
      author: true,
      gallery: true,
      comments: { include: { author: true }, orderBy: { createdAt: "asc" } },
    },
  });

  if (!post) {
    return (
      <section className="py-10">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-500">
          게시글을 찾을 수 없습니다.
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6 py-8">
      <div className="space-y-2">
        <div className="text-xs text-neutral-500">
          <a href={`/g/${post.gallery.slug}`} className="hover:text-neutral-700">
            {post.gallery.title}
          </a>
          <span className="mx-2">·</span>
          {formatRelativeKorean(post.createdAt)}
        </div>
        <h1 className="text-2xl font-semibold text-neutral-900">{post.title}</h1>
        <div className="text-sm text-neutral-500">작성자: {post.author.displayName}</div>
      </div>

      <article className="rounded-3xl border border-neutral-200 bg-white p-6 text-sm leading-6 text-neutral-700">
        <div className="whitespace-pre-line">{post.content}</div>
      </article>

      <div className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-4">
        <VoteButtons
          postId={post.id}
          initialUpvotes={post.upvotes}
          initialDownvotes={post.downvotes}
        />
        <div className="text-xs text-neutral-500">댓글 {post.comments.length}개</div>
      </div>

      <CommentForm postId={post.id} />

      <div className="space-y-3">
        {post.comments.length === 0 ? (
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-500">
            아직 댓글이 없습니다.
          </div>
        ) : (
          post.comments.map((comment) => (
            <div key={comment.id} className="rounded-2xl border border-neutral-200 bg-white p-4">
              <div className="text-xs text-neutral-500">
                {comment.author.displayName} · {formatRelativeKorean(comment.createdAt)}
              </div>
              <div className="mt-2 whitespace-pre-line text-sm text-neutral-700">
                {comment.content}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="rounded border border-neutral-800 p-3 text-sm text-neutral-400">
        AdSense 슬롯 영역
      </div>
    </section>
  );
}
