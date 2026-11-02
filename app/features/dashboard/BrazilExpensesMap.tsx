"use client";

import BrazilMap from "@svg-maps/brazil";
import { useMemo, useState } from "react";

import {
  formatCompactCurrency,
  formatCurrency,
  formatInteger,
} from "@/app/lib/formartters.lib";
import type { DashboardMetrics } from "@/server/schemas/dashboard.schema";

interface IBrazilExpensesMapProps {
  data: DashboardMetrics["despesasPorUf"];
  totais: DashboardMetrics["totais"];
  despesasSemUf: DashboardMetrics["despesasSemUf"];
}

type MapMetric = "total" | "average";

interface IBrazilSvgLocation {
  id: string;
  name: string;
  path: string;
}

interface IBrazilSvgMap {
  viewBox: string;
  locations: IBrazilSvgLocation[];
}

const brazilMap: IBrazilSvgMap = BrazilMap;

const MAP_COLORS = ["#d1fae5", "#6ee7b7", "#34d399", "#10b981", "#047857"];

export const BrazilExpensesMap = ({
  data,
  totais,
  despesasSemUf,
}: IBrazilExpensesMapProps) => {
  const [selectedUf, setSelectedUf] = useState<string | null>(null);
  const [metric, setMetric] = useState<MapMetric>("total");

  const statesByUf = useMemo(
    () => new Map(data.map((state) => [state.siglaUf, state])),
    [data],
  );
  const metricValues = useMemo(
    () =>
      brazilMap.locations.map((location) => {
        const state = statesByUf.get(location.id.toUpperCase());
        if (!state) return 0;
        return metric === "total"
          ? state.totalLiquido
          : state.totalParlamentares > 0
            ? state.totalLiquido / state.totalParlamentares
            : 0;
      }),
    [metric, statesByUf],
  );
  const thresholds = useMemo(() => {
    const positiveValues = metricValues
      .filter((value) => value > 0)
      .sort((left, right) => left - right);

    return [1, 2, 3, 4].map(
      (quintile) =>
        positiveValues[
        Math.min(
          Math.ceil((positiveValues.length * quintile) / 5) - 1,
          positiveValues.length - 1,
        )
        ] ?? 0,
    );
  }, [metricValues]);

  const activeLocation = selectedUf
    ? brazilMap.locations.find(
      (location) => location.id.toUpperCase() === selectedUf,
    )
    : undefined;
  const activeState = selectedUf ? statesByUf.get(selectedUf) : undefined;
  const displayedTotalLiquido =
    activeState?.totalLiquido ?? totais.totalLiquido;
  const displayedDeputies =
    activeState?.totalParlamentares ?? totais.totalParlamentares;
  const displayedRecords = activeState?.totalRegistros ?? totais.totalRegistros;
  const averagePerDeputy =
    displayedDeputies > 0 ? displayedTotalLiquido / displayedDeputies : 0;
  const nationalPercentage =
    selectedUf && totais.totalLiquido > 0
      ? (displayedTotalLiquido / totais.totalLiquido) * 100
      : totais.totalLiquido > 0
        ? 100
        : 0;

  const stateColor = (uf: string): string => {
    const state = statesByUf.get(uf);
    if (!state) return "var(--color-surface-hover)";

    const value =
      metric === "total"
        ? state.totalLiquido
        : state.totalParlamentares > 0
          ? state.totalLiquido / state.totalParlamentares
          : 0;

    if (value <= 0) return "var(--color-surface-hover)";
    const colorIndex = thresholds.findIndex((threshold) => value <= threshold);
    return MAP_COLORS[colorIndex === -1 ? MAP_COLORS.length - 1 : colorIndex];
  };

  const selectState = (uf: string) => {
    setSelectedUf((currentUf) => (currentUf === uf ? null : uf));
  };

  return (
    <section
      aria-labelledby="brazil-expenses-map-title"
      className="space-y-5 rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6"
    >
      <header className="flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            id="brazil-expenses-map-title"
            className="text-lg font-black text-text"
          >
            Despesas parlamentares por estado
          </h2>
          <p className="mt-1 text-xs text-text-muted">
            Valores líquidos da legislatura vigente. Selecione um estado no mapa
            para consultar sua bancada; clique novamente nele para voltar ao
            Brasil inteiro.
          </p>
        </div>
        <div
          aria-label="Métrica de coloração do mapa"
          className="inline-flex w-fit rounded-lg border border-border bg-surface-hover/40 p-1"
        >
          <button
            type="button"
            aria-pressed={metric === "total"}
            onClick={() => setMetric("total")}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring ${metric === "total"
                ? "bg-primary text-white shadow-xs"
                : "text-text-muted hover:text-text"
              }`}
          >
            Total líquido
          </button>
          <button
            type="button"
            aria-pressed={metric === "average"}
            onClick={() => setMetric("average")}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring ${metric === "average"
                ? "bg-primary text-white shadow-xs"
                : "text-text-muted hover:text-text"
              }`}
          >
            Média por deputado
          </button>
        </div>
      </header>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.8fr)]">
        <div className="min-w-0 rounded-xl border border-border bg-surface p-3 sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-3 text-[11px] text-text-muted">
            <span>Menor valor</span>
            <div className="flex items-center gap-1" aria-hidden="true">
              {MAP_COLORS.map((color) => (
                <span
                  key={color}
                  className="h-3.5 w-5 rounded-sm border border-black/5"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <span>Maior valor</span>
          </div>

          <svg
            viewBox={brazilMap.viewBox}
            role="group"
            aria-label="Mapa interativo do Brasil. Use Tab para percorrer os estados e Enter para selecionar."
            className="mx-auto block max-h-[34rem] w-full overflow-visible"
          >
            <title>Despesas líquidas declaradas por estado</title>
            {brazilMap.locations.map((location) => {
              const uf = location.id.toUpperCase();
              const state = statesByUf.get(uf);
              const isSelected = selectedUf === uf;
              const ariaLabel = [
                `${location.name} (${uf})`,
                `total líquido ${formatCurrency(state?.totalLiquido ?? 0)}`,
                `${formatInteger(state?.totalParlamentares ?? 0)} deputados`,
                `${formatInteger(state?.totalRegistros ?? 0)} documentos`,
              ].join(", ");

              return (
                <path
                  key={location.id}
                  d={location.path}
                  role="button"
                  tabIndex={0}
                  aria-label={ariaLabel}
                  aria-pressed={isSelected}
                  fill={stateColor(uf)}
                  stroke={
                    isSelected ? "var(--color-primary)" : "var(--color-border)"
                  }
                  strokeWidth={isSelected ? 3 : 1.4}
                  strokeLinejoin="round"
                  className="cursor-pointer transition-colors outline-none focus-visible:stroke-[var(--color-focus-ring)] focus-visible:stroke-[3]"
                  onClick={() => selectState(uf)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      selectState(uf);
                    }
                  }}
                >
                  <title>{ariaLabel}</title>
                </path>
              );
            })}
          </svg>
          <p className="mt-2 text-center text-[10px] text-text-subtle">
            Geometria:{" "}
            <a
              href="https://github.com/VictorCazanave/svg-maps/tree/master/packages/brazil"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-text"
            >
              @svg-maps/brazil
            </a>{" "}
            (CC BY 4.0), baseada em mapa da{" "}
            <a
              href="https://mapsvg.com/maps/brazil"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-text"
            >
              MapSVG
            </a>
            .
          </p>
        </div>

        <aside
          aria-live="polite"
          aria-label={`Indicadores de ${activeLocation?.name ?? "todo o Brasil"}`}
          className="space-y-4 rounded-xl border border-border bg-surface-hover/30 p-5"
        >
          <header className="flex items-start justify-between gap-3 border-b border-border pb-4">
            <div>
              <span className="text-xs font-semibold text-text-muted">
                {activeLocation ? "Estado selecionado" : "Visão nacional"}
              </span>
              <h3 className="mt-1 text-2xl font-black text-text">
                {activeLocation ? (
                  <>
                    {activeLocation.name}{" "}
                  </>
                ) : (
                  "Brasil inteiro"
                )}
              </h3>
            </div>
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary text-lg font-black text-white">
              {selectedUf ?? "BR"}
            </span>
          </header>

          <div className="grid grid-cols-2 gap-3">
            <MetricCard
              label="Total líquido declarado"
              value={formatCompactCurrency(displayedTotalLiquido)}
              exactValue={formatCurrency(displayedTotalLiquido)}
            />
            <MetricCard
              label="Média por deputado"
              value={formatCompactCurrency(averagePerDeputy)}
              exactValue={formatCurrency(averagePerDeputy)}
            />
            <MetricCard
              label="Deputados na bancada"
              value={formatInteger(displayedDeputies)}
            />
            <MetricCard
              label="Documentos de despesa"
              value={formatInteger(displayedRecords)}
            />
          </div>

          <p className="text-[11px] leading-relaxed text-text-muted">
            Este estado representa{" "}
            {nationalPercentage.toLocaleString("pt-BR", {
              maximumFractionDigits: 1,
            })}
            % do total líquido declarado no país.
          </p>

          {selectedUf && despesasSemUf.totalRegistros > 0 && (
            <p className="border-t border-border pt-3 text-[11px] leading-relaxed text-text-muted">
              {formatInteger(despesasSemUf.totalRegistros)} documentos (
              {formatCompactCurrency(despesasSemUf.totalLiquido)}) não têm UF
              identificada e não são atribuídos a nenhum estado no mapa.
            </p>
          )}
        </aside>
      </div>
    </section>
  );
};

interface IMetricCardProps {
  label: string;
  value: string;
  exactValue?: string;
}

const MetricCard = ({ label, value, exactValue }: IMetricCardProps) => (
  <div className="min-w-0 rounded-lg border border-border bg-surface p-3">
    <span className="block text-[10px] font-medium text-text-muted">
      {label}
    </span>
    <span
      title={exactValue}
      className="mt-1 block truncate font-mono text-sm font-bold text-text tabular-nums sm:text-base"
    >
      {value}
    </span>
  </div>
);
