"use client";

import {
  Ban,
  Banknote,
  FileText,
  Receipt,
  type LucideIcon,
} from "lucide-react";
// import { Compass, Plane } from "lucide-react"; // cards de voos (comentados abaixo)

import {
  useDespesasFilters,
  type IDespesasFilters,
} from "@/app/contexts/despesas-filters.context";
import { useDespesas } from "@/app/hooks/use-despesas";
import {
  formatCurrency,
  formatInteger,
  formatPercent,
} from "@/app/lib/formartters.lib";

const EMPTY_VALUE: string = "—";

interface IIndicatorCardProps {
  label: string;
  value: string;
  caption: string;
  icon: LucideIcon;
  dimmed: boolean;
}

const IndicatorCard = ({
  label,
  value,
  caption,
  icon: Icon,
  dimmed,
}: IIndicatorCardProps) => (
  <div
    className={`space-y-1 rounded-xl border border-border bg-surface p-4 shadow-2xs transition-opacity ${dimmed ? "opacity-60" : ""
      }`}
  >
    <div className="flex items-center justify-between text-xs font-medium text-text-muted">
      <span>{label}</span>
      <Icon
        className="h-4 w-4 text-primary"
        aria-hidden="true"
      />
    </div>
    <div className="font-mono text-2xl font-bold text-text">
      {value}
    </div>
    <div className="text-[11px] text-text-subtle">{caption}</div>
  </div>
);

export const DeputadoIndicadores = () => {
  const filters: IDespesasFilters = useDespesasFilters();
  const { data, isPending, isPlaceholderData } = useDespesas();

  const hasActiveFilters: boolean = Boolean(
    filters.tipoDespesaId ||
    filters.fornecedor.trim() ||
    filters.fromMonth ||
    filters.toMonth,
  );
  const scope: string = `${filters.legislaturaId}ª legislatura${hasActiveFilters ? " · filtros aplicados" : ""}`;

  const glosaRatio: number =
    data && data.totalBruto > 0 ? data.totalGlosa / data.totalBruto : 0;
  const dimmed: boolean = isPending || isPlaceholderData;

  return (
    <section
      aria-label="Indicadores financeiros do parlamentar"
      aria-busy={isPending}
      className="space-y-2"
    >
      <p className="text-[11px] text-text-subtle">
        Valores referentes a: {scope}
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <IndicatorCard
          label="Valor Líquido Ressarcido"
          value={data ? formatCurrency(data.totalLiquido) : EMPTY_VALUE}
          caption="Cota para Atividade Parlamentar (CEAP)"
          icon={Receipt}
          dimmed={dimmed}
        />

        <IndicatorCard
          label="Comprovantes Declarados"
          value={data ? formatInteger(data.total) : EMPTY_VALUE}
          caption="Notas fiscais e bilhetes auditáveis"
          icon={FileText}
          dimmed={dimmed}
        />

        <IndicatorCard
          label="Valor Bruto Declarado"
          value={data ? formatCurrency(data.totalBruto) : EMPTY_VALUE}
          caption="Antes das glosas"
          icon={Banknote}
          dimmed={dimmed}
        />

        <IndicatorCard
          label="Glosa Retida"
          value={data ? formatCurrency(data.totalGlosa) : EMPTY_VALUE}
          caption={
            data
              ? `${formatPercent(glosaRatio)} do valor bruto declarado`
              : "Valores não ressarcidos"
          }
          icon={Ban}
          dimmed={dimmed}
        />

        {/* Deslocamentos Aéreos e Tempo no Ar: sem coordenadas de aeroportos para calcular km/tempo.
                    Dá para contar bilhetes e somar o valor de passagens com o que já existe (bilhetes_aereos_csv),
                    mas distância e horas exigem uma tabela de aeroportos (IATA → lat/long) para a fórmula de Haversine.

                <IndicatorCard
                    label="Deslocamentos Aéreos"
                    value={resumoVoos ? `${resumoVoos.totalBilhetes} bilhetes` : "—"}
                    caption={resumoVoos ? `${resumoVoos.distanciaTotalKm.toLocaleString("pt-BR")} km voados` : "Cálculo geodésico Haversine"}
                    icon={Plane}
                    dimmed={dimmed}
                />
                <IndicatorCard
                    label="Tempo Estimado no Ar"
                    value={resumoVoos ? resumoVoos.tempoVooTotalFormatado : "—"}
                    caption={resumoVoos ? `Equivale a ${resumoVoos.voltasAoRedorDaTerra} voltas na Terra` : "Velocidade cruzeiro 800 km/h"}
                    icon={Compass}
                    dimmed={dimmed}
                />
                */}
      </div>
    </section>
  );
};
