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