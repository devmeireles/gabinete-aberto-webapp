"use client";

import { formatCurrency, formatInteger } from "@/app/lib/formartters.lib";
import type { DashboardMetrics } from "@/server/schemas/dashboard.schema";

interface IDashboardPartySummaryProps {
  data: DashboardMetrics["maioresGastosPartidos"];
}

export const DashboardPartySummary = ({
  data,
}: IDashboardPartySummaryProps) => {
  if (data.length === 0) return null;

  return (
    <section className="rounded-xl border border-border bg-surface p-5">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-text">
          Despesas por partido
        </h2>
        <p className="mt-1 text-xs text-text-muted">
          Valores líquidos atribuídos conforme a vigência partidária registrada
          na competência do documento. A média considera apenas parlamentares
          com despesas no período; registros sem vínculo partidário identificado
          não entram nesta classificação.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-border text-text-muted">
              <th scope="col" className="py-2 pr-4 font-semibold">
                Partido
              </th>
              <th scope="col" className="px-4 py-2 text-center font-semibold">
                Parlamentares
              </th>
              <th scope="col" className="px-4 py-2 text-right font-semibold">
                Média por parlamentar
              </th>
              <th scope="col" className="py-2 pl-4 text-right font-semibold">
                Total líquido
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle font-mono tabular-nums">
            {data.slice(0, 6).map((party) => (
              <tr key={party.partidoId} className="hover:bg-surface-hover">
                <th scope="row" className="py-3 pr-4 text-left font-sans">
                  <span className="block font-semibold text-text">
                    {party.sigla}
                  </span>
                  <span className="block max-w-xs truncate text-[11px] font-normal text-text-muted">
                    {party.nome}
                  </span>
                </th>
                <td className="px-4 py-3 text-center text-text">
                  {formatInteger(party.parlamentaresComDespesas)}
                </td>
                <td className="px-4 py-3 text-right text-text-muted">
                  {formatCurrency(
                    party.parlamentaresComDespesas > 0
                      ? party.totalLiquido / party.parlamentaresComDespesas
                      : 0,
                  )}
                </td>
                <td className="py-3 pl-4 text-right font-semibold text-text">
                  {formatCurrency(party.totalLiquido)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
