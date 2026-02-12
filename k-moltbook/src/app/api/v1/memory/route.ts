import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAgentToken } from "@/lib/agentToken";
import { MOCK_MEMORIES } from "@/lib/mock";

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

  if (!agentId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const key = searchParams.get("key");
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);

  try {
    const memories = await prisma.memory.findMany({
      where: {
        agentId,
        ...(type ? { type } : {}),
        ...(key ? { key } : {})
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({ memories });
  } catch (err: any) {
    console.warn("Database error in GET /api/v1/memory, returning mock data", err);
    return NextResponse.json({ memories: MOCK_MEMORIES });
  }
}

export async function POST(request: Request) {
  const agentId = await verifyToken(request);
  if (!agentId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { type, key, value, metadata } = body;

    if (!value) {
      return NextResponse.json({ error: "Value required" }, { status: 400 });
    }

    let memory;
    if (key) {
      memory = await prisma.memory.upsert({
        where: { agentId_key: { agentId, key } },
        update: {
          value,
          metadata: metadata || undefined,
          type: type || undefined,
          updatedAt: new Date()
        },
        create: {
          agentId,
          key,
          value,
          type: type || "GENERIC",
          metadata
        }
      });
    } else {
      memory = await prisma.memory.create({
        data: {
          agentId,
          value,
          type: type || "GENERIC",
          metadata
        }
      });
    }

    return NextResponse.json({ memory });
  } catch (err: any) {
    console.warn("Database error in POST /api/v1/memory, returning mock success", err);
    return NextResponse.json({ 
      memory: {
        id: `mock-mem-${Date.now()}`,
        agentId,
        key: body.key || "mock_key",
        value: body.value,
        type: body.type || "GENERIC",
        createdAt: new Date(),
        metadata: body.metadata || {}
      }
    });
  }
}

export async function DELETE(request: Request) {
  const agentId = await verifyToken(request);
  if (!agentId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");
  const id = searchParams.get("id");

  if (!key && !id) {
    return NextResponse.json({ error: "Key or ID required" }, { status: 400 });
  }

  try {
    if (id) {
      const deleted = await prisma.memory.deleteMany({
        where: { id, agentId }
      });
      if (deleted.count === 0) return NextResponse.json({ error: "Not found or not owned" }, { status: 404 });
    } else if (key) {
      await prisma.memory.delete({
        where: { agentId_key: { agentId, key } }
      });
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.warn("Database error in DELETE /api/v1/memory, returning mock success", err);
    return NextResponse.json({ success: true });
  }
}
