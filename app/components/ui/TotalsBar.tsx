import { formatCurrency, formatInteger } from "@/app/lib/formartters.lib";

export interface ITotais {
    valorBruto: number;
    valorGlosa: number;
    valorLiquido: number;
    totalRegistros: number;
}

interface ITotalsBarProps {
    totais: ITotais;
    filtrosAtivosCount?: number;
    labelContexto?: string;
    /** Esmaece a barra enquanto os novos valores carregam. */
    dimmed?: boolean;
}

export const TotalsBar = ({
    totais,
    filtrosAtivosCount = 0,
    labelContexto = "Resultados filtrados",
    dimmed = false,
}: ITotalsBarProps) => {
    return (
        <section
            aria-label="Resumo de valores dos filtros ativos"
            className={`p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-subtle)] transition-opacity ${dimmed ? "opacity-60" : ""
                }`}
        >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <span className="text-xs font-semibold text-[var(--color-text)] tracking-tight">
                        {labelContexto}
                    </span>
                    <div className="text-xs text-[var(--color-text-muted)] mt-0.5">
                        <span className="font-mono tabular-nums font-medium text-[var(--color-text)]">
                            {formatInteger(totais.totalRegistros)}
                        </span>{" "}
                        registros contabilizados
                        {filtrosAtivosCount > 0 && ` · ${filtrosAtivosCount} filtros ativos`}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6 border-t md:border-t-0 border-[var(--color-border)] pt-3 md:pt-0">
                    <div>
                        <div className="text-[11px] font-medium text-[var(--color-text-muted)]">
                            Valor Bruto Declarado
                        </div>
                        <div className="text-base font-semibold font-mono tabular-nums text-[var(--color-text)]">
                            {formatCurrency(totais.valorBruto)}
                        </div>
                    </div>

                    <div>
                        <div className="text-[11px] font-medium text-[var(--color-text-muted)] flex items-center gap-1">
                            <span>Glosas / Descontos</span>
                            <span className="text-[10px] text-[var(--color-warning)] font-normal">(retido)</span>
                        </div>
                        <div className="text-base font-semibold font-mono tabular-nums text-[var(--color-warning)]">
                            {formatCurrency(totais.valorGlosa)}
                        </div>
                    </div>

                    <div>
                        <div className="text-[11px] font-medium text-[var(--color-primary)]">
                            Valor Líquido Ressarcido
                        </div>
                        <div className="text-lg font-bold font-mono tabular-nums text-[var(--color-primary)]">
                            {formatCurrency(totais.valorLiquido)}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};