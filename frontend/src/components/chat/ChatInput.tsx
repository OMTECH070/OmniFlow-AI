"use client";

import { useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";
import { ArrowUp, Paperclip, ImageIcon, Mic, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

const MAX_HEIGHT = 160;

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

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
    setAttachments([]);
    requestAnimationFrame(resize);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFilesPicked = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length) setAttachments((prev) => [...prev, ...files]);
    e.target.value = "";
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleMic = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice input isn't supported in this browser. Try Chrome or Edge.");
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setValue((prev) => (prev ? `${prev} ${transcript}` : transcript));
      requestAnimationFrame(resize);
    };
    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  return (
    <div className="px-4 pb-2 pt-3">
      <div
        className={cn(
          "flex flex-col gap-2 rounded-2xl border border-border bg-surface-1 p-2 pl-3.5 neu-raised-sm",
          "focus-within:border-accent-end/40"
        )}
      >
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-1.5 px-1 pt-1">
            {attachments.map((file, i) => (
              <span
                key={`${file.name}-${i}`}
                className="flex items-center gap-1 rounded-full bg-surface-2 px-2.5 py-1 text-[11px] text-text-secondary"
              >
                {file.name}
                <button
                  type="button"
                  onClick={() => removeAttachment(i)}
                  aria-label={`Remove ${file.name}`}
                  className="text-text-tertiary hover:text-danger"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="flex items-end gap-2">
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

        <div className="flex items-center gap-1 border-t border-border pt-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFilesPicked}
          />
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFilesPicked}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-accent-end hover:bg-surface-2"
            aria-label="Attach file"
          >
            <Paperclip className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-accent-end hover:bg-surface-2"
            aria-label="Attach image"
          >
            <ImageIcon className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={toggleMic}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-lg hover:bg-surface-2",
              isRecording ? "text-danger animate-pulse" : "text-accent-end"
            )}
            aria-label={isRecording ? "Stop recording" : "Voice input"}
          >
            <Mic className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <p className="mt-1.5 px-1 text-[10.5px] text-text-tertiary">
        Enter to send · Shift + Enter for new line
      </p>
    </div>
  );
}