"use client";

import { EmptyState } from "@/app/components/ui/EmptyState";
import { ErrorState } from "@/app/components/ui/ErrorState";
import { ExpenseTableSkeleton } from "@/app/components/ui/LoadingState";
import { Pagination } from "@/app/components/ui/Pagination";
import {
  IDespesasFilters,
  useDespesasFilters,
  useDespesasFiltersActions,
} from "@/app/contexts/despesas-filters.context";
import { useDespesas } from "@/app/hooks/use-despesas";

import { DespesaOrdenarPor } from "@/server/schemas/despesa.schema";
import { DespesasTable } from "./DespesasTable";

interface IDespesasResultsProps {
  showDeputado?: boolean;
}

const DEFAULT_ORDER: Record<DespesaOrdenarPor, "asc" | "desc"> = {
  dataDocumento: "desc",
  deputadoNome: "asc",
  tipoDespesa: "asc",
  fornecedorNome: "asc",
  valorDocumento: "desc",
  valorGlosa: "desc",
  valorLiquido: "desc",
};

export const DespesasResults = ({
  showDeputado = true,
}: IDespesasResultsProps) => {
  const filters: IDespesasFilters = useDespesasFilters();
  const { setPagina, setSort, reset } = useDespesasFiltersActions();
  const { data, isPending, isError, isPlaceholderData, isFetching, refetch } =
    useDespesas();

  const handleSort = (column: DespesaOrdenarPor): void => {
    if (column === filters.ordenarPor) {
      setSort(column, filters.ordem === "asc" ? "desc" : "asc");
      return;
    }
    setSort(column, DEFAULT_ORDER[column]);
  };

  if (isPending) {
    return (
      <ExpenseTableSkeleton
        label="Carregando despesas"
        showDeputado={showDeputado}
      />
    );
  }

  if (isError || !data) {
    return (
      <ErrorState
        message="Não foi possível carregar as despesas."
        onRetry={() => {
          void refetch();
        }}
        isRetrying={isFetching}
      />
    );
  }

  if (data.items.length === 0) {
    return (
      <EmptyState
        title="Nenhuma despesa localizada"
        description="Nenhuma despesa coincide com os filtros aplicados. Tente ajustar os parâmetros ou restaurar a busca."
        onResetFilters={reset}
      />
    );
  }

  return (
    <>
      <DespesasTable
        items={data.items}
        ordenarPor={filters.ordenarPor}
        ordem={filters.ordem}
        onSort={handleSort}
        showDeputado={showDeputado}
        dimmed={isPlaceholderData}
      />
      <Pagination
        meta={{
          page: data.pagina,
          pageSize: data.itens,
          totalItems: data.total,
          totalPages: data.totalPaginas,
        }}
        onPageChange={setPagina}
        disabled={isPlaceholderData}
      />
    </>
  );
};
