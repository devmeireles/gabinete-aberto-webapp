"use client";

import { RotateCcw } from "lucide-react";

import {
    useDeputadosFilters,
    useDeputadosFiltersActions,
    type IDeputadosFilters,
} from "@/app/contexts/deputados-filters.context";
import { useDeputadosFiltroOpcoes } from "@/app/hooks/use-deputados-filtro-opcoes";
import { useLegislaturas } from "@/app/hooks/use-legislaturas";

const FIELD_CLASS: string =
    "w-full px-2.5 py-1.5 rounded border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)] focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-focus-ring)]";
const LABEL_CLASS: string = "block text-[11px] font-medium text-[var(--color-text-muted)] mb-1";

const EMPTY_OPCOES = {
    siglasUf: [],
    siglasPartido: [],
    situacoes: [],
    condicoesEleitorais: [],
    escolaridades: [],
    ufsNascimento: [],
};

interface ISelectFieldProps {
    id: string;
    label: string;
    value: string;
    options: string[];
    allLabel: string;
    onChange: (value: string) => void;
}

const SelectField = ({ id, label, value, options, allLabel, onChange }: ISelectFieldProps) => (
    <div>
        <label htmlFor={id} className={LABEL_CLASS}>
            {label}
        </label>
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={FIELD_CLASS}>
            <option value="">{allLabel}</option>
            {options.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    </div>
);

export const DeputadosFilters = () => {
    const filters: IDeputadosFilters = useDeputadosFilters();
    const { setFilter, reset } = useDeputadosFiltersActions();
    const { data: opcoes = EMPTY_OPCOES } = useDeputadosFiltroOpcoes();
    const { data: legislaturas = [] } = useLegislaturas();

    // ordenarPor/ordem/itens não contam como filtro.
    const activeFiltersCount: number = [
        filters.nome.trim(),
        filters.legislaturaId,
        filters.siglaUf,
        filters.siglaPartido,
        filters.siglaSexo,
        filters.situacao,
        filters.condicaoEleitoral,
        filters.escolaridade,
        filters.ufNascimento,
        filters.municipioNascimento.trim(),
        filters.anoNascimentoDe,
        filters.anoNascimentoAte,
    ].filter(Boolean).length;

    return (
        <div className="p-4 rounded-lg border border-border bg-surface space-y-4">
            {/* Row 1: Nome, Legislatura, UF, Partido */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div>
                    <label htmlFor="filter-nome" className={LABEL_CLASS}>
                        Nome
                    </label>
                    <input
                        id="filter-nome"
                        type="text"
                        placeholder="Nome parlamentar, civil ou eleitoral"
                        value={filters.nome}
                        onChange={(e) => setFilter("nome", e.target.value)}
                        className={FIELD_CLASS}
                    />
                </div>

                <div>
                    <label htmlFor="filter-legislatura" className={LABEL_CLASS}>
                        Legislatura
                    </label>
                    <select
                        id="filter-legislatura"
                        value={filters.legislaturaId ?? ""}
                        onChange={(e) =>
                            setFilter("legislaturaId", e.target.value ? Number(e.target.value) : undefined)
                        }
                        className={FIELD_CLASS}
                    >
                        <option value="">Todas as legislaturas</option>
                        {legislaturas.map((l) => (
                            <option key={l.id} value={l.id}>
                                {l.id}ª legislatura
                            </option>
                        ))}
                    </select>
                </div>

                <SelectField
                    id="filter-uf"
                    label="UF"
                    value={filters.siglaUf}
                    options={opcoes.siglasUf}
                    allLabel="Todas as UFs"
                    onChange={(value) => setFilter("siglaUf", value)}
                />

                <SelectField
                    id="filter-partido"
                    label="Partido"
                    value={filters.siglaPartido}
                    options={opcoes.siglasPartido}
                    allLabel="Todos os partidos"
                    onChange={(value) => setFilter("siglaPartido", value)}
                />
            </div>

            {/* Row 2: Situação, Condição eleitoral, Sexo, Escolaridade */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs pt-1">
                <SelectField
                    id="filter-situacao"
                    label="Situação"
                    value={filters.situacao}
                    options={opcoes.situacoes}
                    allLabel="Todas as situações"
                    onChange={(value) => setFilter("situacao", value)}
                />

                <SelectField
                    id="filter-condicao"
                    label="Condição eleitoral"
                    value={filters.condicaoEleitoral}
                    options={opcoes.condicoesEleitorais}
                    allLabel="Todas as condições"
                    onChange={(value) => setFilter("condicaoEleitoral", value)}
                />

                <div>
                    <label htmlFor="filter-sexo" className={LABEL_CLASS}>
                        Sexo
                    </label>
                    <select
                        id="filter-sexo"
                        value={filters.siglaSexo}
                        onChange={(e) => setFilter("siglaSexo", e.target.value as IDeputadosFilters["siglaSexo"])}
                        className={FIELD_CLASS}
                    >
                        <option value="">Todos</option>
                        <option value="F">Feminino</option>
                        <option value="M">Masculino</option>
                    </select>
                </div>

                <SelectField
                    id="filter-escolaridade"
                    label="Escolaridade"
                    value={filters.escolaridade}
                    options={opcoes.escolaridades}
                    allLabel="Todas as escolaridades"
                    onChange={(value) => setFilter("escolaridade", value)}
                />
            </div>

            {/* Row 3: Nascimento */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs pt-1">
                <SelectField
                    id="filter-uf-nascimento"
                    label="UF de nascimento"
                    value={filters.ufNascimento}
                    options={opcoes.ufsNascimento}
                    allLabel="Todas as UFs"
                    onChange={(value) => setFilter("ufNascimento", value)}
                />

                <div>
                    <label htmlFor="filter-municipio" className={LABEL_CLASS}>
                        Município de nascimento
                    </label>
                    <input
                        id="filter-municipio"
                        type="text"
                        placeholder="Ex: Ubatuba"
                        value={filters.municipioNascimento}
                        onChange={(e) => setFilter("municipioNascimento", e.target.value)}
                        className={FIELD_CLASS}
                    />
                </div>

                <div>
                    <label htmlFor="filter-ano-de" className={LABEL_CLASS}>
                        Nascido a partir de (ano)
                    </label>
                    <input
                        id="filter-ano-de"
                        type="text"
                        inputMode="numeric"
                        maxLength={4}
                        placeholder="1960"
                        value={filters.anoNascimentoDe}
                        onChange={(e) => setFilter("anoNascimentoDe", e.target.value.replace(/\D/g, ""))}
                        className={FIELD_CLASS}
                    />
                </div>

                <div>
                    <label htmlFor="filter-ano-ate" className={LABEL_CLASS}>
                        Nascido até (ano)
                    </label>
                    <input
                        id="filter-ano-ate"
                        type="text"
                        inputMode="numeric"
                        maxLength={4}
                        placeholder="1990"
                        value={filters.anoNascimentoAte}
                        onChange={(e) => setFilter("anoNascimentoAte", e.target.value.replace(/\D/g, ""))}
                        className={FIELD_CLASS}
                    />
                </div>
            </div>

            {/* Row 4: Sort + Clear */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border-subtle text-xs">
                <div className="flex items-center gap-2">
                    <span className="text-text-muted">Ordenar por:</span>
                    <select
                        value={filters.ordenarPor}
                        onChange={(e) =>
                            setFilter("ordenarPor", e.target.value as IDeputadosFilters["ordenarPor"])
                        }
                        className="px-2 py-1 rounded border border-border bg-surface text-text"
                    >
                        <option value="nome">Nome</option>
                        <option value="siglaPartido">Partido</option>
                        <option value="siglaUf">UF</option>
                        <option value="dataNascimento">Data de nascimento</option>
                    </select>

                    <button
                        type="button"
                        onClick={() => setFilter("ordem", filters.ordem === "asc" ? "desc" : "asc")}
                        className="px-2 py-1 rounded border border-border bg-surface text-text"
                        title="Alternar direção da ordenação"
                    >
                        {filters.ordem === "asc" ? "Crescente ↑" : "Decrescente ↓"}
                    </button>
                </div>

                {activeFiltersCount > 0 && (
                    <button
                        type="button"
                        onClick={reset}
                        className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
                    >
                        <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Limpar {activeFiltersCount} filtros ativos</span>
                    </button>
                )}
            </div>
        </div>
    );
};