"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  formatCompetencia,
  formatCompactCurrency,
  formatInteger,
} from "@/app/lib/formartters.lib";
import type { DashboardMetrics } from "@/server/schemas/dashboard.schema";

interface IMonthlyEvolutionChartProps {
  data: DashboardMetrics["evolucaoMensal"];
  fromMonth: string;
  toMonth?: string;
}

const MAX_FILLED_MONTHS = 240;

export const MonthlyEvolutionChart = ({
  data,
  fromMonth,
  toMonth,
}: IMonthlyEvolutionChartProps) => {
  const monthIndex = (value: string): number => {
    const [year, month] = value.split("-").map(Number);
    return year * 12 + month - 1;
  };
  const firstMonth = monthIndex(fromMonth);
  const lastMonth = toMonth
    ? monthIndex(toMonth)
    : data.reduce(
        (latest, point) => Math.max(latest, point.ano * 12 + point.mes - 1),
        firstMonth,
      );
  const monthsInRange = lastMonth - firstMonth + 1;
  const monthlyData = new Map(
    data.map((point) => [point.ano * 12 + point.mes - 1, point]),
  );
  const points =
    monthsInRange > 0 && monthsInRange <= MAX_FILLED_MONTHS
      ? Array.from({ length: monthsInRange }, (_, index) => {
          const currentMonth = firstMonth + index;
          const year = Math.floor(currentMonth / 12);
          const month = (currentMonth % 12) + 1;
          return (
            monthlyData.get(currentMonth) ?? {
              ano: year,
              mes: month,
              totalLiquido: 0,
              totalRegistros: 0,
            }
          );
        })
      : data;
  const chartData = points.map((point) => ({
    ...point,
    competencia: formatCompetencia(point.ano, point.mes),
  }));

  return (
    <section
      aria-labelledby="monthly-evolution-title"
      className="min-w-0 rounded-xl border border-border bg-surface p-5"
    >
      <div className="mb-5">
        <h2
          id="monthly-evolution-title"
          className="text-sm font-semibold text-text"
        >
          Evolução mensal de despesas
        </h2>
        <p className="mt-1 text-xs text-text-muted">
          Valor líquido registrado por competência
        </p>
      </div>

      <div
        role="img"
        aria-label="Gráfico de linha da evolução mensal do valor líquido das despesas"
        className="h-72 w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 8, right: 12, bottom: 4, left: 8 }}
          >
            <CartesianGrid
              stroke="var(--color-border-subtle)"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              dataKey="competencia"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--color-text-muted)", fontSize: 11 }}
              minTickGap={20}
            />
            <YAxis
              width={104}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--color-text-muted)", fontSize: 9 }}
              tickFormatter={(value: number) => formatCompactCurrency(value)}
            />
            <Tooltip
              cursor={{ stroke: "var(--color-border)" }}
              formatter={(value, _name, item) => [
                formatCompactCurrency(Number(value)),
                `${formatInteger(Number(item.payload.totalRegistros))} documentos`,
              ]}
              labelFormatter={(label) => String(label)}
              contentStyle={{
                borderColor: "var(--color-border)",
                borderRadius: "0.5rem",
                backgroundColor: "var(--color-surface)",
                color: "var(--color-text)",
                fontSize: "0.75rem",
              }}
            />
            <Line
              type="monotone"
              dataKey="totalLiquido"
              name="Valor líquido"
              stroke="var(--chart-1)"
              strokeWidth={3}
              dot={{ r: 3, fill: "var(--chart-1)" }}
              activeDot={{ r: 6 }}
              isAnimationActive
              animationBegin={0}
              animationDuration={1200}
              animationEasing="ease-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};
