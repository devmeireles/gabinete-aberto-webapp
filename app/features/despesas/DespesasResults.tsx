"use client";

import { EmptyState } from "@/app/components/ui/EmptyState";
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
  const { data, isPending, isError, isPlaceholderData } = useDespesas();

  const handleSort = (column: DespesaOrdenarPor): void => {
    if (column === filters.ordenarPor) {
      setSort(column, filters.ordem === "asc" ? "desc" : "asc");
      return;
    }
    setSort(column, DEFAULT_ORDER[column]);
  };

  if (isPending) {
    return (
      <p className="text-sm text-text-muted" aria-busy="true">
        Carregando despesas...
      </p>
    );
  }

  if (isError || !data) {
    return (
      <p className="text-sm text-warning">
        Não foi possível carregar as despesas.
      </p>
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
