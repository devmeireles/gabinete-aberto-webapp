"use client";

import Link from "next/link";

import { DeputyAvatar } from "@/app/components/ui/DeputyAvatar";
import { EmptyState } from "@/app/components/ui/EmptyState";
import { ErrorState } from "@/app/components/ui/ErrorState";
import { Pagination } from "@/app/components/ui/Pagination";
import { useDeputadosFiltersActions } from "@/app/contexts/deputados-filters.context";
import { useDeputados } from "@/app/hooks/use-deputados";
import { DeputadosFilters } from "./DeputadosFilters";

export const DeputadosView = () => {
  const { setPagina, reset } = useDeputadosFiltersActions();
  const { data, isPending, isPlaceholderData, isError, isFetching, refetch } =
    useDeputados();

  return (
    <div className="flex flex-col gap-4">
      <DeputadosFilters />

      {isPending && !data ? (
        <p className="text-sm text-text-muted" role="status" aria-busy="true">
          Carregando deputados...
        </p>
      ) : null}

      {isError && !data ? (
        <ErrorState
          message="Não foi possível carregar os deputados."
          onRetry={() => {
            void refetch();
          }}
          isRetrying={isFetching}
        />
      ) : null}

      {isError && data ? (
        <ErrorState
          message="Não foi possível atualizar a lista. Exibindo os resultados anteriores."
          onRetry={() => {
            void refetch();
          }}
          isRetrying={isFetching}
        />
      ) : null}

      {data?.items.length === 0 ? (
        <EmptyState
          title="Nenhum deputado localizado"
          description="Nenhum deputado coincide com os filtros aplicados. Ajuste os parâmetros ou restaure a busca."
          onResetFilters={reset}
        />
      ) : null}

      {data && data.items.length > 0 ? (
        <>
          <ul
            aria-busy={isPlaceholderData}
            className={`grid grid-cols-1 gap-4 transition-opacity sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ${
              isPlaceholderData ? "opacity-60" : ""
            }`}
          >
            {data.items.map((deputado) => (
              <li key={deputado.id}>
                <Link
                  href={`/deputados/${deputado.id}`}
                  title={`Abrir dossiê de ${deputado.nome}`}
                  className="group flex h-full flex-col justify-between rounded-lg border border-border bg-surface p-4 transition-all hover:border-primary hover:shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                >
                  <div className="flex items-start gap-3">
                    <DeputyAvatar
                      urlFoto={deputado.urlFoto}
                      nome={deputado.nome}
                      size="md"
                    />

                    <div className="min-w-0 flex-1">
                      <h2 className="truncate text-sm font-bold text-text transition-colors group-hover:text-primary">
                        {deputado.nome}
                      </h2>

                      <div className="mt-0.5 flex items-center gap-1.5 text-xs text-text-muted">
                        <span className="font-semibold text-primary">
                          {deputado.siglaPartido}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{deputado.siglaUf}</span>
                      </div>

                      {deputado.situacao ? (
                        <div className="mt-1 text-[11px] text-text-subtle">
                          Situação: {deputado.situacao}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </Link>
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
