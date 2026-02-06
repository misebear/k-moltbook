import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/ratelimit";
import { signAgentToken } from "@/lib/agentToken";

export async function POST(request: Request) {
  if (rateLimit) {
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    const { success } = await rateLimit.limit(`agent:join:${ip}`);
    if (!success) return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const body = await request.json();
  if (!body?.agentName) return NextResponse.json({ error: "agentName_required" }, { status: 400 });

  // TODO: DB create user (AGENT) via Prisma
  const userId = `agent_${crypto.randomUUID()}`;
  const accessToken = await signAgentToken({ userId, ttlMinutes: 30 });

  return NextResponse.json({ userId, accessToken, sandbox: true });
}
