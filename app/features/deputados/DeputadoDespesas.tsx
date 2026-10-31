"use client";

import { DespesasFiltersProvider } from "@/app/contexts/despesas-filters.context";
import { DespesasFilters } from "@/app/features/despesas/DespesasFilters";
import { DespesasResults } from "@/app/features/despesas/DespesasResults";
import { DeputadoIndicadores } from "./DeputadoIndicadores";

interface IDeputadoDespesasProps {
    deputadoId: number;
    /** Legislaturas em que o deputado atuou, da mais recente para a mais antiga. */
    legislaturaIds: number[];
}

export const DeputadoDespesas = ({ deputadoId, legislaturaIds }: IDeputadoDespesasProps) => {
    const [maisRecente] = legislaturaIds;
    if (maisRecente === undefined) return null;

    return (
        <DespesasFiltersProvider initialFilters={{ deputadoId, legislaturaId: maisRecente }}>
            <DeputadoDespesasContent legislaturaIds={legislaturaIds} />
        </DespesasFiltersProvider>
    );
};

interface IDeputadoDespesasContentProps {
    legislaturaIds: number[];
}

const DeputadoDespesasContent = ({ legislaturaIds }: IDeputadoDespesasContentProps) => {
    return (
        <section id="despesas" aria-labelledby="despesas-titulo" className="space-y-4">
            <h2 id="despesas-titulo" className="text-lg font-semibold text-text">
                Despesas da cota parlamentar
            </h2>

            <DeputadoIndicadores />
            <DespesasFilters legislaturaIds={legislaturaIds} />
            <DespesasResults showDeputado={false} />
        </section>
    );
};