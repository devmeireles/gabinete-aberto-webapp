"use client";

import Link from "next/link";

import { ErrorState } from "@/app/components/ui/ErrorState";
import { Skeleton } from "@/app/components/ui/LoadingState";
import { useDespesasFilters } from "@/app/contexts/despesas-filters.context";
import { useDeputadoDespesasAnalytics } from "@/app/hooks/use-deputado-despesas-analytics";
import { ExpenseDistributionChart } from "@/app/features/dashboard/ExpenseDistributionChart";
import { MonthlyEvolutionChart } from "@/app/features/dashboard/MonthlyEvolutionChart";
import {
  formatCompactCurrency,
  formatCnpjOrCpf,
  formatCurrency,
  formatInteger,
} from "@/app/lib/formartters.lib";

interface IDeputadoExpensesChartsProps {
  deputadoId: number;
}

export const DeputadoExpensesCharts = ({
  deputadoId,
}: IDeputadoExpensesChartsProps) => {
  const filters = useDespesasFilters();
  const {
    data,
    isPending,
    isPlaceholderData,
    isError,
    isFetching,
    isTyping,
    refetch,
  } = useDeputadoDespesasAnalytics(deputadoId);
  const monthlyData = data?.evolucaoMensal ?? [];
  const categories = data?.distribuicaoPorTipo ?? [];
  const suppliers = data?.maioresFornecedores ?? [];

  if ((isPending || isTyping || isPlaceholderData) && !isError) {
    return (
      <div
        role="status"
        aria-label="Carregando gráficos de despesas"
        className="grid gap-6 xl:grid-cols-2"
      >
        <Skeleton className="h-96 w-full rounded-xl xl:col-span-2" />
        <Skeleton className="h-80 w-full rounded-xl" />
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    );
  }

  if (isError && !data) {
    return (
      <ErrorState
        message="Não foi possível carregar os gráficos de despesas do parlamentar."
        onRetry={() => {
          void refetch();
        }}
        isRetrying={isFetching}
      />
    );
  }

  if (
    !data ||
    (monthlyData.length === 0 &&
      categories.length === 0 &&
      suppliers.length === 0)
  ) {
    return null;
  }

  const firstMonth = monthlyData[0];
  const lastMonth = monthlyData[monthlyData.length - 1];
  const fromMonth =
    filters.fromMonth ||
    (firstMonth
      ? `${firstMonth.ano}-${String(firstMonth.mes).padStart(2, "0")}`
      : "");
  const toMonth =
    filters.toMonth ||
    (lastMonth
      ? `${lastMonth.ano}-${String(lastMonth.mes).padStart(2, "0")}`
      : undefined);

  const maxSupplierValue = Math.max(
    ...suppliers.map((supplier) => supplier.totalLiquido),
    1,
  );

  return (
    <div aria-busy={isFetching} className="grid gap-6 xl:grid-cols-2">
      {isError && (
        <div className="xl:col-span-2">
          <ErrorState
            message="Não foi possível atualizar os gráficos. Exibindo os últimos resultados carregados."
            onRetry={() => {
              void refetch();
            }}
            isRetrying={isFetching}
          />
        </div>
      )}
      {monthlyData.length > 0 && fromMonth && (
        <MonthlyEvolutionChart
          data={monthlyData}
          fromMonth={fromMonth}
          toMonth={toMonth}
          className="xl:col-span-2"
        />
      )}
      {categories.length > 0 && <ExpenseDistributionChart data={categories} />}
      {suppliers.length > 0 && (
        <section
          aria-labelledby="deputy-top-suppliers-title"
          className="min-w-0 rounded-xl border border-border bg-surface p-5"
        >
          <header className="mb-4 border-b border-border-subtle pb-3">
            <h2
              id="deputy-top-suppliers-title"
              className="text-sm font-semibold text-text"
            >
              Empresas que mais recebem
            </h2>
            <p className="mt-1 text-xs text-text-muted">
              Maiores valores líquidos pagos pelo parlamentar
            </p>
          </header>
          <ol className="space-y-3">
            {suppliers.map((supplier, index) => {
              const ratio = (supplier.totalLiquido / maxSupplierValue) * 100;

              return (
                <li key={supplier.fornecedorId}>
                  <Link
                    href={`/fornecedores/${supplier.fornecedorId}`}
                    className="group block rounded-lg p-2 transition-colors hover:bg-surface-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex min-w-0 items-start gap-2">
                        <span className="w-4 shrink-0 pt-0.5 text-center text-xs font-bold text-text-muted tabular-nums">
                          {index + 1}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-xs font-semibold text-text group-hover:text-primary">
                            {supplier.nome}
                          </span>
                          <span className="block truncate font-mono text-[10px] text-text-muted">
                            CNPJ/CPF: {formatCnpjOrCpf(supplier.cnpjCpf)}
                          </span>
                        </span>
                      </span>
                      <span className="shrink-0 text-right">
                        <span
                          title={formatCurrency(supplier.totalLiquido)}
                          className="block font-mono text-xs font-bold text-text tabular-nums"
                        >
                          {formatCompactCurrency(supplier.totalLiquido)}
                        </span>
                        <span className="block text-[10px] text-text-muted">
                          {formatInteger(supplier.totalRegistros)} documentos
                        </span>
                      </span>
                    </div>
                    <div
                      aria-hidden="true"
                      className="mt-2 h-1 overflow-hidden rounded-full bg-border-subtle"
                    >
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${ratio}%` }}
                      />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>
      )}
    </div>
  );
};
