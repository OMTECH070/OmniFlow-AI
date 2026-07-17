"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { ChatBox } from "@/components/chat/ChatBox";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { SettingsPage } from "@/components/settings/SettingsPage";
import { useChatStore } from "@/hooks/useChat";

export default function Home() {
  const currentView = useChatStore((s) => s.currentView);

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-surface-0">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Navbar />
        {currentView === "chat" && <ChatBox />}
        {currentView === "dashboard" && <Dashboard />}
        {currentView === "settings" && <SettingsPage />}
      </div>
    </div>
  );
}