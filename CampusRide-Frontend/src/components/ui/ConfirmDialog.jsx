import Button from "./Button";

/**
 * Reusable confirmation dialog, replacing native window.confirm().
 * Render conditionally: {open && <ConfirmDialog ... />}
 */
export default function ConfirmDialog({
  title = "Are you sure?",
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "danger",
  loading = false,
  onConfirm,
  onCancel,
}) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-card border border-border bg-surface-raised p-5 shadow-raised dark:border-border-dark dark:bg-surface-dark-raised"
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          id="confirm-dialog-title"
          className="text-base font-semibold text-ink dark:text-ink-dark"
        >
          {title}
        </h3>

        {description && (
          <p className="mt-1.5 text-sm text-ink-soft dark:text-ink-dark-soft">
            {description}
          </p>
        )}

        <div className="mt-5 flex justify-end gap-2.5">
          <Button variant="outline" size="sm" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={tone === "danger" ? "danger" : "primary"}
            size="sm"
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
