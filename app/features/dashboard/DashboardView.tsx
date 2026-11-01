"use client";

import {
  useDashboardFilters,
  useDashboardFiltersActions,
} from "@/app/contexts/dashboard-filters.context";
import { ErrorState } from "@/app/components/ui/ErrorState";
import { useLegislaturas } from "@/app/hooks/use-legislaturas";

export const DashboardView = () => {
  const { fromMonth, legislaturaId, toMonth } = useDashboardFilters();
  const { setFromMonth, setLegislaturaId, setToMonth } =
    useDashboardFiltersActions();
  const {
    data: legislaturas = [],
    isLoading: isLoadingLegislaturas,
    isFetching: isFetchingLegislaturas,
    isError: isErrorLegislaturas,
    refetch: refetchLegislaturas,
  } = useLegislaturas();

  return (
    <div>
      <div className="flex flex-col gap-6 border-b border-border pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2 text-xs font-semibold tracking-wider text-primary uppercase">
            <span>Panorama Oficial</span>
            <span aria-hidden="true">·</span>
            <span>Câmara dos Deputados</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text sm:text-3xl">
            Transparência das Despesas Parlamentares
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-text-muted">
            Acompanhamento auditável da Cota para o Exercício da Atividade
            Parlamentar (CEAP), bancadas e deputados federais.
          </p>
        </div>

        {/* Legislatura & Period Selectors */}
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface p-3 text-xs">
          <div>
            <label
              htmlFor="select-legislatura"
              className="mb-1 block text-[11px] font-medium text-text-muted"
            >
              Legislatura
            </label>
            <select
              id="select-legislatura"
              value={legislaturaId}
              disabled={isLoadingLegislaturas || legislaturas.length === 0}
              onChange={(e) => setLegislaturaId(Number(e.target.value))}
              className="rounded border border-border bg-surface px-2.5 py-1.5 font-medium text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring disabled:cursor-not-allowed disabled:opacity-60"
            >
              {legislaturas.length === 0 && (
                <option value={legislaturaId}>
                  {isLoadingLegislaturas
                    ? "Carregando legislaturas..."
                    : "Nenhuma legislatura disponível"}
                </option>
              )}
              {legislaturas.map((legislatura) => (
                <option key={legislatura.id} value={legislatura.id}>
                  {legislatura.id}ª Legislatura ({legislatura.dataInicio} -{" "}
                  {legislatura.dataFim})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="filter-from-month"
              className="mb-1 block text-[11px] font-medium text-text-muted"
            >
              De (Ano/Mês)
            </label>
            <input
              type="month"
              id="filter-from-month"
              value={fromMonth}
              onChange={(e) => setFromMonth(e.target.value)}
              className="rounded border border-border bg-surface px-2 py-1 font-mono text-text tabular-nums focus:outline-none focus-visible:ring-1 focus-visible:ring-focus-ring"
            />
          </div>

          <div>
            <label
              htmlFor="filter-to-month"
              className="mb-1 block text-[11px] font-medium text-text-muted"
            >
              Até (Ano/Mês)
            </label>
            <input
              type="month"
              id="filter-to-month"
              value={toMonth}
              onChange={(e) => setToMonth(e.target.value)}
              className="rounded border border-border bg-surface px-2 py-1 font-mono text-text tabular-nums focus:outline-none focus-visible:ring-1 focus-visible:ring-focus-ring"
            />
          </div>
        </div>
      </div>

      {isErrorLegislaturas && (
        <ErrorState
          message="Não foi possível carregar as opções de legislatura."
          onRetry={() => {
            void refetchLegislaturas();
          }}
          isRetrying={isFetchingLegislaturas}
        />
      )}
    </div>
  );
};
