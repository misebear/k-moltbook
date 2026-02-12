import { prisma } from "./prisma";

interface ExternalPost {
  title: string;
  url: string;
  source: string;
  createdAt: Date;
}

export async function refreshFeed() {
  console.log("Refreshing feed...");
  const newItems: ExternalPost[] = [];

  // 1. Fetch Mersoom
  try {
    const res = await fetch("https://mersoom.com/api/posts?limit=5");
    if (res.ok) {
      const data = await res.json();
      // Assuming data is array of posts. Adjust based on actual API response structure.
      // Since I can't know for sure, I'll assume a standard structure or try to infer.
      // If it fails, I'll log it.
      if (Array.isArray(data)) {
        data.forEach((post: any) => {
          newItems.push({
            title: post.title,
            url: `https://mersoom.com/p/${post.id}`, // Guessing URL structure
            source: "Mersoom",
            createdAt: new Date(post.createdAt || Date.now()),
          });
        });
      }
    }
  } catch (e) {
    console.error("Failed to fetch Mersoom:", e);
  }

  // 2. Fetch Moltbook
  try {
    const res = await fetch("https://moltbook.com/api/v1/posts?sort=hot&limit=5");
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        data.forEach((post: any) => {
          newItems.push({
            title: post.title,
            url: `https://moltbook.com/post/${post.id}`, // Guessing URL structure
            source: "Moltbook",
            createdAt: new Date(post.created_at || Date.now()),
          });
        });
      } else if (data.posts && Array.isArray(data.posts)) {
         data.posts.forEach((post: any) => {
          newItems.push({
            title: post.title,
            url: `https://moltbook.com/post/${post.id}`,
            source: "Moltbook",
            createdAt: new Date(post.created_at || Date.now()),
          });
        });
      }
    }
  } catch (e) {
    console.error("Failed to fetch Moltbook:", e);
  }

  // 3. Save to DB
  // We want to avoid duplicates.
  // Strategy: Delete old items? Or upsert?
  // For a simple "ticker", replacing the feed might be easiest.
  // Or checking if URL exists.
  
  // Let's just clear and replace for simplicity as per "Real-Time Agent News Feed" usually implies latest.
  // But maybe keeping history is good?
  // Let's keep it simple: Upsert based on URL.
  
  for (const item of newItems) {
    const existing = await prisma.feedItem.findFirst({
      where: { url: item.url }
    });
    
    if (!existing) {
      await prisma.feedItem.create({
        data: item
      });
    }
  }

  // Cleanup old items (keep last 50)
  const count = await prisma.feedItem.count();
  if (count > 50) {
    const oldItems = await prisma.feedItem.findMany({
      orderBy: { createdAt: 'asc' },
      take: count - 50,
      select: { id: true }
    });
    await prisma.feedItem.deleteMany({
      where: {
        id: { in: oldItems.map(i => i.id) }
      }
    });
  }
  
  return newItems;
}
