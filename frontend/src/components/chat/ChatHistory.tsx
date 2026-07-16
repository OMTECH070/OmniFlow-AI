<<<<<<< HEAD
import React from "react";

export default function ChatHistory() {
	const items = [
		{ id: 1, title: "New conversation", subtitle: "No messages yet" },
		{ id: 2, title: "Refactor the auth middleware", subtitle: "Sure — the cleanest way is to wrap th..." },
		{ id: 3, title: "Weekly report summary ideas", subtitle: "No messages yet" },
	];

	return (
		<div className="bg-transparent">
			<div className="text-xs text-[var(--muted)] mb-2">RECENT</div>
			<ul className="space-y-3">
				{items.map((it) => (
					<li key={it.id} className="p-3 rounded hover:bg-white/3">
						<div className="font-medium">{it.title}</div>
						<div className="text-xs text-[var(--muted)]">{it.subtitle}</div>
					</li>
				))}
			</ul>
		</div>
}
=======
"use client";

import { Trash2 } from "lucide-react";
import type { ChatSession } from "@/types/chat";
import { cn, formatRelative, truncate } from "@/lib/utils";
import { SessionSkeleton } from "@/components/ui/Loader";

interface ChatHistoryProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  isLoading: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ChatHistory({
  sessions,
  activeSessionId,
  isLoading,
  onSelect,
  onDelete,
}: ChatHistoryProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <SessionSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <p className="px-3 py-4 text-[13px] text-text-tertiary">
        No conversations yet — start one below.
      </p>
    );
  }

  return (
    <ul className="flex max-h-full flex-col gap-0.5 overflow-y-auto scrollbar-thin pb-2">
      {sessions.map((session) => {
        const isActive = session.id === activeSessionId;
        const preview = session.messages.at(-1)?.content ?? "No messages yet";

        return (
          <li key={session.id} className="group relative">
            <button
              type="button"
              onClick={() => onSelect(session.id)}
              className={cn(
                "flex w-full flex-col gap-0.5 rounded-lg px-3 py-2 text-left transition-colors",
                isActive
                  ? "bg-surface-2 ring-1 ring-inset ring-border"
                  : "hover:bg-surface-2/60"
              )}
            >
              <span className="flex items-center gap-1.5">
                {isActive && (
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[linear-gradient(135deg,var(--color-accent-start),var(--color-accent-end))]" />
                )}
                <span className="truncate text-[13px] font-medium text-text-primary">
                  {session.title}
                </span>
              </span>
              <span className="truncate pl-[calc(0.375rem+0.375rem)] text-[11.5px] text-text-tertiary">
                {truncate(preview, 38)}
              </span>
              <span className="pl-[calc(0.375rem+0.375rem)] text-[10.5px] text-text-tertiary/70">
                {formatRelative(session.updatedAt)}
              </span>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(session.id);
              }}
              className="absolute right-2 top-2 hidden h-6 w-6 items-center justify-center rounded-md text-text-tertiary hover:bg-surface-3 hover:text-danger group-hover:flex"
              aria-label={`Delete ${session.title}`}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
>>>>>>> 90d3ae651409440a0c8d21803236f981d00285dc
