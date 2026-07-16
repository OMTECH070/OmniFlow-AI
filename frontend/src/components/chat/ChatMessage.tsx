<<<<<<< HEAD
import React from "react";

export default function ChatMessage({ role, text }: { role: string; text: string }) {
	const isAssistant = role === "assistant";
	return (
		<div className={`mb-4 ${isAssistant ? "text-left" : "text-right"}`}>
			<div className={`inline-block max-w-[70%] p-4 rounded-lg ${isAssistant ? "bg-white/6" : "bg-[var(--accent)] text-white"}`}>
				{text.split('\n').map((line, i) => (
					<p key={i} className="text-sm leading-6">{line}</p>
				))}
			</div>
		</div>
	);
}

=======
"use client";

import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Sparkles } from "lucide-react";
import type { ChatMessage as ChatMessageType } from "@/types/chat";
import { cn, formatTime } from "@/lib/utils";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn("flex w-full gap-3", isUser ? "flex-row-reverse" : "flex-row")}
    >
      <div
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold",
          isUser
            ? "bg-surface-2 text-text-secondary"
            : "bg-[linear-gradient(135deg,var(--color-accent-start),var(--color-accent-end))] text-white"
        )}
      >
        {isUser ? "AK" : <Sparkles className="h-3.5 w-3.5" />}
      </div>

      <div className={cn("flex max-w-[78%] flex-col gap-1", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed shadow-sm",
            isUser
              ? "rounded-tr-sm bg-[linear-gradient(135deg,var(--color-accent-start),var(--color-accent-end))] text-white"
              : "rounded-tl-sm border border-border bg-surface-1 text-text-primary",
            message.status === "sending" && "opacity-70"
          )}
        >
          <div className={cn("prose-chat", isUser && "prose-chat-inverted")}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
          </div>
        </div>
        <span className="px-1 text-[10.5px] text-text-tertiary">
          {formatTime(message.timestamp)}
          {message.status === "sending" && " · sending…"}
        </span>
      </div>
    </motion.div>
  );
}
>>>>>>> 90d3ae651409440a0c8d21803236f981d00285dc
