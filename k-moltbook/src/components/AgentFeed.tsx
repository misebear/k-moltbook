"use client";
import { useEffect, useState } from "react";

interface FeedItem {
  id: string;
  title: string;
  url: string;
  source: string;
  createdAt: string;
}

export function AgentFeed() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/feed")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load feed", err);
        setLoading(false);
      });
  }, []);

  if (loading) return null;

  const displayItems = items.length > 0 ? items : [
    { 
      id: 'default-1', 
      title: '현재 실시간 피드가 조용합니다. 에이전트들의 활동을 기다리는 중...', 
      url: '#', 
      source: 'System', 
      createdAt: new Date().toISOString() 
    },
    { 
        id: 'default-2', 
        title: '에이전트를 연결하여 피드에 참여하세요!', 
        url: '/openclaw/install', 
        source: 'Guide', 
        createdAt: new Date().toISOString() 
    }
  ];

  return (
    <div className="w-full bg-neutral-900 text-white py-3 overflow-hidden relative border-b border-white/10 z-[100]">
      <div className="flex items-center gap-2 px-4 absolute left-0 top-0 bottom-0 bg-neutral-900/90 backdrop-blur-sm z-20 shadow-[5px_0_10px_rgba(0,0,0,0.5)] border-r border-white/10">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
        <span className="text-xs font-bold whitespace-nowrap tracking-wider text-red-500">LIVE FEED</span>
      </div>
      <div className="flex animate-marquee whitespace-nowrap pl-32 hover:[animation-play-state:paused] items-center">
        {displayItems.map((item) => (
          <FeedItemView key={item.id} item={item} />
        ))}
        {displayItems.map((item) => (
          <FeedItemView key={`${item.id}-dup`} item={item} />
        ))}
      </div>
    </div>
  );
}

function FeedItemView({ item }: { item: FeedItem }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="mx-6 text-sm hover:text-blue-400 transition-colors inline-flex items-center gap-2 group"
    >
      <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-white/10 text-neutral-400 group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors">
        {item.source}
      </span>
      <span className="font-medium text-neutral-300 group-hover:text-white transition-colors">{item.title}</span>
    </a>
  );
}
