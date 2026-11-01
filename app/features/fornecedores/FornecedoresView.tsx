"use client";

import { useState } from "react";

import { EmptyState } from "@/app/components/ui/EmptyState";
import { ErrorState } from "@/app/components/ui/ErrorState";
import { FornecedorCard } from "@/app/components/ui/FornecedorCard";
import { CardGridSkeleton } from "@/app/components/ui/LoadingState";
import { Pagination } from "@/app/components/ui/Pagination";
import { useFornecedores } from "@/app/hooks/use-fornecedores";
import type { FornecedorOrdenarPor } from "@/server/schemas/fornecedor.schema";

const ITEMS_PER_PAGE = 21;

export const FornecedoresView = () => {
  const [busca, setBusca] = useState("");
  const [ordenarPor, setOrdenarPor] =
    useState<FornecedorOrdenarPor>("totalBruto");
  const [ordem, setOrdem] = useState<"asc" | "desc">("desc");
  const [pagina, setPagina] = useState(1);
  const { data, isPending, isPlaceholderData, isError, isFetching, refetch } =
    useFornecedores({
      busca,
      ordenarPor,
      ordem,
      pagina,
      itens: ITEMS_PER_PAGE,
    });

  const handleSearchChange = (value: string) => {
    setBusca(value);
    setPagina(1);
  };

  const handleSortChange = (value: FornecedorOrdenarPor) => {
    setOrdenarPor(value);
    setOrdem(value === "totalBruto" ? "desc" : "asc");
    setPagina(1);
  };
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="border-b border-border pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-text">
          Fornecedores
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Consulte fornecedores registrados nas despesas parlamentares e acesse
          os documentos associados.
        </p>
      </header>

      <section
        aria-label="Filtros de fornecedores"
        className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 sm:flex-row sm:items-end"
      >
        <div className="flex-1">
          <label
            htmlFor="fornecedores-search"
            className="mb-1 block text-[11px] font-medium text-text-muted"
          >
            Nome ou CPF/CNPJ
          </label>
          <input
            id="fornecedores-search"
            type="search"
            value={busca}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="Buscar fornecedor"
            className="w-full rounded border border-border bg-surface px-2.5 py-1.5 text-sm text-text placeholder:text-text-subtle focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          />
        </div>
        <div>
          <label
            htmlFor="fornecedores-sort"
            className="mb-1 block text-[11px] font-medium text-text-muted"
          >
            Ordenar por
          </label>
          <select
            id="fornecedores-sort"
            value={ordenarPor}
            onChange={(event) =>
              handleSortChange(
                event.target.value === "cnpjCpf" ||
                  event.target.value === "totalBruto"
                  ? event.target.value
                  : "nome",
              )
            }
            className="rounded border border-border bg-surface px-2.5 py-1.5 text-sm text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            <option value="nome">Nome</option>
            <option value="cnpjCpf">CPF/CNPJ</option>
            <option value="totalBruto">Total bruto declarado</option>
          </select>
        </div>
        <button
          type="button"
          onClick={() => {
            setOrdem((current) => (current === "asc" ? "desc" : "asc"));
            setPagina(1);
          }}
          aria-label={`Ordenação ${ordem === "asc" ? "crescente" : "decrescente"}. Alternar direção`}
          aria-pressed={ordem === "asc"}
          className="rounded border border-border bg-surface px-2.5 py-1.5 text-sm text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
        >
          {ordem === "asc" ? "Crescente ↑" : "Decrescente ↓"}
        </button>
      </section>

      {isPending && !data ? (
        <CardGridSkeleton
          label="Carregando fornecedores"
          kind="supplier"
          count={ITEMS_PER_PAGE}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
        />
      ) : null}

      {isError ? (
        <ErrorState
          message="Não foi possível carregar os fornecedores."
          onRetry={() => {
            void refetch();
          }}
          isRetrying={isFetching}
        />
      ) : null}

      {data?.items.length === 0 ? (
        <EmptyState
          title="Nenhum fornecedor localizado"
          description="Não há fornecedores que correspondam à busca informada."
          actionLabel="Limpar busca"
          onResetFilters={() => handleSearchChange("")}
        />
      ) : null}

      {data && data.items.length > 0 ? (
        <>
          <ul
            aria-busy={isPlaceholderData}
            className={`grid grid-cols-1 gap-3 transition-opacity sm:grid-cols-2 lg:grid-cols-3 ${
              isPlaceholderData ? "opacity-60" : ""
            }`}
          >
            {data.items.map((fornecedor) => (
              <li key={fornecedor.id}>
                <FornecedorCard
                  fornecedor={fornecedor}
                  href={`/fornecedores/${fornecedor.id}`}
                />
              </li>
            ))}
          </ul>
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
      ) : null}
    </div>
  );
};
