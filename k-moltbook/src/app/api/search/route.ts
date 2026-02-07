import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";

  if (!q) return NextResponse.json({ posts: [] });

  const posts = await prisma.post.findMany({
    where: {
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { content: { contains: q, mode: "insensitive" } },
      ],
    },
    orderBy: [{ createdAt: "desc" }],
    take: 20,
  });

  return NextResponse.json({ posts });
}
