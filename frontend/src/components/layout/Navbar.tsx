"use client";

import { useEffect, useState } from "react";
import { Menu, Moon, Sun } from "lucide-react";
import { useChat, useChatStore } from "@/hooks/useChat";

function useTheme() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("omniflow-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = stored ? stored === "dark" : prefersDark;
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  const toggle = () => {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      window.localStorage.setItem("omniflow-theme", next ? "dark" : "light");
      return next;
    });
  };

  return { isDark, toggle };
}

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Navbar() {
  const toggleSidebar = useChatStore((s) => s.toggleSidebar);
  const currentView = useChatStore((s) => s.currentView);
  const user = useChatStore((s) => s.user);
  const { activeSession } = useChat();
  const { isDark, toggle } = useTheme();

  const title =
    currentView === "dashboard"
      ? "Dashboard"
      : currentView === "settings"
      ? "Settings"
      : activeSession?.title ?? "New conversation";

  const subtitle =
    currentView === "dashboard"
      ? "Usage overview"
      : currentView === "settings"
      ? "Account & preferences"
      : "Mock assistant · frontend demo";

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-surface-0/80 px-4 backdrop-blur-md">
      <button
        type="button"
        onClick={toggleSidebar}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary hover:bg-surface-2 md:hidden"
        aria-label="Toggle sidebar"
      >
        <Menu className="h-4.5 w-4.5" />
      </button>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-text-primary">{title}</p>
        <p className="text-[11px] text-text-tertiary">{subtitle}</p>
      </div>

      <button
        type="button"
        onClick={toggle}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface-2 neu-raised-sm"
        aria-label="Toggle dark mode"
      >
        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>

      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--color-accent-start),var(--color-accent-end))] text-xs font-semibold text-white">
        {initials(user.name)}
      </div>
    </header>
  );
}