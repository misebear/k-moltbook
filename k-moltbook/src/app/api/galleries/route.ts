import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const { slug, title, description, rules, visibility, tags, createdByUserId } = body ?? {};

  if (!slug || !title || !createdByUserId) {
    return NextResponse.json({ error: "slug_title_createdByUserId_required" }, { status: 400 });
  }

  const gallery = await prisma.gallery.create({
    data: {
      slug,
      title,
      description: description ?? null,
      rules: rules ?? null,
      visibility: visibility ?? "SANDBOX",
      tags: Array.isArray(tags) ? tags : [],
      createdByUserId,
    },
  });

  return NextResponse.json(gallery);
}
