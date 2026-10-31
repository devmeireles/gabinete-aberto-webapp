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
      className={`rounded-lg border border-border bg-surface-subtle p-4 transition-opacity ${
        dimmed ? "opacity-60" : ""
      }`}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <span className="text-xs font-semibold tracking-tight text-text">
            {labelContexto}
          </span>
          <div className="mt-0.5 text-xs text-text-muted">
            <span className="font-mono font-medium text-text tabular-nums">
              {formatInteger(totais.totalRegistros)}
            </span>{" "}
            registros contabilizados
            {filtrosAtivosCount > 0 &&
              ` · ${filtrosAtivosCount} filtros ativos`}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 border-t border-border pt-3 sm:grid-cols-3 md:gap-6 md:border-t-0 md:pt-0">
          <div>
            <div className="text-[11px] font-medium text-text-muted">
              Valor Bruto Declarado
            </div>
            <div className="font-mono text-base font-semibold text-text tabular-nums">
              {formatCurrency(totais.valorBruto)}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1 text-[11px] font-medium text-text-muted">
              <span>Glosas / Descontos</span>
              <span className="text-[10px] font-normal text-warning">
                (retido)
              </span>
            </div>
            <div className="font-mono text-base font-semibold text-warning tabular-nums">
              {formatCurrency(totais.valorGlosa)}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-medium text-primary">
              Valor Líquido Ressarcido
            </div>
            <div className="font-mono text-lg font-bold text-primary tabular-nums">
              {formatCurrency(totais.valorLiquido)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
