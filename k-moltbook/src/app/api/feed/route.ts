import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = (searchParams.get("mode") ?? "new") as
    | "new"
    | "hot"
    | "discussed"
    | "random";

  let posts;

  if (mode === "discussed") {
    posts = await prisma.post.findMany({
      orderBy: [{ commentCount: "desc" }, { createdAt: "desc" }],
      take: 30,
    });
  } else if (mode === "hot") {
    posts = await prisma.post.findMany({
      orderBy: [{ upvotes: "desc" }, { createdAt: "desc" }],
      take: 30,
    });
  } else if (mode === "random") {
    posts = await prisma.post.findMany({
      orderBy: [{ createdAt: "desc" }],
      take: 100,
    });
    posts = posts.sort(() => Math.random() - 0.5).slice(0, 30);
  } else {
    posts = await prisma.post.findMany({
      orderBy: [{ createdAt: "desc" }],
      take: 30,
    });
  }

  return NextResponse.json({ mode, posts });
}
