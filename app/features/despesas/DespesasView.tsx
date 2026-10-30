"use client";

import React from "react";
import Link from "next/link";
import {
    RotateCcw,
    ExternalLink,
    // Search,     // busca textual (comentada)
    // Download,   // export CSV (comentado)
    // Plane,      // bilhetes aéreos (comentado)
} from "lucide-react";

import {
    useDespesasFilters,
    useDespesasFiltersActions,
    type IDespesasFilters,
} from "@/app/contexts/despesas-filters.context";
import { useDespesas } from "@/app/hooks/use-despesas";
import { useLegislaturas } from "@/app/hooks/use-legislaturas";
import { useTiposDespesa } from "@/app/hooks/use-tipos-despesa";
import { formatDate } from "@/app/lib/formartters.lib";
// Ajuste os caminhos abaixo para onde seus componentes de UI estão:
import { EmptyState } from "@/app/components/ui/EmptyState";
import { Pagination } from "@/app/components/ui/Pagination";
// import { EmPerspectiva } from "@/app/components/ui/EmPerspectiva";
// import { Pagination } from "@/app/components/ui/Pagination";
// import { TotalsBar } from "@/app/components/ui/TotalsBar";          // precisa de valorBruto/valorGlosa agregados
// import { FlightBadge } from "@/app/components/ui/FlightBadge";      // sem bilhete aéreo no list
// import { PainelVoo } from "@/app/features/flights/PainelVoo";       // sem endpoint de voos
// import { DeputyProfileModal } from "...";                           // substituído por link para /deputados/[id]

const brl: Intl.NumberFormat = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const formatCurrency = (value: number): string => brl.format(value);

const SELECT_CLASS: string =
    "w-full px-2.5 py-1.5 rounded border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-focus-ring)]";
const LABEL_CLASS: string = "block text-[11px] font-medium text-[var(--color-text-muted)] mb-1";

