export function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-border/70 dark:bg-border-dark/60 ${className}`}
    />
  );
}

/** Skeleton matching the RideCard layout, used while ride lists load. */
export function RideCardSkeleton() {
  return (
    <div className="rounded-card border border-border bg-surface-raised p-5 dark:border-border-dark dark:bg-surface-dark-raised">
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <Skeleton className="h-8 flex-1" />
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-8 flex-1" />
      </div>
      <Skeleton className="mb-4 h-4 w-2/3" />
      <Skeleton className="h-10 w-full rounded-control" />
    </div>
  );
}
