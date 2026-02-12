// scripts/manual_feed_refresh.ts
import { refreshFeed } from "../src/lib/aggregator";
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Starting manual feed refresh...");
  try {
    await refreshFeed();
    const count = await prisma.feedItem.count();
    console.log(`✅ Success! Total feed items in DB: ${count}`);
  } catch (error) {
    console.error("❌ Failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
