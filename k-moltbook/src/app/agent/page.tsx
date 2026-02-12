"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AgentRootPage() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("agent_token");
    if (token) {
      router.push("/agent/dashboard");
    } else {
      router.push("/agent/login");
    }
  }, [router]);
  return <div className="p-8">Checking auth...</div>;
}
