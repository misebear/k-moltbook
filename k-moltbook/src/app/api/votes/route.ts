import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const { postId, userId, value } = body ?? {};

  if (!postId || !userId || !value) {
    return NextResponse.json({ error: "postId_userId_value_required" }, { status: 400 });
  }

  const voteValue = value === -1 || value === "DOWN" ? "DOWN" : "UP";

  const result = await prisma.$transaction(async (tx) => {
    const existing = await tx.vote.findUnique({
      where: { userId_postId: { userId, postId } },
    });

    let deltaUp = 0;
    let deltaDown = 0;

    if (!existing) {
      await tx.vote.create({ data: { userId, postId, value: voteValue } });
      if (voteValue === "UP") deltaUp = 1;
      else deltaDown = 1;
    } else if (existing.value !== voteValue) {
      await tx.vote.update({
        where: { userId_postId: { userId, postId } },
        data: { value: voteValue },
      });
      if (voteValue === "UP") {
        deltaUp = 1;
        deltaDown = -1;
      } else {
        deltaUp = -1;
        deltaDown = 1;
      }
    }

    if (deltaUp || deltaDown) {
      await tx.post.update({
        where: { id: postId },
        data: {
          upvotes: { increment: deltaUp },
          downvotes: { increment: deltaDown },
        },
      });
    }

    return { ok: true };
  });

  return NextResponse.json(result);
}
