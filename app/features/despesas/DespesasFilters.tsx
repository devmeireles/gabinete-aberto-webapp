"use client";

import { RotateCcw } from "lucide-react";

import {
    useDespesasFilters,
    useDespesasFiltersActions,
    type IDespesasFilters,
} from "@/app/contexts/despesas-filters.context";
import { useLegislaturas } from "@/app/hooks/use-legislaturas";
import { useTiposDespesa } from "@/app/hooks/use-tipos-despesa";

const FIELD_CLASS: string =
    "w-full px-2.5 py-1.5 rounded border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)] focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-focus-ring)]";
const LABEL_CLASS: string = "block text-[11px] font-medium text-[var(--color-text-muted)] mb-1";

interface IDespesasFiltersProps {
    /** Restringe as legislaturas oferecidas (ex.: só as do deputado). */
    legislaturaIds?: number[];
}

export const DespesasFilters = ({ legislaturaIds }: IDespesasFiltersProps) => {
    const filters: IDespesasFilters = useDespesasFilters();
    const { setFilter, reset } = useDespesasFiltersActions();
    const { data: todasLegislaturas = [] } = useLegislaturas();
    const { data: tipos = [] } = useTiposDespesa();

    const legislaturas = legislaturaIds
        ? todasLegislaturas.filter((l) => legislaturaIds.includes(l.id))
        : todasLegislaturas;

    // legislaturaId e deputadoId não contam: um é obrigatório, o outro é fixo.
    const activeFiltersCount: number = [
        filters.tipoDespesaId,
        filters.fornecedor.trim(),
        filters.fromMonth,
        filters.toMonth,
    ].filter(Boolean).length;

    // O intervalo de meses de uma legislatura não vale para outra: limpa junto.
    const handleLegislaturaChange = (legislaturaId: number): void => {
        setFilter("legislaturaId", legislaturaId);
        setFilter("fromMonth", "");
        setFilter("toMonth", "");
    };

    return (
        <div className="p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] space-y-4">
            {/* Filtros sem dado no list (busca textual, deputado, partido, UF): ver versão anterior, seguem comentados. */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
                <div>
                    <label htmlFor="filter-legislatura" className={LABEL_CLASS}>
                        Legislatura
                    </label>
                    <select
                        id="filter-legislatura"
                        value={filters.legislaturaId}
                        onChange={(e) => handleLegislaturaChange(Number(e.target.value))}
                        className={FIELD_CLASS}
                    >
                        {legislaturas.map((l) => (
                            <option key={l.id} value={l.id}>
                                {l.id}ª ({l.dataInicio.slice(0, 4)}–{l.dataFim.slice(0, 4)})
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
                            setFilter("tipoDespesaId", e.target.value ? Number(e.target.value) : undefined)
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

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--color-border-subtle)] text-xs">
                <div className="flex items-center gap-2">
                    <span className="text-[var(--color-text-muted)]">Ordenar por:</span>
                    <select
                        value={filters.ordenarPor}
                        onChange={(e) =>
                            setFilter("ordenarPor", e.target.value as IDespesasFilters["ordenarPor"])
                        }
                        className="px-2 py-1 rounded border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)]"
                    >
                        <option value="dataDocumento">Data do documento</option>
                        <option value="valorLiquido">Valor líquido</option>
                        <option value="valorDocumento">Valor bruto</option>
                    </select>

                    <button
                        type="button"
                        onClick={() => setFilter("ordem", filters.ordem === "asc" ? "desc" : "asc")}
                        className="px-2 py-1 rounded border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)]"
                        title="Alternar direção da ordenação"
                    >
                        {filters.ordem === "asc" ? "Crescente ↑" : "Decrescente ↓"}
                    </button>
                </div>

                {activeFiltersCount > 0 && (
                    <div className="flex justify-end pt-3 border-t border-border-subtle text-xs">
                        <button
                            type="button"
                            onClick={reset}
                            className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
                        >
                            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Limpar {activeFiltersCount} filtros ativos</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};