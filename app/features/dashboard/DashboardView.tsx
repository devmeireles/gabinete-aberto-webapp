"use client";

import { EmptyState } from "@/app/components/ui/EmptyState";
import { ErrorState } from "@/app/components/ui/ErrorState";
import { LoadingSpinner } from "@/app/components/ui/LoadingState";
import { useDashboardMetrics } from "@/app/hooks/use-dashboard-metrics";
import { DashboardHero } from "./DashboardHero";
import { DashboardLoadingState } from "./DashboardLoadingState";
import { DashboardMetricCards } from "./DashboardMetricCards";
import { DashboardPartySummary } from "./DashboardPartySummary";
import { CitizenEquivalenceSimulator } from "./CitizenEquivalenceSimulator";
import { ExpenseDistributionChart } from "./ExpenseDistributionChart";
import { MonthlyEvolutionChart } from "./MonthlyEvolutionChart";

export const DashboardView = () => {
  return <DashboardMetricsView />;
};

const DashboardMetricsView = () => {
  const { data, isPending, isPlaceholderData, isError, isFetching, refetch } =
    useDashboardMetrics();

  return (
    <>
      {isError && (
        <ErrorState
          message={
            data
              ? "Não foi possível atualizar os indicadores. Exibindo os últimos resultados carregados."
              : "Não foi possível carregar os indicadores do painel."
          }
          onRetry={() => {
            void refetch();
          }}
          isRetrying={isFetching}
        />
      )}

      {isPending && !data && <DashboardLoadingState />}

      {isFetching && data && (
        <div
          role="status"
          aria-live="polite"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-2 text-xs font-medium text-text-muted shadow-xs"
        >
          <LoadingSpinner />
          Atualizando indicadores da legislatura vigente...
        </div>
      )}

      {data && (
        <div aria-busy={isPlaceholderData || isFetching} className="space-y-6">
          <DashboardHero totais={data.totais} />
          <DashboardMetricCards totais={data.totais} />
          <CitizenEquivalenceSimulator
            key={`${data.periodo.dataInicio}:${data.periodo.dataFim}:${data.totais.totalLiquido}`}
            totalLiquido={data.totais.totalLiquido}
          />

          {data.totais.totalRegistros === 0 ? (
            <EmptyState
              title="Nenhuma despesa localizada na legislatura"
              description="Ainda não há documentos de despesa registrados para a legislatura vigente."
            />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <MonthlyEvolutionChart
                  data={data.evolucaoMensal}
                  fromMonth={data.periodo.dataInicio.slice(0, 7)}
                  toMonth={data.periodo.dataFim?.slice(0, 7)}
                />
                <ExpenseDistributionChart data={data.distribuicaoPorTipo} />
              </div>
              <DashboardPartySummary data={data.maioresGastosPartidos} />
            </>
          )}
        </div>
      )}
    </>
  );
};
