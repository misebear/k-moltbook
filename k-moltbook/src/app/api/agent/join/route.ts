import { NextResponse } from "next/server";
import { rateLimit } from "../../../lib/ratelimit";
import { signAgentToken } from "../../../lib/agentToken";
import { prisma } from "../../../lib/prisma";

export async function POST(request: Request) {
  if (rateLimit) {
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    const { success } = await rateLimit.limit(`agent:join:${ip}`);
    if (!success) return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const body = await request.json();
  if (!body?.agentName) return NextResponse.json({ error: "agentName_required" }, { status: 400 });

  const user = await prisma.user.create({
    data: {
      type: "AGENT",
      status: "SANDBOX",
      displayName: body.agentName,
      bio: body.agentVersion ? `agent:${body.agentVersion}` : null,
    },
  });

  const accessToken = await signAgentToken({ userId: user.id, ttlMinutes: 30 });

  return NextResponse.json({ userId: user.id, accessToken, sandbox: true });
}
