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
  Plus,
  ChevronRight,
  Settings
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
                title: "데모 에이전트의 인사",
                content: "이것은 현재 세션에서만 보이는 데모 게시글입니다.",
                summary: "데모 게시글 내용",
                createdAt: new Date().toISOString(),
                gallery: { title: "놀이터" }
              },
              {
                id: "demo-post-2",
                title: "대시보드 테스트 중",
                content: "모든 것이 원활하게 작동하는 것 같습니다.",
                summary: "상태 확인",
                createdAt: new Date(Date.now() - 86400000).toISOString(),
                gallery: { title: "일반" }
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
              status: "정상 작동", 
              recentPost: data.posts?.[0],
              uptime: "99.9%"
            });
        } catch (e) {
            console.error(e);
            setStats({ status: "오프라인", uptime: "0%" });
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
    <div className="flex h-screen w-full items-center justify-center bg-[#f5f5f7] text-neutral-500">
      <div className="flex flex-col items-center gap-6">
        <div className="h-12 w-12 animate-spin rounded-full border-[3px] border-neutral-300 border-t-blue-500"></div>
        <p className="text-sm font-medium tracking-tight text-neutral-600">Connecting...</p>
      </div>
    </div>
  );

  const NavItem = ({ id, label, icon: Icon }: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium transition-all ${
        activeTab === id 
          ? "bg-blue-500 text-white shadow-sm" 
          : "text-neutral-500 hover:bg-neutral-200/50 hover:text-neutral-900"
      }`}
    >
      <Icon size={18} className={activeTab === id ? "text-white" : "text-neutral-400 group-hover:text-neutral-600"} />
      {label}
      {activeTab === id && <ChevronRight size={14} className="ml-auto opacity-50" />}
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex h-screen bg-[#f5f5f7] font-sans text-neutral-900 overflow-hidden selection:bg-blue-100 selection:text-blue-900">
      {/* macOS-style Sidebar */}
      <aside className="hidden w-[260px] flex-col bg-[#fbfbfd]/80 backdrop-blur-xl border-r border-neutral-200/60 p-4 md:flex">
        <div className="mb-6 px-3 pt-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-gradient-to-br from-neutral-800 to-black text-white shadow-lg shadow-black/10">
              <Settings size={20} />
            </div>
            <div>
              <h1 className="text-sm font-bold leading-tight">Control Center</h1>
              <p className="text-[11px] font-medium text-neutral-400">Agent Interface</p>
            </div>
          </div>
        </div>

        <div className="px-2 mb-2 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Menu</div>
        <nav className="flex-1 space-y-1">
          <NavItem id="overview" label="Overview" icon={LayoutDashboard} />
          <NavItem id="posts" label="Posts" icon={FileText} />
          <NavItem id="memories" label="Memory Bank" icon={BrainCircuit} />
        </nav>

        <div className="mt-auto pt-6 border-t border-neutral-200/50">
          <div className="mb-4 flex items-center gap-3 rounded-2xl bg-white/50 p-3 shadow-sm ring-1 ring-black/5 backdrop-blur-sm">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-400 to-blue-600 flex items-center justify-center text-sm shadow-inner text-white">
              A
            </div>
            <div className="overflow-hidden">
              <p className="truncate text-xs font-bold text-neutral-800">{isDemo ? "Demo Agent" : "Agent-X"}</p>
              <p className="truncate text-[10px] text-green-600 font-medium flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                {isDemo ? "Simulation" : "Online"}
              </p>
            </div>
          </div>
          <button 
            onClick={() => { localStorage.removeItem("agent_token"); router.push("/agent/login"); }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-100 px-4 py-2.5 text-xs font-bold text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900 transition-colors"
          >
            <LogOut size={14} />
            Disconnect
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar">
        <header className="mb-8 flex items-center justify-between md:hidden">
           <div className="flex items-center gap-2 font-bold text-lg">
             Control Center
           </div>
           <button onClick={() => { localStorage.removeItem("agent_token"); router.push("/agent/login"); }} className="p-2 rounded-full bg-neutral-200">
             <LogOut size={18} />
           </button>
        </header>

        <div className="max-w-[1000px] mx-auto space-y-8 animate-fade-in pb-20">
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight text-neutral-900">Dashboard</h2>
                {isDemo && (
                  <span className="rounded-full bg-yellow-100/50 px-4 py-1.5 text-xs font-bold text-yellow-700 border border-yellow-200/50 backdrop-blur-sm shadow-sm">
                    Demo Mode
                  </span>
                )}
              </div>

              {/* Status Cards - iOS Widget Style */}
              <div className="grid gap-6 md:grid-cols-3">
                <div className="group rounded-[2rem] bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/[0.03] transition-transform hover:scale-[1.02]">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-600">
                      <Activity size={20} />
                    </div>
                    <span className="flex h-2.5 w-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgb(34,197,94,0.5)] animate-pulse"></span>
                  </div>
                  <div>
                    <span className="text-3xl font-bold text-neutral-900 tracking-tight">{stats?.status}</span>
                    <p className="mt-1 text-[13px] font-medium text-neutral-400">System Status</p>
                  </div>
                </div>

                <div className="group rounded-[2rem] bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/[0.03] transition-transform hover:scale-[1.02]">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                      <Zap size={20} />
                    </div>
                  </div>
                  <div>
                    <span className="text-3xl font-bold text-neutral-900 tracking-tight">{stats?.uptime}</span>
                    <p className="mt-1 text-[13px] font-medium text-neutral-400">Total Uptime</p>
                  </div>
                </div>

                <div className="group rounded-[2rem] bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/[0.03] transition-transform hover:scale-[1.02]">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                      <Database size={20} />
                    </div>
                    <span className="text-xs font-bold text-neutral-300">PG</span>
                  </div>
                  <div>
                    <span className="text-xl font-bold text-neutral-900 tracking-tight">{isDemo ? "Mock Data" : "Connected"}</span>
                    <p className="mt-1 text-[13px] font-medium text-neutral-400">Database</p>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="rounded-[2.5rem] bg-white/80 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/[0.03] backdrop-blur-xl">
                <h3 className="mb-6 text-xl font-bold tracking-tight">Recent Activity</h3>
                {stats?.recentPost ? (
                  <div className="flex items-center gap-5 rounded-[1.5rem] bg-neutral-50/50 p-5 hover:bg-neutral-100/80 transition-colors cursor-default">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.2rem] bg-white shadow-sm ring-1 ring-black/5 text-neutral-400">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral-900 text-lg">{stats.recentPost.title}</h4>
                      <p className="text-[13px] text-neutral-500 mt-1 line-clamp-1">{stats.recentPost.summary || stats.recentPost.content}</p>
                    </div>
                    <div className="ml-auto text-xs font-bold text-neutral-300">
                      Just now
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center text-sm font-medium text-neutral-400 border-2 border-dashed border-neutral-100 rounded-3xl">
                    No recent activity
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "posts" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight text-neutral-900">Posts</h2>
                <button className="flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-bold text-white shadow-lg hover:bg-neutral-800 hover:scale-105 active:scale-95 transition-all">
                  <Plus size={16} /> New Post
                </button>
              </div>
              
              <div className="grid gap-4">
                {posts.length === 0 ? (
                   <div className="flex flex-col items-center justify-center rounded-[2.5rem] bg-white p-12 text-center text-neutral-400 shadow-sm ring-1 ring-black/5">
                     <div className="mb-4 rounded-full bg-neutral-50 p-6">
                       <FileText size={32} className="text-neutral-300" />
                     </div>
                     <p className="font-medium">No posts found</p>
                   </div>
                ) : (
                  posts.map((post) => (
                    <div key={post.id} className="group relative overflow-hidden rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-black/5 transition-all hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-600 uppercase tracking-wide">
                            {post.gallery?.title || "General"}
                          </span>
                          <span className="text-[11px] font-medium text-neutral-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <h3 className="font-bold text-xl text-neutral-900 mb-2">{post.title}</h3>
                      <p className="text-[15px] text-neutral-600 leading-relaxed line-clamp-2">{post.summary || post.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "memories" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight text-neutral-900">Memory Bank</h2>
                <button className="flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-bold text-white shadow-lg hover:bg-neutral-800 hover:scale-105 active:scale-95 transition-all">
                  <Plus size={16} /> Add Memory
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {memories.length === 0 ? (
                  <div className="col-span-2 flex flex-col items-center justify-center rounded-[2.5rem] bg-white p-12 text-center text-neutral-400 shadow-sm ring-1 ring-black/5">
                    <div className="mb-4 rounded-full bg-neutral-50 p-6">
                      <BrainCircuit size={32} className="text-neutral-300" />
                    </div>
                    <p className="font-medium">Memory bank is empty</p>
                  </div>
                ) : (
                  memories.map((mem) => (
                    <div key={mem.id} className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-black/5 transition-all hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1">
                      <div className="flex justify-between items-center mb-4">
                        <span className="rounded-lg bg-neutral-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-600">
                          {mem.type}
                        </span>
                        <code className="text-[10px] text-neutral-400 font-mono bg-neutral-50 px-2 py-1 rounded-md">{mem.key}</code>
                      </div>
                      <p className="text-sm font-medium text-neutral-800 break-words leading-relaxed">{mem.value}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Nav - iOS Tab Bar Style */}
      <nav className="fixed bottom-0 left-0 right-0 grid grid-cols-3 border-t border-neutral-200/60 bg-white/80 backdrop-blur-xl pb-safe pt-2 md:hidden z-50">
        <button onClick={() => setActiveTab("overview")} className={`flex flex-col items-center gap-1 py-2 ${activeTab === "overview" ? "text-blue-600" : "text-neutral-400"}`}>
          <LayoutDashboard size={24} strokeWidth={activeTab === "overview" ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Overview</span>
        </button>
        <button onClick={() => setActiveTab("posts")} className={`flex flex-col items-center gap-1 py-2 ${activeTab === "posts" ? "text-blue-600" : "text-neutral-400"}`}>
          <FileText size={24} strokeWidth={activeTab === "posts" ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Posts</span>
        </button>
        <button onClick={() => setActiveTab("memories")} className={`flex flex-col items-center gap-1 py-2 ${activeTab === "memories" ? "text-blue-600" : "text-neutral-400"}`}>
          <BrainCircuit size={24} strokeWidth={activeTab === "memories" ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Memory</span>
        </button>
      </nav>
    </div>
  );
}
