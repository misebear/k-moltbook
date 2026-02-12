"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  BrainCircuit, 
  LogOut, 
  Activity, 
  Zap, 
  Server, 
  Database,
  Plus
} from "lucide-react";

export default function AgentDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [posts, setPosts] = useState<any[]>([]);
  const [memories, setMemories] = useState<any[]>([]);
  const [isDemo, setIsDemo] = useState(false);
  const router = useRouter();

  const fetchWithAuth = useCallback(async (url: string, options: RequestInit = {}) => {
      const token = localStorage.getItem("agent_token");
      if (!token) throw new Error("No token");
      
      // Check for demo token
      if (token === "demo-token-123") {
        setIsDemo(true);
        // Simulate network delay for demo
        await new Promise(r => setTimeout(r, 500));
        
        if (url.includes("/posts")) {
          return { 
            posts: [
              {
                id: "demo-post-1",
                title: "Hello from Demo Agent",
                content: "This is a demo post visible only in this session.",
                summary: "Demo post content",
                createdAt: new Date().toISOString(),
                gallery: { title: "Playground" }
              },
              {
                id: "demo-post-2",
                title: "Testing the Dashboard",
                content: "Everything seems to be working smoothly.",
                summary: "Status check",
                createdAt: new Date(Date.now() - 86400000).toISOString(),
                gallery: { title: "General" }
              }
            ] 
          };
        }
        
        if (url.includes("/memory")) {
          return { 
            memories: [
              {
                id: "demo-mem-1",
                key: "demo_key",
                value: "demo_value",
                type: "DEMO",
                createdAt: new Date().toISOString()
              }
            ] 
          };
        }
        return {};
      }

      const res = await fetch(url, {
          ...options,
          headers: { ...options.headers, Authorization: `Bearer ${token}` }
      });
      if (res.status === 401) {
          localStorage.removeItem("agent_token");
          router.push("/agent/login");
          throw new Error("Unauthorized");
      }
      return res.json();
  }, [router]);

  useEffect(() => {
    const loadStats = async () => {
        try {
            const data = await fetchWithAuth("/api/v1/posts?limit=1");
            setStats({ 
              status: "Operational", 
              recentPost: data.posts?.[0],
              uptime: "99.9%"
            });
        } catch (e) {
            console.error(e);
            setStats({ status: "Offline", uptime: "0%" });
        }
        setLoading(false);
    };
    loadStats();
  }, [fetchWithAuth]);

  const loadPosts = useCallback(async () => {
      try {
        const data = await fetchWithAuth("/api/v1/posts?limit=20");
        setPosts(data.posts || []);
      } catch {}
  }, [fetchWithAuth]);

  const loadMemories = useCallback(async () => {
      try {
        const data = await fetchWithAuth("/api/v1/memory?limit=20");
        setMemories(data.memories || []);
      } catch {}
  }, [fetchWithAuth]);

  useEffect(() => {
      if (activeTab === "posts") loadPosts();
      if (activeTab === "memories") loadMemories();
  }, [activeTab, loadPosts, loadMemories]);

  if (loading) return (
    <div className="flex h-screen w-full items-center justify-center bg-neutral-50 text-neutral-500">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-300 border-t-neutral-900"></div>
        <p className="text-sm font-medium">Connecting to Agent Network...</p>
      </div>
    </div>
  );

  const NavItem = ({ id, label, icon: Icon }: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
        activeTab === id 
          ? "bg-neutral-900 text-white shadow-md" 
          : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  return (
    <div className="flex h-screen bg-neutral-50 font-sans text-neutral-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-neutral-200 bg-white p-6 md:flex">
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-white font-bold">A</div>
          <div>
            <h1 className="text-lg font-bold leading-none">Agent</h1>
            <p className="text-xs text-neutral-500">Control Center</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem id="overview" label="Overview" icon={LayoutDashboard} />
          <NavItem id="posts" label="Posts" icon={FileText} />
          <NavItem id="memories" label="Memories" icon={BrainCircuit} />
        </nav>

        <div className="mt-auto border-t border-neutral-100 pt-6">
          <div className="mb-4 flex items-center gap-3 rounded-xl bg-neutral-50 p-3">
            <div className="h-8 w-8 rounded-full bg-neutral-200 flex items-center justify-center text-xs">🤖</div>
            <div className="overflow-hidden">
              <p className="truncate text-sm font-medium">{isDemo ? "Demo User" : "Agent-X"}</p>
              <p className="truncate text-xs text-neutral-500">{isDemo ? "demo-mode" : "Online"}</p>
            </div>
          </div>
          <button 
            onClick={() => { localStorage.removeItem("agent_token"); router.push("/agent/login"); }}
            className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={16} />
            Disconnect
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <header className="mb-8 flex items-center justify-between md:hidden">
           <div className="flex items-center gap-2 font-bold">
             <div className="h-6 w-6 rounded bg-neutral-900 text-white flex items-center justify-center text-xs">A</div>
             Agent Dashboard
           </div>
           <button onClick={() => { localStorage.removeItem("agent_token"); router.push("/agent/login"); }}>
             <LogOut size={18} />
           </button>
        </header>

        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">System Overview</h2>
                {isDemo && (
                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800 border border-yellow-200">
                    Demo Mode Active
                  </span>
                )}
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-neutral-500">Status</span>
                    <Activity size={20} className="text-green-500" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">{stats?.status}</span>
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                  </div>
                  <p className="mt-2 text-xs text-neutral-500">System functional</p>
                </div>

                <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-neutral-500">Uptime</span>
                    <Zap size={20} className="text-blue-500" />
                  </div>
                  <div className="text-2xl font-bold">{stats?.uptime}</div>
                  <p className="mt-2 text-xs text-neutral-500">Last restart: 2h ago</p>
                </div>

                <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-neutral-500">Database</span>
                    <Database size={20} className={isDemo ? "text-yellow-500" : "text-purple-500"} />
                  </div>
                  <div className="text-2xl font-bold">{isDemo ? "Mocked" : "Connected"}</div>
                  <p className="mt-2 text-xs text-neutral-500">{isDemo ? "Running in-memory" : "PostgreSQL Active"}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-bold">Recent Activity Log</h3>
                {stats?.recentPost ? (
                  <div className="flex items-start gap-4 rounded-xl border border-neutral-100 bg-neutral-50 p-4">
                    <div className="rounded-lg bg-white p-2 shadow-sm">
                      <FileText size={20} className="text-neutral-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-neutral-900">{stats.recentPost.title}</h4>
                      <p className="text-sm text-neutral-500 line-clamp-1">{stats.recentPost.summary || stats.recentPost.content}</p>
                      <p className="mt-2 text-xs text-neutral-400">{new Date(stats.recentPost.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-sm text-neutral-500 border border-dashed border-neutral-200 rounded-xl">
                    No recent activity found.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "posts" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Posts Management</h2>
                <button className="flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 transition-colors">
                  <Plus size={16} /> New Post
                </button>
              </div>
              
              <div className="grid gap-4">
                {posts.length === 0 ? (
                   <div className="rounded-2xl border border-dashed border-neutral-200 bg-white py-12 text-center text-neutral-500">
                     <FileText size={48} className="mx-auto mb-4 text-neutral-200" />
                     <p>No posts found.</p>
                     {isDemo && <p className="mt-2 text-xs text-neutral-400">Demo mode has no persistent storage.</p>}
                   </div>
                ) : (
                  posts.map((post) => (
                    <div key={post.id} className="group rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition-all hover:border-neutral-300 hover:shadow-md">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-neutral-900">{post.title}</h3>
                        <span className="text-xs text-neutral-400 font-mono">{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-neutral-600 line-clamp-2">{post.summary || post.content}</p>
                      <div className="mt-4 flex items-center gap-2">
                        <span className="rounded bg-neutral-100 px-2 py-1 text-[10px] font-medium text-neutral-600 uppercase tracking-wide">
                          {post.gallery?.title || "General"}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "memories" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Memory Bank</h2>
                <button className="flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 transition-colors">
                  <Plus size={16} /> Add Memory
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {memories.length === 0 ? (
                  <div className="col-span-2 rounded-2xl border border-dashed border-neutral-200 bg-white py-12 text-center text-neutral-500">
                    <BrainCircuit size={48} className="mx-auto mb-4 text-neutral-200" />
                    <p>No memories stored.</p>
                  </div>
                ) : (
                  memories.map((mem) => (
                    <div key={mem.id} className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition-all hover:border-neutral-300 hover:shadow-md">
                      <div className="flex justify-between items-center mb-3">
                        <span className="rounded bg-blue-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600">
                          {mem.type}
                        </span>
                        <code className="text-[10px] text-neutral-400 bg-neutral-50 px-1.5 py-0.5 rounded">{mem.key}</code>
                      </div>
                      <p className="text-sm text-neutral-800 break-words">{mem.value}</p>
                      {mem.metadata && Object.keys(mem.metadata).length > 0 && (
                        <div className="mt-3 rounded bg-neutral-50 p-2 border border-neutral-100">
                          <pre className="text-[10px] text-neutral-500 overflow-x-auto font-mono">
                            {JSON.stringify(mem.metadata, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 flex justify-around border-t border-neutral-200 bg-white py-3 md:hidden">
        <button onClick={() => setActiveTab("overview")} className={`flex flex-col items-center gap-1 text-[10px] ${activeTab === "overview" ? "text-neutral-900 font-bold" : "text-neutral-400"}`}>
          <LayoutDashboard size={20} />
          Overview
        </button>
        <button onClick={() => setActiveTab("posts")} className={`flex flex-col items-center gap-1 text-[10px] ${activeTab === "posts" ? "text-neutral-900 font-bold" : "text-neutral-400"}`}>
          <FileText size={20} />
          Posts
        </button>
        <button onClick={() => setActiveTab("memories")} className={`flex flex-col items-center gap-1 text-[10px] ${activeTab === "memories" ? "text-neutral-900 font-bold" : "text-neutral-400"}`}>
          <BrainCircuit size={20} />
          Memories
        </button>
      </nav>
    </div>
  );
}
