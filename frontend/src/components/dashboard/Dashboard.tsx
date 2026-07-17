"use client";

import { MessagesSquare, Layers, Clock3 } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { formatRelative } from "@/lib/utils";

export function Dashboard() {
  const { sessions } = useChat();
  const totalMessages = sessions.reduce((sum, s) => sum + s.messages.length, 0);
  const lastActive = sessions[0]?.updatedAt;

  const stats = [
    { label: "Conversations", value: sessions.length, icon: Layers },
    { label: "Messages sent", value: totalMessages, icon: MessagesSquare },
    {
      label: "Last active",
      value: lastActive ? formatRelative(lastActive) : "—",
      icon: Clock3,
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-3 pt-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--color-accent-start),var(--color-accent-end))] text-white">
                  <stat.icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-lg font-semibold text-text-primary">{stat.value}</p>
                  <p className="text-[11.5px] text-text-tertiary">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <p className="text-sm font-medium text-text-primary">Recent conversations</p>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {sessions.length === 0 && (
              <p className="text-[13px] text-text-tertiary">No conversations yet.</p>
            )}
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
              >
                <div>
                  <p className="text-[13px] font-medium text-text-primary">{session.title}</p>
                  <p className="text-[11px] text-text-tertiary">
                    {session.messages.length} messages
                  </p>
                </div>
                <span className="text-[11px] text-text-tertiary">
                  {formatRelative(session.updatedAt)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}