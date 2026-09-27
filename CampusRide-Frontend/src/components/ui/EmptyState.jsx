export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="rounded-card border border-border bg-surface-raised px-6 py-12 text-center dark:border-border-dark dark:bg-surface-dark-raised">
      {Icon && (
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-light text-primary dark:bg-surface-dark">
          <Icon className="h-6 w-6" />
        </div>
      )}
      <p className="font-medium text-ink dark:text-ink-dark">{title}</p>
      {description && (
        <p className="mt-1 text-sm text-ink-soft dark:text-ink-dark-soft">
          {description}
        </p>
      )}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}
