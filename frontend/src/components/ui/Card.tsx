import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
}

export function Card({ className, glow = false, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border border-border bg-surface-1/80 backdrop-blur-sm",
        glow &&
          "before:absolute before:-inset-px before:rounded-2xl before:p-px before:opacity-0 before:transition-opacity hover:before:opacity-100 before:[background:linear-gradient(135deg,var(--color-accent-start),var(--color-accent-end))] before:[mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] before:[mask-composite:exclude] before:pointer-events-none",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center justify-between gap-3 p-4", className)} {...props} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4 pt-0", className)} {...props} />;
}