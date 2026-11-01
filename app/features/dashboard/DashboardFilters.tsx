"use client";

import { ErrorState } from "@/app/components/ui/ErrorState";
import { LoadingSpinner } from "@/app/components/ui/LoadingState";
import {
  useDashboardFilters,
  useDashboardFiltersActions,
} from "@/app/contexts/dashboard-filters.context";
import { useLegislaturas } from "@/app/hooks/use-legislaturas";

export const DashboardFilters = () => {
  const filters = useDashboardFilters();
  const { fromMonth, legislaturaId, toMonth } = filters;
  const { setFromMonth, setLegislaturaId, setToMonth } =
    useDashboardFiltersActions();
  const {
    data: legislaturas = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useLegislaturas();
  const hasCurrentLegislatura = legislaturas.some(
    (legislatura) => legislatura.legislaturaAtual,
  );

  return (
    <section className="space-y-4">
      <header className="max-w-3xl">
        <p className="mb-1 text-xs font-semibold tracking-wider text-primary uppercase">
          Panorama oficial · Câmara dos Deputados
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-text sm:text-3xl">
          Transparência das Despesas Parlamentares
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Acompanhe valores declarados da Cota para o Exercício da Atividade
          Parlamentar (CEAP), por período e legislatura.
        </p>
      </header>

      <div className="flex flex-wrap items-end gap-3 rounded-lg border border-border bg-surface p-4 text-xs">
        <div>
          <label
            htmlFor="select-legislatura"
            className="mb-1 block text-[11px] font-medium text-text-muted"
          >
            Legislatura
          </label>
          <div className="flex items-center gap-2">
            <select
              id="select-legislatura"
              value={filters.isInitialized ? legislaturaId : ""}
              disabled={isLoading || legislaturas.length === 0}
              onChange={(event) => setLegislaturaId(Number(event.target.value))}
              className="rounded border border-border bg-surface px-2.5 py-1.5 font-medium text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring disabled:cursor-not-allowed disabled:opacity-60"
            >
              {!filters.isInitialized && (
                <option value="">
                  {isLoading
                    ? "Carregando legislaturas..."
                    : "Selecione uma legislatura"}
                </option>
              )}
              {legislaturas.map((legislatura) => (
                <option key={legislatura.id} value={legislatura.id}>
                  {legislatura.id}ª Legislatura ({legislatura.dataInicio} -{" "}
                  {legislatura.dataFim ?? "em andamento"})
                </option>
              ))}
            </select>
            {isLoading && (
              <span className="inline-flex items-center gap-1 text-[11px] text-text-muted">
                <LoadingSpinner className="h-3.5 w-3.5" />
                Carregando
              </span>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="filter-from-month"
            className="mb-1 block text-[11px] font-medium text-text-muted"
          >
            De (ano/mês)
          </label>
          <input
            type="month"
            id="filter-from-month"
            value={fromMonth}
            disabled={!filters.isInitialized}
            max={toMonth || undefined}
            onChange={(event) => setFromMonth(event.target.value)}
            className="rounded border border-border bg-surface px-2 py-1.5 font-mono text-text tabular-nums focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          />
        </div>

        <div>
          <label
            htmlFor="filter-to-month"
            className="mb-1 block text-[11px] font-medium text-text-muted"
          >
            Até (ano/mês)
          </label>
          <input
            type="month"
            id="filter-to-month"
            value={toMonth}
            disabled={!filters.isInitialized}
            min={fromMonth || undefined}
            onChange={(event) => setToMonth(event.target.value)}
            className="rounded border border-border bg-surface px-2 py-1.5 font-mono text-text tabular-nums focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          />
        </div>
      </div>

      {isError && (
        <ErrorState
          message="Não foi possível carregar as opções de legislatura."
          onRetry={() => {
            void refetch();
          }}
          isRetrying={isFetching}
        />
      )}
      {!isLoading && !isError && !filters.isInitialized && (
        <ErrorState
          message={
            legislaturas.length === 0
              ? "Não há legislaturas cadastradas para carregar o painel."
              : hasCurrentLegislatura
                ? "Não foi possível selecionar a legislatura vigente."
                : "Não há uma legislatura vigente identificada nos dados cadastrados."
          }
        />
      )}
    </section>
  );
};
