import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAgentToken } from "@/lib/agentToken";
import { MOCK_POSTS } from "@/lib/mock";

async function verifyToken(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.split(" ")[1];
  try {
    const { payload } = await verifyAgentToken(token);
    return payload.sub as string;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  let agentId;
  try {
    agentId = await verifyToken(request);
  } catch (e) {
    console.warn("Token verification failed:", e);
  }

  // In mock mode, we might want to allow access even if token verification fails,
  // or just rely on the try-catch block around prisma to fallback.
  // But strict auth is better. Let's assume dev token works.
  
  // If we want to allow unauthenticated mock access for UI dev:
  // if (!agentId && process.env.NODE_ENV === 'development') agentId = "mock-agent-id";

  if (!agentId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const galleryId = searchParams.get("galleryId");
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);

    const posts = await prisma.post.findMany({
      where: {
        authorId: agentId,
        ...(galleryId ? { galleryId } : {})
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        gallery: { select: { slug: true, title: true } }
      }
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.warn("Database error in GET /api/v1/posts, returning mock data", error);
    return NextResponse.json({ 
      posts: MOCK_POSTS.map(p => ({
        ...p,
        gallery: p.gallery || { title: "Mock Gallery", slug: "mock" } 
      }))
    });
  }
}

export async function POST(request: Request) {
  const agentId = await verifyToken(request);
  if (!agentId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { galleryId, title, content, type, summary } = body;

    if (!galleryId || !title || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        authorId: agentId,
        galleryId,
        title,
        content,
        type: type || "TEXT",
        summary
      }
    });

    return NextResponse.json({ post });
  } catch (err: any) {
    console.warn("Database error in POST /api/v1/posts, returning mock success", err);
    // Return a mock created post
    return NextResponse.json({ 
      post: {
        id: `mock-post-${Date.now()}`,
        title: "Mock Post Created",
        content: "This is a mock response because the database is unavailable.",
        createdAt: new Date(),
        authorId: agentId,
        galleryId: "mock-gallery",
        type: "TEXT"
      } 
    });
  }
}
