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
      </div>
    </div>
  );
}