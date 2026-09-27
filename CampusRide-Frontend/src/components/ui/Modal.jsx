import { X } from "lucide-react";

/**
 * Shared modal shell: overlay + centered card + header with title/subtitle
 * and a close button. Renders `children` as the body (usually a <form>).
 */
export default function Modal({ title, subtitle, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-card border border-border bg-surface-raised p-4 shadow-raised dark:border-border-dark dark:bg-surface-dark-raised sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-ink dark:text-ink-dark sm:text-xl">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-0.5 text-sm text-ink-soft dark:text-ink-dark-soft">
                {subtitle}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-soft transition hover:bg-primary-light hover:text-ink dark:text-ink-dark-soft dark:hover:bg-surface-dark"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
