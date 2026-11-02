import { FileText } from "lucide-react";
import Link from "next/link";

import { formatExpenseCategoryIcon } from "@/app/lib/expense-category-icon.lib";
import {
  formatCompactCurrency,
  formatCurrency,
} from "@/app/lib/formartters.lib";
import type { FornecedorListItem } from "@/server/schemas/fornecedor.schema";

interface IFornecedorCardProps {
  fornecedor: FornecedorListItem;
  href: string;
}

export const FornecedorCard = ({ fornecedor, href }: IFornecedorCardProps) => {
  return (
    <Link
      href={href}
      aria-label={`Ver despesas de ${fornecedor.nome}, total bruto declarado ${formatCurrency(fornecedor.totalBruto)}, ${fornecedor.totalDespesas.toLocaleString("pt-BR")} notas emitidas`}
      className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 rounded-xl bg-primary/10 p-3 text-primary">
          {formatExpenseCategoryIcon(fornecedor.tipoDespesaPrincipal, {
            className: "h-6 w-6",
            "aria-hidden": true,
          })}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-bold text-text transition-colors group-hover:text-primary">
            {fornecedor.nome}
          </h2>
        </div>
      </div>

      <div>
        <p className="mb-1 text-[10px] font-bold tracking-wider text-text-muted uppercase">
          Total bruto declarado
        </p>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span
            title={formatCurrency(fornecedor.totalBruto)}
            className="text-xl font-extrabold text-text"
          >
            {formatCompactCurrency(fornecedor.totalBruto)}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
            <FileText className="h-3.5 w-3.5" aria-hidden="true" />
            {fornecedor.totalDespesas.toLocaleString("pt-BR")} notas
          </span>
        </div>
      </div>
    </Link>
  );
};
