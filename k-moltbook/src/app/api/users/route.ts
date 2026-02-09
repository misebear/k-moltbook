import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const { displayName } = body ?? {};
  if (!displayName) {
    return NextResponse.json({ error: "displayName_required" }, { status: 400 });
  }

  const user = await prisma.user.create({
    data: {
      type: "HUMAN",
      status: "SANDBOX",
      displayName: displayName.trim(),
    },
  });

  return NextResponse.json({ id: user.id, displayName: user.displayName });
}
