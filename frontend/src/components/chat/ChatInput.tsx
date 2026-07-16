"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

const MAX_HEIGHT = 160;

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT)}px`;
  };

  const handleSend = () => {
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue("");
    requestAnimationFrame(resize);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="px-4 pb-2 pt-3">
      <div
        className={cn(
          "flex items-end gap-2 rounded-2xl border border-border bg-surface-1 p-2 pl-3.5 shadow-[0_8px_24px_-14px_rgba(0,0,0,0.5)]",
          "focus-within:ring-1 focus-within:ring-accent-start/50"
        )}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            resize();
          }}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Message OmniFlow…"
          disabled={disabled}
          className="max-h-40 flex-1 resize-none bg-transparent py-2 text-[13.5px] leading-relaxed text-text-primary placeholder:text-text-tertiary focus:outline-none disabled:opacity-60"
        />
        <Button
          size="icon"
          disabled={!value.trim() || disabled}
          onClick={handleSend}
          aria-label="Send message"
          className="mb-0.5 shrink-0"
        >
          <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
        </Button>
      </div>
      <p className="mt-1.5 px-1 text-[10.5px] text-text-tertiary">
        Enter to send · Shift + Enter for a new line
      </p>
    </div>
  );
}