"use client";

import { TotalsBar } from "@/app/components/ui/TotalsBar";
import { TotalsBarSkeleton } from "@/app/components/ui/LoadingState";
import { useDespesasActiveFiltersCount } from "@/app/hooks/use-despesas-active-filters-count";
import { useDespesas } from "@/app/hooks/use-despesas";
import { DespesasFilters } from "./DespesasFilters";
import { DespesasResults } from "./DespesasResults";

export const DespesasView = () => {
  const activeFiltersCount = useDespesasActiveFiltersCount();
  const { data, isPending, isPlaceholderData } = useDespesas();

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">
            Despesas da Cota Parlamentar (CEAP)
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Consulta auditável com discriminação de valor bruto declarado,
            glosas retidas e valor líquido ressarcido.
          </p>
        </div>
      </div>

      <DespesasFilters />

      {data && (
        <TotalsBar
          totais={{
            valorBruto: data.totalBruto,
            valorGlosa: data.totalGlosa,
            valorLiquido: data.totalLiquido,
            totalRegistros: data.total,
          }}
          filtrosAtivosCount={activeFiltersCount}
          labelContexto="Total das despesas filtradas"
          dimmed={isPlaceholderData}
        />
      )}
      {isPending && !data && <TotalsBarSkeleton />}

      <DespesasResults />
    </div>
  );
};
