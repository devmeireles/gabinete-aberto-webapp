"use client";

import Link from "next/link";

import { DeputyAvatar } from "@/app/components/ui/DeputyAvatar";
import { ErrorState } from "@/app/components/ui/ErrorState";
import { Skeleton } from "@/app/components/ui/LoadingState";
import { useFornecedorTopDeputies } from "@/app/hooks/use-fornecedor-top-deputies";
import {
  formatCompactCurrency,
  formatCurrency,
  formatInteger,
} from "@/app/lib/formartters.lib";

interface IFornecedorTopDeputiesProps {
  fornecedorId: number;
}

export const FornecedorTopDeputies = ({
  fornecedorId,
}: IFornecedorTopDeputiesProps) => {
  const {
    data,
    isPending,
    isPlaceholderData,
    isError,
    isFetching,
    isTyping,
    refetch,
  } = useFornecedorTopDeputies(fornecedorId);

  if ((isPending || isTyping || isPlaceholderData) && !isError) {
    return (
      <section
        aria-label="Carregando ranking de parlamentares"
        role="status"
        className="space-y-4 rounded-xl border border-border bg-surface p-5"
      >
        <Skeleton className="h-5 w-64" />
        <Skeleton className="h-4 w-80 max-w-full" />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </section>
    );
  }

  if (isError && !data) {
    return (
      <ErrorState
        message="Não foi possível carregar o ranking de parlamentares deste fornecedor."
        onRetry={() => {
          void refetch();
        }}
        isRetrying={isFetching}
      />
    );
  }

  if (!data || data.length === 0) return null;

  const maxTotal = Math.max(...data.map((deputy) => deputy.totalLiquido), 1);

  return (
    <section
      aria-labelledby="fornecedor-top-deputies-title"
      aria-busy={isFetching}
      className="space-y-4 rounded-xl border border-border bg-surface p-5"
    >
      {isError && (
        <ErrorState
          message="Não foi possível atualizar o ranking. Exibindo os últimos resultados carregados."
          onRetry={() => {
            void refetch();
          }}
          isRetrying={isFetching}
        />
      )}
      <header>
        <h2
          id="fornecedor-top-deputies-title"
          className="text-sm font-semibold text-text"
        >
          Parlamentares que mais gastaram com este fornecedor
        </h2>
        <p className="mt-1 text-xs text-text-muted">
          Ranking por valor líquido no período e nos filtros selecionados
        </p>
      </header>

      <ol className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {data.map((deputy, index) => {
          const ratio = (deputy.totalLiquido / maxTotal) * 100;

          return (
            <li key={deputy.deputadoId} className="min-w-0">
              <Link
                href={`/deputados/${deputy.deputadoId}`}
                className="group block h-full rounded-lg border border-border-subtle p-3 transition-colors hover:border-primary hover:bg-surface-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
              >
                <div className="flex items-center gap-3">
                  <span
                    aria-label={`Posição ${index + 1}`}
                    className="w-5 shrink-0 text-center text-xs font-bold text-text-muted tabular-nums"
                  >
                    {index + 1}
                  </span>
                  <DeputyAvatar
                    urlFoto={deputy.urlFoto}
                    nome={deputy.nome}
                    size="sm"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-semibold text-text group-hover:text-primary">
                      {deputy.nome}
                    </span>
                    <span className="block text-[10px] text-text-muted">
                      {[deputy.siglaPartido, deputy.siglaUf]
                        .filter(Boolean)
                        .join(" · ") || "Vínculo não informado"}
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span
                      title={formatCurrency(deputy.totalLiquido)}
                      className="block font-mono text-xs font-bold text-text tabular-nums"
                    >
                      {formatCompactCurrency(deputy.totalLiquido)}
                    </span>
                    <span className="block text-[10px] text-text-muted">
                      {formatInteger(deputy.totalRegistros)} documentos
                    </span>
                  </span>
                </div>
                <div
                  aria-hidden="true"
                  className="mt-3 h-1 overflow-hidden rounded-full bg-border-subtle"
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
  );
};
