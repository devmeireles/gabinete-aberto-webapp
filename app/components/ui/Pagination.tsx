import { ChevronLeft, ChevronRight } from "lucide-react";

export interface IPaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

interface IPaginationProps {
  meta: IPaginationMeta;
  onPageChange: (newPage: number) => void;
  /** Trava os botões (ex.: enquanto a página seguinte carrega). */
  disabled?: boolean;
}

const numberFormat: Intl.NumberFormat = new Intl.NumberFormat("pt-BR");

const NUMBER_CLASS: string =
  "font-mono tabular-nums font-semibold text-[var(--color-text)]";
const BUTTON_CLASS: string =
  "inline-flex items-center gap-1 px-3 py-1.5 rounded border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors";

export const Pagination = ({
  meta,
  onPageChange,
  disabled = false,
}: IPaginationProps) => {
  const { page, totalPages, totalItems, pageSize } = meta;

  if (totalPages <= 1) return null;

  const startItem: number = (page - 1) * pageSize + 1;
  const endItem: number = Math.min(page * pageSize, totalItems);

  return (
    <nav
      aria-label="Navegação entre páginas"
      className="flex flex-col items-center justify-between gap-4 border-t border-border px-2 py-4 text-xs text-text-muted sm:flex-row"
    >
      <div>
        Mostrando{" "}
        <span className={NUMBER_CLASS}>{numberFormat.format(startItem)}</span> a{" "}
        <span className={NUMBER_CLASS}>{numberFormat.format(endItem)}</span> de{" "}
        <span className={NUMBER_CLASS}>{numberFormat.format(totalItems)}</span>{" "}
        registros
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={disabled || page <= 1}
          aria-label="Página anterior"
          className={BUTTON_CLASS}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          <span>Anterior</span>
        </button>

        <span className="px-3 py-1 font-mono text-xs font-medium text-text tabular-nums">
          Pág. {numberFormat.format(page)} de {numberFormat.format(totalPages)}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={disabled || page >= totalPages}
          aria-label="Próxima página"
          className={BUTTON_CLASS}
        >
          <span>Próxima</span>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
};
