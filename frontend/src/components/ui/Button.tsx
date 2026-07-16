import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-[linear-gradient(135deg,var(--color-accent-start),var(--color-accent-end))] text-white shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset,0_8px_20px_-8px_rgba(124,111,255,0.65)] hover:brightness-110 active:brightness-95",
  secondary: "bg-surface-2 text-text-primary border border-border hover:bg-surface-3",
  ghost: "bg-transparent text-text-secondary hover:bg-surface-2 hover:text-text-primary",
  outline: "bg-transparent border border-border text-text-primary hover:bg-surface-2",
  danger: "bg-transparent text-danger border border-danger/30 hover:bg-danger/10",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-lg",
  md: "h-10 px-4 text-sm gap-2 rounded-xl",
  lg: "h-12 px-6 text-base gap-2 rounded-xl",
  icon: "h-10 w-10 rounded-xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-150",
          "disabled:opacity-50 disabled:pointer-events-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-start/60 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";