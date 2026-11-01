import { RotateCcw, SearchX } from "lucide-react";
import React from "react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  onResetFilters?: () => void;
  actionLabel?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "Nenhum registro encontrado",
  description = "Tente ajustar os filtros de busca, selecionar outro período ou limpar os critérios atuais.",
  onResetFilters,
  actionLabel = "Limpar filtros",
}) => {
  return (
    <div className="rounded-lg border border-dashed border-border bg-surface px-4 py-12 text-center">
      <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-surface-subtle text-text-muted">
        <SearchX className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-text">{title}</h3>
      <p className="mx-auto mt-1 max-w-md text-xs text-text-muted">
        {description}
      </p>
      {onResetFilters && (
        <div className="mt-4">
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 rounded bg-primary-soft px-3.5 py-2 text-xs font-medium text-primary transition-colors hover:bg-surface-subtle focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{actionLabel}</span>
          </button>
        </div>
      )}
    </div>
  );
};
