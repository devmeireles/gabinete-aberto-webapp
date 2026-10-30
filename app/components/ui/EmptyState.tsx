import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
    title?: string;
    description?: string;
    onResetFilters?: () => void;
    actionLabel?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    title = 'Nenhum registro encontrado',
    description = 'Tente ajustar os filtros de busca, selecionar outro período ou limpar os critérios atuais.',
    onResetFilters,
    actionLabel = 'Limpar filtros',
}) => {
    return (
        <div className="py-12 px-4 text-center rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-surface)]">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)] mb-3">
                <SearchX className="w-6 h-6" aria-hidden="true" />
            </div>
            <h3 className="text-base font-semibold text-[var(--color-text)]">
                {title}
            </h3>
            <p className="mt-1 text-xs text-[var(--color-text-muted)] max-w-md mx-auto">
                {description}
            </p>
            {onResetFilters && (
                <div className="mt-4">
                    <button
                        type="button"
                        onClick={onResetFilters}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded text-xs font-medium text-[var(--color-primary)] bg-[var(--color-primary-soft)] hover:bg-[var(--color-surface-subtle)] transition-colors"
                    >
                        <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{actionLabel}</span>
                    </button>
                </div>
            )}
        </div>
    );
};
