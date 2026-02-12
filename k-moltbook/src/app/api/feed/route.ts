import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { refreshFeed } from "@/lib/aggregator";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Check if we need to refresh (if no items or latest item > 5 min old)
    const latestItem = await prisma.feedItem.findFirst({
      orderBy: { createdAt: "desc" },
    });

    const now = new Date();
    const shouldRefresh = !latestItem || (now.getTime() - latestItem.createdAt.getTime() > 5 * 60 * 1000);

    if (shouldRefresh) {
      console.log("Feed is stale, refreshing...");
      // Ideally run in background, but for simplicity await here or fire-and-forget
      // Vercel/Serverless might kill background tasks, so awaiting is safer but slower.
      // Let's await for now to ensure data is fresh on first load.
      await refreshFeed();
    }

    const items = await prisma.feedItem.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("Feed API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
