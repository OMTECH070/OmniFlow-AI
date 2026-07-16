<<<<<<< HEAD
(function(){})();
import React from "react";
import ChatHistory from "./ChatHistory";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";

export default function ChatBox() {
	const messages = [
		{ id: 1, role: "assistant", text: "Say hello to get started\nThis workspace runs on mock responses — perfect for building the UI." },
	];

	return (
		<div className="h-full flex flex-col bg-transparent">
			<header className="flex items-center justify-between border-b border-white/6 pb-4 mb-4">
				<div>
					<h2 className="text-lg font-semibold">New conversation</h2>
					<div className="text-xs text-[var(--muted)]">Mock assistant · frontend demo</div>
				</div>
				<div className="text-sm text-[var(--muted)]">AK</div>
			</header>

			<div className="flex gap-6 h-full">
				<div className="w-80 bg-transparent">
					<ChatHistory />
				</div>

				<div className="flex-1 flex flex-col">
					<div className="flex-1 overflow-y-auto p-6 scrollbar-hide rounded-lg">
						{messages.map((m) => (
							<ChatMessage key={m.id} role={m.role} text={m.text} />
						))}
					</div>

					<div className="mt-4">
						<ChatInput />
					</div>
				</div>
			</div>
		</div>
	);
}

=======
"use client";

import { useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { TypingDots } from "@/components/ui/Loader";
import { Footer } from "@/components/layout/Footer";

const SUGGESTIONS = [
  "Summarize this week's product updates",
  "Draft a professional follow-up email",
  "Explain how JWT auth works",
  "Give me ideas for a landing page hero",
];

export function ChatBox() {
  const { activeSession, messages, isTyping, isSending, sendMessage } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, isTyping]);

  const hasMessages = messages.length > 0;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-6">
          {!hasMessages && (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--color-accent-start),var(--color-accent-end))] shadow-[0_10px_30px_-10px_rgba(124,111,255,0.7)]">
                <Sparkles className="h-5 w-5 text-white" />
              </span>
              <div>
                <h2 className="font-display text-lg font-semibold text-text-primary">
                  {activeSession ? "Say hello to get started" : "Start a new conversation"}
                </h2>
                <p className="mt-1 text-sm text-text-tertiary">
                  This workspace runs on mock responses — perfect for building the UI.
                </p>
              </div>
              <div className="grid w-full max-w-lg grid-cols-1 gap-2 sm:grid-cols-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => void sendMessage(s)}
                    className="rounded-xl border border-border bg-surface-1 px-3.5 py-2.5 text-left text-[12.5px] text-text-secondary transition-colors hover:border-accent-start/40 hover:bg-surface-2"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--color-accent-start),var(--color-accent-end))]">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
              <div className="flex items-center rounded-2xl rounded-tl-sm border border-border bg-surface-1 px-4 py-3">
                <TypingDots />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      <div className="mx-auto w-full max-w-3xl">
        <ChatInput onSend={(content) => void sendMessage(content)} disabled={isSending} />
        <Footer />
      </div>
    </div>
  );
}
>>>>>>> 90d3ae651409440a0c8d21803236f981d00285dc
