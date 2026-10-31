"use client";

import { DeputyAvatar } from "@/app/components/ui/DeputyAvatar";
import { Pagination } from "@/app/components/ui/Pagination";
import {
  useDeputadosFilters,
  useDeputadosFiltersActions,
} from "@/app/contexts/deputados-filters.context";
import { useDeputados } from "@/app/hooks/use-deputados";
import { useRouter } from "next/navigation";
import { DeputadosFilters } from "./DeputadosFilters";

export const DeputadosView = () => {
  const router = useRouter();
  const filters = useDeputadosFilters();
  const { setFilter, setPagina, reset } = useDeputadosFiltersActions();
  const { data, isPending, isPlaceholderData, isError } = useDeputados();

  const handleOpenDossier = (deputadoId: number) => {
    router.push(`/deputados/${deputadoId}`);
  };

  return (
    <div className="flex flex-col gap-4">
      <DeputadosFilters />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {data?.items?.map((deputado) => (
          <div
            key={deputado.id}
            className="group flex flex-col justify-between rounded-lg border border-border bg-surface p-4 transition-all hover:border-primary hover:shadow-xs"
          >
            <div className="flex items-start gap-3">
              {/* Official Portrait with robust fallback */}
              <div
                onClick={() => console.log(deputado.id)}
                className="cursor-pointer transition-transform group-hover:scale-105"
                title={`Abrir Dossiê de ${deputado.nome}`}
              >
                <DeputyAvatar
                  urlFoto={deputado.urlFoto}
                  nome={deputado.nome}
                  size="md"
                />
              </div>

              <div className="min-w-0 flex-1">
                <h3
                  onClick={() => handleOpenDossier(deputado.id)}
                  className="cursor-pointer truncate text-sm font-bold text-text transition-colors hover:text-primary"
                  title={`Abrir Dossiê de ${deputado.nome}`}
                >
                  {deputado.nome}
                </h3>

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
          </div>
        ))}
      </div>

      {data ? (
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
      ) : null}
    </div>
  );
};
