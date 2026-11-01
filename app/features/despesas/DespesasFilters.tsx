"use client";

import { RotateCcw } from "lucide-react";

import { ErrorState } from "@/app/components/ui/ErrorState";
import {
  useDespesasFilters,
  useDespesasFiltersActions,
  type IDespesasFilters,
} from "@/app/contexts/despesas-filters.context";
import { useLegislaturas } from "@/app/hooks/use-legislaturas";
import { useDespesasActiveFiltersCount } from "@/app/hooks/use-despesas-active-filters-count";
import { useTiposDespesa } from "@/app/hooks/use-tipos-despesa";

const FIELD_CLASS: string =
  "w-full rounded border border-border bg-surface px-2.5 py-1.5 text-text placeholder:text-text-subtle focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring";
const LABEL_CLASS: string =
  "mb-1 block text-[11px] font-medium text-text-muted";

interface IDespesasFiltersProps {
  /** Restringe as legislaturas oferecidas (ex.: só as do deputado). */
  legislaturaIds?: number[];
}

export const DespesasFilters = ({ legislaturaIds }: IDespesasFiltersProps) => {
  const filters: IDespesasFilters = useDespesasFilters();
  const { setFilter, reset } = useDespesasFiltersActions();
  const {
    data: todasLegislaturas = [],
    isError: isErrorLegislaturas,
    isFetching: isFetchingLegislaturas,
    refetch: refetchLegislaturas,
  } = useLegislaturas();
  const {
    data: tipos = [],
    isError: isErrorTipos,
    isFetching: isFetchingTipos,
    refetch: refetchTipos,
  } = useTiposDespesa();
  const activeFiltersCount = useDespesasActiveFiltersCount();

  const legislaturas = legislaturaIds
    ? todasLegislaturas.filter((l) => legislaturaIds.includes(l.id))
    : todasLegislaturas;

  // O intervalo de meses de uma legislatura não vale para outra: limpa junto.
  const handleLegislaturaChange = (value: string): void => {
    setFilter("legislaturaId", value ? Number(value) : undefined);
    setFilter("fromMonth", "");
    setFilter("toMonth", "");
  };

  return (
    <div className="space-y-4 rounded-lg border border-border bg-surface p-4">
      {isErrorLegislaturas && (
        <ErrorState
          message="Não foi possível carregar as opções de legislatura."
          onRetry={() => {
            void refetchLegislaturas();
          }}
          isRetrying={isFetchingLegislaturas}
        />
      )}
      {isErrorTipos && (
        <ErrorState
          message="Não foi possível carregar os tipos de despesa."
          onRetry={() => {
            void refetchTipos();
          }}
          isRetrying={isFetchingTipos}
        />
      )}

      <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <label htmlFor="filter-legislatura" className={LABEL_CLASS}>
            Legislatura
          </label>
          <select
            id="filter-legislatura"
            value={filters.legislaturaId ?? ""}
            onChange={(e) => handleLegislaturaChange(e.target.value)}
            className={FIELD_CLASS}
          >
            {!legislaturaIds && <option value="">Todas as legislaturas</option>}
            {legislaturas.map((l) => (
              <option key={l.id} value={l.id}>
                {l.id}ª ({l.dataInicio.slice(0, 4)}–
                {l.dataFim?.slice(0, 4) ?? "atual"})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-tipo" className={LABEL_CLASS}>
            Tipo de Despesa
          </label>
          <select
            id="filter-tipo"
            value={filters.tipoDespesaId ?? ""}
            onChange={(e) =>
              setFilter(
                "tipoDespesaId",
                e.target.value ? Number(e.target.value) : undefined,
              )
            }
            className={FIELD_CLASS}
          >
            <option value="">Todos os tipos</option>
            {tipos.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-fornecedor" className={LABEL_CLASS}>
            Fornecedor (Nome ou CNPJ)
          </label>
          <input
            id="filter-fornecedor"
            type="text"
            placeholder="Ex: LATAM, Enel, Posto..."
            value={filters.fornecedor}
            onChange={(e) => setFilter("fornecedor", e.target.value)}
            className={FIELD_CLASS}
          />
        </div>

        <div>
          <label htmlFor="filter-de" className={LABEL_CLASS}>
            De (mês)
          </label>
          <input
            id="filter-de"
            type="month"
            value={filters.fromMonth}
            max={filters.toMonth || undefined}
            onChange={(e) => setFilter("fromMonth", e.target.value)}
            className={FIELD_CLASS}
          />
        </div>

        <div>
          <label htmlFor="filter-ate" className={LABEL_CLASS}>
            Até (mês)
          </label>
          <input
            id="filter-ate"
            type="month"
            value={filters.toMonth}
            min={filters.fromMonth || undefined}
            onChange={(e) => setFilter("toMonth", e.target.value)}
            className={FIELD_CLASS}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle pt-3 text-xs">
        <div className="flex items-center gap-2">
          <label htmlFor="despesas-sort" className="text-text-muted">
            Ordenar por:
          </label>
          <select
            id="despesas-sort"
            value={filters.ordenarPor}
            onChange={(e) =>
              setFilter(
                "ordenarPor",
                e.target.value as IDespesasFilters["ordenarPor"],
              )
            }
            className="rounded border border-border bg-surface px-2 py-1 text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            <option value="dataDocumento">Data do documento</option>
            <option value="valorLiquido">Valor líquido</option>
            <option value="valorDocumento">Valor bruto</option>
          </select>

          <button
            type="button"
            onClick={() =>
              setFilter("ordem", filters.ordem === "asc" ? "desc" : "asc")
            }
            aria-label={`Ordenação ${filters.ordem === "asc" ? "crescente" : "decrescente"}. Alternar direção`}
            aria-pressed={filters.ordem === "asc"}
            className="rounded border border-border bg-surface px-2 py-1 text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            {filters.ordem === "asc" ? "Crescente ↑" : "Decrescente ↓"}
          </button>
        </div>

        {activeFiltersCount > 0 && (
          <div className="flex justify-end border-t border-border-subtle pt-3 text-xs">
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1 rounded font-medium text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Limpar {activeFiltersCount} filtros ativos</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
