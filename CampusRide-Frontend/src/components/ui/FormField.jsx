/**
 * Labeled input wrapper. Pass any <input>/<select> props via `inputProps`,
 * or render a custom control as `children` (e.g. a password field with a
 * visibility toggle) instead of using `inputProps`.
 */
export default function FormField({
  label,
  error,
  hint,
  inputProps,
  children,
  className = "",
}) {
  return (
    <div className={className}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-ink dark:text-ink-dark">
          {label}
        </label>
      )}

      {children ?? (
        <input
          {...inputProps}
          className={`w-full rounded-control border bg-surface px-3.5 py-2.5 text-sm text-ink
            outline-none transition placeholder:text-ink-soft/60
            focus:border-primary focus:ring-2 focus:ring-primary/25
            dark:bg-surface-dark dark:text-ink-dark dark:placeholder:text-ink-dark-soft/60
            ${error ? "border-danger focus:border-danger focus:ring-danger/20" : "border-border dark:border-border-dark"}
            ${inputProps?.className ?? ""}`}
        />
      )}

      {error ? (
        <p className="mt-1.5 text-xs text-danger">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-ink-soft dark:text-ink-dark-soft">{hint}</p>
      ) : null}
    </div>
  );
}
