"use client";

import Link from "next/link";

import { ErrorState } from "@/app/components/ui/ErrorState";
import { DetailSkeleton } from "@/app/components/ui/LoadingState";
import { TotalsBar } from "@/app/components/ui/TotalsBar";
import { DespesasFiltersProvider } from "@/app/contexts/despesas-filters.context";
import { useDespesasActiveFiltersCount } from "@/app/hooks/use-despesas-active-filters-count";
import { useDespesas } from "@/app/hooks/use-despesas";
import { useFornecedorDetalhe } from "@/app/hooks/use-fornecedor-detalhe";
import { DespesasFilters } from "@/app/features/despesas/DespesasFilters";
import { DespesasResults } from "@/app/features/despesas/DespesasResults";

interface IFornecedorDetailViewProps {
  id: string;
}

export const FornecedorDetailView = ({ id }: IFornecedorDetailViewProps) => {
  const { data, error, isPending, isError, isFetching, refetch } =
    useFornecedorDetalhe(id);

  if (isPending) {
    return <DetailSkeleton label="Carregando fornecedor" kind="supplier" />;
  }

  if (isError || !data) {
    if (error?.data?.code === "NOT_FOUND") {
      return (
        <p className="p-6 text-sm text-text-muted" role="status">
          Fornecedor não encontrado.
        </p>
      );
    }

    return (
      <div className="p-6">
        <ErrorState
          message="Não foi possível carregar o fornecedor."
          onRetry={() => {
            void refetch();
          }}
          isRetrying={isFetching}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/fornecedores"
        className="inline-flex rounded text-sm font-medium text-link hover:text-link-hover hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
      >
        ← Voltar para fornecedores
      </Link>

      <header className="border-b border-border pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-text">
          {data.nome}
        </h1>
        <p className="mt-1 font-mono text-sm text-text-muted">{data.cnpjCpf}</p>
      </header>

      <DespesasFiltersProvider
        key={data.id}
        initialFilters={{
          fornecedorId: Number(data.id),
          legislaturaId: undefined,
        }}
      >
        <FornecedorExpenses />
      </DespesasFiltersProvider>
    </div>
  );
};

const FornecedorExpenses = () => {
  const activeFiltersCount = useDespesasActiveFiltersCount();
  const { data, isPlaceholderData } = useDespesas();

  return (
    <section aria-labelledby="fornecedor-despesas-titulo" className="space-y-4">
      <h2
        id="fornecedor-despesas-titulo"
        className="text-lg font-semibold text-text"
      >
        Despesas relacionadas
      </h2>

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
          labelContexto="Total das despesas deste fornecedor"
          dimmed={isPlaceholderData}
        />
      )}

      <DespesasResults />
    </section>
  );
};
