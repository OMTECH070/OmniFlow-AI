<<<<<<< HEAD
import ChatBox from "../components/chat/ChatBox";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-[1400px] mx-auto flex h-screen">
        <aside className="w-72 bg-[var(--panel)] border-r border-black/20 p-4 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">O</div>
            <div>
              <div className="text-sm font-semibold">OmniFlow</div>
              <div className="text-xs text-[var(--muted)]">workspace</div>
            </div>
          </div>

          <button className="mb-4 w-full py-2 bg-gradient-to-r from-[#4f46e5] to-[#7c5cff] text-white rounded-lg">+ New chat</button>

          <nav className="flex-1 overflow-y-auto scrollbar-hide">
            <div className="text-xs text-[var(--muted)] mb-2 px-1">RECENT</div>
            <ul className="space-y-2">
              <li className="px-3 py-2 rounded bg-black/20">New conversation</li>
              <li className="px-3 py-2 rounded hover:bg-white/5">Refactor the auth middleware</li>
              <li className="px-3 py-2 rounded hover:bg-white/5">Weekly report summary ideas</li>
              <li className="px-3 py-2 rounded hover:bg-white/5">Explain vector databases</li>
              <li className="px-3 py-2 rounded hover:bg-white/5">Landing page copy pass</li>
            </ul>
          </nav>

          <div className="mt-4 text-sm text-[var(--muted)]">Aditi Kulkarni</div>
        </aside>

        <main className="flex-1 p-6">
          <ChatBox />
        </main>
=======
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { ChatBox } from "@/components/chat/ChatBox";

export default function Home() {
  return (
    <div className="flex h-dvh w-full overflow-hidden bg-surface-0">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar />
        <ChatBox />
>>>>>>> 90d3ae651409440a0c8d21803236f981d00285dc
      </div>
    </div>
  );
}