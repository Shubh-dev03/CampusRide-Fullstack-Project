import { Loader2 } from "lucide-react";

const VARIANTS = {
  primary:
    "bg-primary text-white hover:bg-primary-hover focus-visible:ring-primary/40",
  secondary:
    "bg-cta text-white hover:bg-cta-hover focus-visible:ring-cta/40",
  outline:
    "border border-border bg-transparent text-ink hover:bg-primary-light dark:border-border-dark dark:text-ink-dark dark:hover:bg-surface-dark-raised focus-visible:ring-primary/30",
  ghost:
    "bg-transparent text-ink hover:bg-primary-light dark:text-ink-dark dark:hover:bg-surface-dark-raised focus-visible:ring-primary/30",
  danger:
    "bg-danger text-white hover:bg-[#A94B3D] focus-visible:ring-danger/40",
};

const SIZES = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2.5 text-sm",
  lg: "px-5 py-3 text-sm",
};

/**
 * Shared button primitive for the CampusRide Design A system.
 * variant: primary | secondary | outline | ghost | danger
 * loading: shows a spinner and disables the button to prevent duplicate submits
 */
export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  className = "",
  children,
  ...props
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      className={`inline-flex items-center justify-center gap-2 rounded-control font-medium
        outline-none transition focus-visible:ring-2 focus-visible:ring-offset-2
        disabled:cursor-not-allowed disabled:opacity-50
        ${VARIANTS[variant]} ${SIZES[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
