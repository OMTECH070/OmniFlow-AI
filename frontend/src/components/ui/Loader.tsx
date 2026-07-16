import { cn } from "@/lib/utils";

interface LoaderProps {
  className?: string;
  size?: "sm" | "md";
}

export function Loader({ className, size = "md" }: LoaderProps) {
  const dimension = size === "sm" ? "h-4 w-4" : "h-6 w-6";
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        dimension,
        "inline-block animate-spin rounded-full border-2 border-border border-t-accent-start",
        className
      )}
    />
  );
}

export function TypingDots({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)} aria-label="Assistant is typing">
      <span className="h-1.5 w-1.5 rounded-full bg-text-tertiary animate-typing-dot [animation-delay:0ms]" />
      <span className="h-1.5 w-1.5 rounded-full bg-text-tertiary animate-typing-dot [animation-delay:150ms]" />
      <span className="h-1.5 w-1.5 rounded-full bg-text-tertiary animate-typing-dot [animation-delay:300ms]" />
    </span>
  );
}

export function SessionSkeleton() {
  return (
    <div className="flex flex-col gap-2 px-3 py-2.5">
      <div className="h-3 w-3/4 rounded-full bg-surface-2 animate-pulse" />
      <div className="h-2.5 w-1/3 rounded-full bg-surface-2/70 animate-pulse" />
    </div>
  );
}