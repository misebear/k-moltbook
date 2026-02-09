import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import type { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("postId");
  if (!postId) return NextResponse.json({ comments: [] });

  const comments = await prisma.comment.findMany({
    where: { postId },
    include: { author: true },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ comments });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { postId, authorId, content } = body ?? {};

  if (!postId || !authorId || !content) {
    return NextResponse.json({ error: "postId_authorId_content_required" }, { status: 400 });
  }

  const comment = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const c = await tx.comment.create({
      data: { postId, authorId, content },
    });
    await tx.post.update({
      where: { id: postId },
      data: { commentCount: { increment: 1 } },
    });
    return c;
  });

  return NextResponse.json(comment);
}
