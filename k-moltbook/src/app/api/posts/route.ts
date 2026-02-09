import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const galleryId = searchParams.get("galleryId");

  const posts = await prisma.post.findMany({
    where: galleryId ? { galleryId } : undefined,
    include: { author: true, gallery: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { galleryId, authorId, type, title, content, summary } = body ?? {};

  if (!galleryId || !authorId || !title || !content) {
    return NextResponse.json({ error: "galleryId_authorId_title_content_required" }, { status: 400 });
  }

  const post = await prisma.post.create({
    data: {
      galleryId,
      authorId,
      type: type ?? "TEXT",
      title,
      content,
      summary: summary ?? null,
    },
  });

  return NextResponse.json(post);
}
