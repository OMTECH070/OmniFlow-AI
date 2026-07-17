"use client";

import { AnimatePresence, motion } from "framer-motion";
import { LayoutDashboard, MessagesSquare, Plus, Settings, Sparkles, X } from "lucide-react";
import { useChat, useChatStore, type View } from "@/hooks/useChat";
import { Button } from "@/components/ui/Button";
import { ChatHistory } from "@/components/chat/ChatHistory";
import { cn } from "@/lib/utils";

const NAV_ITEMS: { label: string; icon: typeof MessagesSquare; view: View }[] = [
  { label: "Chat", icon: MessagesSquare, view: "chat" },
  { label: "Dashboard", icon: LayoutDashboard, view: "dashboard" },
  { label: "Settings", icon: Settings, view: "settings" },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function SidebarContent() {
  const { sessions, activeSession, isLoadingSessions, selectSession, newChat, deleteSession } =
    useChat();
  const currentView = useChatStore((s) => s.currentView);
  const setView = useChatStore((s) => s.setView);
  const closeSidebar = useChatStore((s) => s.closeSidebar);
  const user = useChatStore((s) => s.user);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 px-4 pt-5 pb-4">
        <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-[linear-gradient(135deg,var(--color-accent-start),var(--color-accent-end))] shadow-[0_6px_16px_-6px_rgba(127,29,29,0.55)]">
          <Sparkles className="h-4 w-4 text-white" strokeWidth={2.25} />
        </span>
        <div className="leading-tight">
          <p className="font-display text-[15px] font-semibold tracking-tight text-text-primary">
            OmniFlow
          </p>
          <p className="text-[11px] text-text-tertiary">workspace</p>
        </div>
      </div>

      <div className="px-3">
        <Button
          className="w-full justify-center"
          size="md"
          onClick={() => {
            void newChat();
          }}
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          New chat
        </Button>
      </div>

      <nav className="mt-4 flex flex-col gap-0.5 px-3">
        {NAV_ITEMS.map((item) => {
          const isActive = currentView === item.view;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                setView(item.view);
                closeSidebar();
              }}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors",
                isActive
                  ? "bg-surface-1 text-text-primary neu-raised-sm"
                  : "text-text-tertiary hover:bg-surface-2/60 hover:text-text-secondary"
              )}
            >
              <item.icon className="h-4 w-4" strokeWidth={2} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {currentView === "chat" && (
        <div className="mt-5 flex-1 overflow-hidden px-1.5">
          <p className="px-3 pb-1.5 text-[11px] font-medium uppercase tracking-wider text-text-tertiary">
            Recent
          </p>
          <ChatHistory
            sessions={sessions}
            activeSessionId={activeSession?.id ?? null}
            isLoading={isLoadingSessions}
            onSelect={selectSession}
            onDelete={(id) => void deleteSession(id)}
          />
        </div>
      )}
      {currentView !== "chat" && <div className="flex-1" />}

      <button
        type="button"
        onClick={() => {
          setView("settings");
          closeSidebar();
        }}
        className="flex items-center gap-2.5 border-t border-border px-4 py-3.5 text-left hover:bg-surface-2/60"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--color-accent-start),var(--color-accent-end))] text-xs font-semibold text-white">
          {initials(user.name)}
        </div>
        <div className="leading-tight">
          <p className="text-[13px] font-medium text-text-primary">{user.name}</p>
          <p className="text-[11px] text-text-tertiary">{user.role}</p>
        </div>
      </button>
    </div>
  );
}

export function Sidebar() {
  const sidebarOpen = useChatStore((s) => s.sidebarOpen);
  const closeSidebar = useChatStore((s) => s.closeSidebar);

  return (
    <>
      <aside className="hidden w-[272px] shrink-0 border-r border-border bg-surface-0 md:block">
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeSidebar}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-[280px] border-r border-border bg-surface-0 md:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.22, ease: "easeOut" }}
            >
              <button
                type="button"
                onClick={closeSidebar}
                className="absolute right-3 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary hover:bg-surface-2"
                aria-label="Close sidebar"
              >
                <X className="h-4 w-4" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}