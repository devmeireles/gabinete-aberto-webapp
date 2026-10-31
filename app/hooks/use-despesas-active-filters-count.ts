// app/hooks/use-despesas-active-filters-count.ts
"use client";

import {
  useDespesasFilters,
  type IDespesasFilters,
} from "@/app/contexts/despesas-filters.context";

/** legislaturaId e deputadoId não contam: um é obrigatório, o outro é fixo. */
export function useDespesasActiveFiltersCount(): number {
  const filters: IDespesasFilters = useDespesasFilters();

  return [
    filters.tipoDespesaId,
    filters.fornecedor.trim(),
    filters.fromMonth,
    filters.toMonth,
  ].filter(Boolean).length;
}
