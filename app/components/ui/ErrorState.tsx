import { RotateCcw, TriangleAlert } from "lucide-react";

interface IErrorStateProps {
  message: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export const ErrorState = ({
  message,
  onRetry,
  isRetrying = false,
}: IErrorStateProps) => (
  <div
    role="alert"
    className="flex flex-col gap-3 rounded-lg border border-danger/30 bg-danger-soft p-4 text-sm text-text sm:flex-row sm:items-center sm:justify-between"
  >
    <p className="flex items-start gap-2">
      <TriangleAlert
        className="mt-0.5 h-4 w-4 shrink-0 text-danger"
        aria-hidden="true"
      />
      <span>{message}</span>
    </p>
    {onRetry && (
      <button
        type="button"
        onClick={onRetry}
        disabled={isRetrying}
        className="inline-flex shrink-0 items-center gap-1.5 self-start rounded border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text transition-colors hover:bg-surface-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
      >
        <RotateCcw
          className={`h-3.5 w-3.5 ${isRetrying ? "animate-spin" : ""}`}
          aria-hidden="true"
        />
        {isRetrying ? "Tentando novamente..." : "Tentar novamente"}
      </button>
    )}
  </div>
);