export const DespesasView = () => {
    const filters: IDespesasFilters = useDespesasFilters();
    const { setFilter, setPagina, reset } = useDespesasFiltersActions();

    const { data, isPending, isError, isPlaceholderData } = useDespesas();
    const { data: legislaturas = [] } = useLegislaturas();
    const { data: tipos = [] } = useTiposDespesa();

    // const [mostrarPainelVoos, setMostrarPainelVoos] = useState<boolean>(false);   // sem dados de voo
    // const [selectedDeputyModalId, setSelectedDeputyModalId] = useState<number | null>(null); // virou <Link>

    // legislaturaId não conta: é obrigatório e sempre preenchido.
    // deputadoId também não: não há seletor na tela (veio de initialFilters, se veio).
    const activeFiltersCount: number = [
        filters.tipoDespesaId,
        filters.fornecedor.trim(),
        filters.fromMonth,
        filters.toMonth,
    ].filter(Boolean).length;

    // Competência para o EmPerspectiva: usa o início do intervalo (ou o padrão do exemplo).
    const [competenciaAno, competenciaMes] = (filters.fromMonth || "2026-01").split("-").map(Number);

    // const handleExportCsv = () => { ... };  // falta o Route Handler /api/despesas/export

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            {/* Title & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-[var(--color-border)] pb-5">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text)] tracking-tight">
                        Despesas da Cota Parlamentar (CEAP)
                    </h1>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                        Consulta auditável com discriminação de valor bruto declarado, glosas retidas e valor líquido ressarcido.
                    </p>
                </div>

                {/* Ações: Painel de Voos e Exportar CSV comentados (sem dados / sem endpoint)
                <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto shrink-0">
                    <button type="button" onClick={() => setMostrarPainelVoos(!mostrarPainelVoos)} ...>
                        <Plane className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Painel de Voos</span>
                    </button>
                    <button type="button" onClick={handleExportCsv} ...>
                        <Download className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Exportar (CSV)</span>
                    </button>
                </div>
                */}
            </div>

            {/* Filter Toolbar */}
            <div className="p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] space-y-4">
                {/* Row 1: Legislatura (novo, obrigatório no nosso input) + filtros sem dado */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    <div>
                        <label htmlFor="filter-legislatura" className={LABEL_CLASS}>
                            Legislatura
                        </label>
                        <select
                            id="filter-legislatura"
                            value={filters.legislaturaId}
                            onChange={(e) => setFilter("legislaturaId", Number(e.target.value))}
                            className={SELECT_CLASS}
                        >
                            {legislaturas.map((l) => (
                                <option key={l.id} value={l.id}>
                                    {l.id}ª legislatura
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Busca textual: o list não tem parâmetro `q` (só `fornecedor`)
                    <div>
                        <label htmlFor="search-despesas" className={LABEL_CLASS}>Busca textual</label>
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-subtle)]" aria-hidden="true" />
                            <input id="search-despesas" type="text" placeholder="Deputado, fornecedor, número..." ... />
                        </div>
                    </div>
                    */}

                    {/* Deputado: precisa de um procedure leve (id + nome) para popular o select/combobox
                    <div>
                        <label htmlFor="filter-deputado" className={LABEL_CLASS}>Deputado</label>
                        <select id="filter-deputado" value={filters.deputadoId ?? ""} ...>
                            <option value="">Todos os deputados</option>
                            {deputados.map((d) => (<option key={d.id} value={d.id}>{d.nome} ({d.siglaPartido}/{d.siglaUf})</option>))}
                        </select>
                    </div>
                    */}

                    {/* Partido: o list não filtra por partido
                    <div> <label htmlFor="filter-partido" ...>Partido</label> <select ...> ... </select> </div>
                    */}

                    {/* UF: o list não filtra por UF
                    <div> <label htmlFor="filter-uf" ...>UF do Parlamentar</label> <select ...> ... </select> </div>
                    */}
                </div>

                {/* Row 2: Tipo, Fornecedor, De, Até */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs pt-1">
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
                            className={SELECT_CLASS}
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
                            className={SELECT_CLASS}
                        />
                    </div>

                    {/* Ano + Mês viraram um intervalo (De / Até), que é o que o servidor aceita */}
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
                            className={SELECT_CLASS}
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
                            className={SELECT_CLASS}
                        />
                    </div>
                </div>

                {/* Row 3: Sort + Clear Filters */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--color-border-subtle)] text-xs">
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Somente com bilhete aéreo: sem esse dado no list
                        <label className="inline-flex items-center gap-1.5 ...">
                            <input type="checkbox" checked={somenteComBilhete} ... />
                            <Plane ... /> <span>Somente despesas com bilhetes aéreos</span>
                        </label>
                        */}

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
                                {/* <option value="valorGlosa">Valor glosa</option>  → não está no enum do servidor */}
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
                    </div>

                    {activeFiltersCount > 0 && (
                        <button
                            type="button"
                            onClick={reset}
                            className="inline-flex items-center gap-1 text-[var(--color-primary)] hover:underline font-medium"
                        >
                            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Limpar {activeFiltersCount} filtros ativos</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Em Perspectiva: usa o líquido total do filtro; competência = início do intervalo */}
            {/* {data && data.totalLiquido > 0 && (
                <EmPerspectiva
                    valor={data.totalLiquido}
                    competencia={{ ano: competenciaAno, mes: competenciaMes }}
                    entidadeNome="Total Filtrado"
                />
            )} */}

            {/* TotalsBar: precisa de valorBruto, valorGlosa e totalRegistros; o list só devolve totalLiquido e total
            <TotalsBar
                totais={{ valorBruto, valorGlosa, valorLiquido: data.totalLiquido, totalRegistros: data.total }}
                filtrosAtivosCount={activeFiltersCount}
                labelContexto="Total das despesas filtradas"
            />
            */}

            {/* Painel de Voos: sem dados
            {(mostrarPainelVoos || filters.tipoDespesaId === 1 || somenteComBilhete) && (
                <PainelVoo deputadoId={filters.deputadoId} ano={...} mes={...} onClose={() => setMostrarPainelVoos(false)} />
            )}
            */}

            {/* Table Results */}
            {isPending ? (
                <p className="text-sm text-[var(--color-text-muted)]" aria-busy="true">
                    Carregando despesas...
                </p>
            ) : isError || !data ? (
                <p className="text-sm text-[var(--color-warning)]">Não foi possível carregar as despesas.</p>
            ) : data.items.length === 0 ? (
                <EmptyState
                    title="Nenhuma despesa localizada"
                    description="Nenhuma despesa coincide com os filtros aplicados. Tente ajustar os parâmetros ou restaurar a busca."
                    onResetFilters={reset}
                />
            ) : (
                <div
                    className={`rounded-lg border border-[var(--color-border)] overflow-x-auto bg-[var(--color-surface)] shadow-xs ${isPlaceholderData ? "opacity-60" : ""
                        }`}
                >
                    <table className="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)] font-semibold">
                                <th className="py-3 px-3">Data</th>
                                <th className="py-3 px-3">Parlamentar</th>
                                <th className="py-3 px-3">Tipo de Despesa</th>
                                <th className="py-3 px-3">Fornecedor</th>
                                <th className="py-3 px-3 text-right">Valor Bruto</th>
                                <th className="py-3 px-3 text-right">Valor Líquido</th>
                                <th className="py-3 px-3 text-center">Origem</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-border-subtle)] font-mono tabular-nums">
                            {data.items.map((item) => (
                                <tr key={item.id} className="hover:bg-[var(--color-surface-hover)]">
                                    <td className="py-3 px-3 whitespace-nowrap text-[var(--color-text)]">
                                        {item.dataDocumento ? formatDate(item.dataDocumento) : "—"}
                                    </td>

                                    <td className="py-3 px-3 font-sans">
                                        <Link
                                            href={`/deputados/${item.deputadoId}`}
                                            className="font-semibold text-[var(--color-text)] hover:text-[var(--color-primary)] text-left hover:underline block truncate max-w-[160px]"
                                            title={`Ver perfil de ${item.deputadoNome}`}
                                        >
                                            {item.deputadoNome}
                                        </Link>
                                        {/* Partido · UF: não vêm no item da listagem
                                        <div className="text-[11px] text-[var(--color-text-muted)]">
                                            {item.partidoSigla} · {item.uf}
                                        </div>
                                        */}
                                    </td>

                                    <td className="py-3 px-3 font-sans max-w-xs text-[var(--color-text)]">
                                        <div className="truncate font-medium" title={item.tipoDespesa}>
                                            {item.tipoDespesa}
                                        </div>
                                        {/* Bilhete aéreo: sem dado no list
                                        {item.bilheteAereo && (
                                            <div className="mt-1"><FlightBadge bilhete={item.bilheteAereo} /></div>
                                        )}
                                        */}
                                    </td>

                                    <td className="py-3 px-3 font-sans max-w-xs text-[var(--color-text)]">
                                        <div className="truncate font-medium text-[var(--color-text)]" title={item.fornecedorNome}>
                                            {item.fornecedorNome}
                                        </div>
                                        <div className="text-[10px] text-[var(--color-text-subtle)] font-mono">
                                            {item.fornecedorCnpjCpf}
                                        </div>
                                    </td>

                                    <td className="py-3 px-3 text-right text-[var(--color-text-muted)] whitespace-nowrap">
                                        {formatCurrency(item.valorDocumento)}
                                    </td>

                                    <td className="py-3 px-3 text-right font-bold text-[var(--color-primary)] whitespace-nowrap">
                                        {formatCurrency(item.valorLiquido)}
                                    </td>

                                    <td className="py-3 px-3 text-center font-sans">
                                        {item.urlDocumento ? (
                                            <a
                                                href={item.urlDocumento}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-[11px] text-[var(--color-link)] hover:text-[var(--color-link-hover)] hover:underline"
                                                title="Abre comprovante fiscal oficial em nova aba (origem externa)"
                                            >
                                                <span>Nota</span>
                                                <ExternalLink className="w-3 h-3" aria-hidden="true" />
                                            </a>
                                        ) : (
                                            <span className="text-[10px] text-[var(--color-text-subtle)]">—</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {data && (
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
            )}

            {/* Modal do deputado: substituído pelo link para /deputados/[id]
            {selectedDeputyModalId && (
                <DeputyProfileModal deputadoId={selectedDeputyModalId} onClose={() => setSelectedDeputyModalId(null)} />
            )}
            */}
        </div>
    );
};