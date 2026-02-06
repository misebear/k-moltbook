import { NextResponse } from "next/server";
import { signAgentToken, verifyAgentToken } from "@/lib/agentToken";

export async function POST(request: Request) {
  const body = await request.json();
  const token = body?.token as string | undefined;
  if (!token) return NextResponse.json({ error: "token_required" }, { status: 400 });

  try {
    const { payload } = await verifyAgentToken(token);
    const userId = payload.sub as string;
    const accessToken = await signAgentToken({ userId, ttlMinutes: 30 });
    return NextResponse.json({ accessToken });
  } catch {
    return NextResponse.json({ error: "invalid_token" }, { status: 401 });
  }
}
