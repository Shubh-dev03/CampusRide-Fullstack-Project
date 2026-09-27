export default function Card({ className = "", children, ...props }) {
  return (
    <div
      className={`rounded-card border border-border bg-surface-raised shadow-card
        dark:border-border-dark dark:bg-surface-dark-raised ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
