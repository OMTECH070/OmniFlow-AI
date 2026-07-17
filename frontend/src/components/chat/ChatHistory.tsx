"use client";

import { useState } from "react";
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
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

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
        const isConfirming = confirmingId === session.id;
        const preview = session.messages.at(-1)?.content ?? "No messages yet";

        return (
          <li key={session.id} className="group relative">
            <button
              type="button"
              onClick={() => onSelect(session.id)}
              className={cn(
                "flex w-full flex-col gap-0.5 rounded-lg px-3 py-2 text-left transition-colors",
                isActive ? "bg-surface-1 neu-raised-sm" : "hover:bg-surface-2/60"
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
              <span
                className={cn(
                  "truncate pl-[calc(0.375rem+0.375rem)] text-[11.5px]",
                  isActive ? "text-accent-end" : "text-text-tertiary"
                )}
              >
                {truncate(preview, 38)}
              </span>
              <span
                className={cn(
                  "pl-[calc(0.375rem+0.375rem)] text-[10.5px]",
                  isActive ? "text-accent-end/80" : "text-text-tertiary/70"
                )}
              >
                {formatRelative(session.updatedAt)}
              </span>
            </button>

            {isConfirming ? (
              <div className="absolute right-2 top-2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(session.id);
                    setConfirmingId(null);
                  }}
                  className="rounded-md bg-danger px-1.5 py-0.5 text-[10px] font-medium text-white hover:brightness-110"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmingId(null);
                  }}
                  className="rounded-md bg-surface-3 px-1.5 py-0.5 text-[10px] font-medium text-text-secondary hover:bg-surface-2"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmingId(session.id);
                }}
                className={cn(
                  "absolute right-2 top-2 hidden h-6 w-6 items-center justify-center rounded-md text-text-tertiary hover:bg-surface-3 hover:text-danger group-hover:flex",
                  isActive && "flex text-accent-end"
                )}
                aria-label={`Delete ${session.title}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}