"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { formatCurrency } from "@/app/lib/formartters.lib";
import type { DashboardMetrics } from "@/server/schemas/dashboard.schema";

interface IExpenseDistributionChartProps {
  data: DashboardMetrics["distribuicaoPorTipo"];
}

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
];

export const ExpenseDistributionChart = ({
  data,
}: IExpenseDistributionChartProps) => {
  const categories =
    data.length > 6
      ? [
          ...data.slice(0, 5),
          {
            tipoDespesaId: 0,
            tipoDespesa: `Outras categorias (${data.length - 5})`,
            totalLiquido: data
              .slice(5)
              .reduce((total, category) => total + category.totalLiquido, 0),
            totalRegistros: data
              .slice(5)
              .reduce((total, category) => total + category.totalRegistros, 0),
          },
        ]
      : data;

  return (
    <section
      aria-labelledby="expense-distribution-title"
      className="min-w-0 rounded-xl border border-border bg-surface p-5"
    >
      <div className="mb-2">
        <h2
          id="expense-distribution-title"
          className="text-sm font-semibold text-text"
        >
          Despesas por categoria
        </h2>
        <p className="mt-1 text-xs text-text-muted">
          Distribuição do valor líquido registrado
        </p>
      </div>

      <div className="grid items-center gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div
          role="img"
          aria-label="Gráfico de rosca da distribuição de despesas por categoria"
          className="h-56 min-w-0"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categories}
                dataKey="totalLiquido"
                nameKey="tipoDespesa"
                innerRadius="58%"
                outerRadius="82%"
                paddingAngle={2}
                stroke="var(--color-surface)"
                strokeWidth={2}
              >
                {categories.map((category, index) => (
                  <Cell
                    key={category.tipoDespesaId}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [
                  formatCurrency(Number(value)),
                  "Valor líquido",
                ]}
                contentStyle={{
                  borderColor: "var(--color-border)",
                  borderRadius: "0.5rem",
                  backgroundColor: "var(--color-surface)",
                  color: "var(--color-text)",
                  fontSize: "0.75rem",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <ul className="space-y-2">
          {categories.map((category, index) => (
            <li
              key={category.tipoDespesaId}
              className="flex min-w-0 items-start gap-2 text-xs"
            >
              <span
                aria-hidden="true"
                className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
                style={{
                  backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
                }}
              />
              <span className="min-w-0 flex-1 truncate text-text">
                {category.tipoDespesa}
              </span>
              <span className="shrink-0 font-mono text-text-muted tabular-nums">
                {formatCurrency(category.totalLiquido)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
