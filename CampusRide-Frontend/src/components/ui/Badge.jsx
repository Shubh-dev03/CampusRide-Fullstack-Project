const TONES = {
  primary: "bg-primary-light text-primary dark:bg-surface-dark dark:text-primary",
  success: "bg-[#EAF5EC] text-success dark:bg-surface-dark",
  danger: "bg-[#FBEAE7] text-danger dark:bg-surface-dark",
  neutral: "bg-border/60 text-ink-soft dark:bg-surface-dark dark:text-ink-dark-soft",
};

export default function Badge({ tone = "neutral", className = "", children }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
