"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { DeputyAvatar } from "@/app/components/ui/DeputyAvatar";
import {
  formatCompactCurrency,
  formatCurrency,
  formatInteger,
} from "@/app/lib/formartters.lib";
import type { DashboardMetrics } from "@/server/schemas/dashboard.schema";

interface IDashboardConcentrationProps {
  partidos: DashboardMetrics["maioresGastosPartidos"];
  parlamentares: DashboardMetrics["maioresGastosParlamentares"];
  fornecedores: DashboardMetrics["maioresGastosFornecedores"];
}

type PartyMetric = "media" | "total";

export const DashboardConcentration = ({
  partidos,
  parlamentares,
  fornecedores,
}: IDashboardConcentrationProps) => {
  const [partyMetric, setPartyMetric] = useState<PartyMetric>("media");
  const sortedParties = useMemo(
    () =>
      [...partidos].sort((left, right) => {
        const leftValue =
          partyMetric === "media"
            ? left.totalLiquido / Math.max(left.parlamentaresComDespesas, 1)
            : left.totalLiquido;
        const rightValue =
          partyMetric === "media"
            ? right.totalLiquido / Math.max(right.parlamentaresComDespesas, 1)
            : right.totalLiquido;
        return rightValue - leftValue;
      }),
    [partidos, partyMetric],
  );
  const maxPartyValue = Math.max(
    ...sortedParties
      .slice(0, 6)
      .map((party) =>
        partyMetric === "media"
          ? party.totalLiquido / Math.max(party.parlamentaresComDespesas, 1)
          : party.totalLiquido,
      ),
    1,
  );
  const maxDeputyValue = parlamentares[0]?.totalLiquido ?? 1;
  const maxSupplierValue = fornecedores[0]?.totalLiquido ?? 1;

  if (
    partidos.length === 0 &&
    parlamentares.length === 0 &&
    fornecedores.length === 0
  ) {
    return null;
  }

  return (
    <section
      aria-label="Maiores despesas por parlamentar, partido e fornecedor"
      className="grid gap-6 lg:grid-cols-3"
    >
      <article className="min-w-0 rounded-xl border border-border bg-surface p-5">
        <header className="mb-4 border-b border-border-subtle pb-3">
          <h2 className="text-sm font-semibold text-text">
            Parlamentares com maiores despesas
          </h2>
          <p className="mt-1 text-xs text-text-muted">
            Maiores valores líquidos declarados
          </p>
        </header>
        {parlamentares.length > 0 ? (
          <ol className="space-y-3">
            {parlamentares.map((deputy, index) => {
              const ratio =
                (deputy.totalLiquido / Math.max(maxDeputyValue, 1)) * 100;

              return (
                <li key={deputy.deputadoId}>
                  <Link
                    href={`/deputados/${deputy.deputadoId}`}
                    className="group block rounded-lg p-2 transition-colors hover:bg-surface-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        aria-label={`Posição ${index + 1}`}
                        className="w-4 shrink-0 text-center text-xs font-bold text-text-muted tabular-nums"
                      >
                        {index + 1}
                      </span>
                      <DeputyAvatar
                        urlFoto={deputy.urlFoto}
                        nome={deputy.nome}
                        size="sm"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-xs font-semibold text-text group-hover:text-primary">
                          {deputy.nome}
                        </span>
                        <span className="block text-[10px] text-text-muted">
                          {[deputy.siglaPartido, deputy.siglaUf]
                            .filter(Boolean)
                            .join(" · ") || "Vínculo não informado"}
                        </span>
                      </span>
                      <span className="shrink-0 text-right">
                        <span
                          title={formatCurrency(deputy.totalLiquido)}
                          className="block font-mono text-xs font-bold text-text tabular-nums"
                        >
                          {formatCompactCurrency(deputy.totalLiquido)}
                        </span>
                        <span className="block text-[10px] text-text-muted">
                          {formatInteger(deputy.totalRegistros)} documentos
                        </span>
                      </span>
                    </div>
                    <div
                      aria-hidden="true"
                      className="mt-2 h-1 overflow-hidden rounded-full bg-border-subtle"
                    >
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{
                          width: `${Math.max(ratio, 0)}%`,
                        }}
                      />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>
        ) : (
          <p className="text-xs text-text-muted">
            Nenhum parlamentar com despesas no período.
          </p>
        )}
        <Link
          href="/deputados"
          className="mt-4 block border-t border-border-subtle pt-3 text-center text-xs font-semibold text-primary hover:underline"
        >
          Ver todos os parlamentares
        </Link>
      </article>

      <article className="min-w-0 rounded-xl border border-border bg-surface p-5">
        <header className="mb-4 flex items-start justify-between gap-3 border-b border-border-subtle pb-3">
          <div>
            <h2 className="text-sm font-semibold text-text">
              Despesas por partido
            </h2>
            <p className="mt-1 text-xs text-text-muted">
              {partyMetric === "media"
                ? "Média entre parlamentares com despesas"
                : "Valor líquido total atribuído ao partido"}
            </p>
          </div>
          <div
            aria-label="Métrica do comparativo por partido"
            className="inline-flex shrink-0 rounded-md border border-border bg-surface-hover/40 p-0.5"
          >
            {(["media", "total"] as const).map((metric) => (
              <button
                key={metric}
                type="button"
                aria-pressed={partyMetric === metric}
                onClick={() => setPartyMetric(metric)}
                className={`rounded px-2 py-1 text-[10px] font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring ${
                  partyMetric === metric
                    ? "bg-primary text-white"
                    : "text-text-muted hover:text-text"
                }`}
              >
                {metric === "media" ? "Média" : "Total"}
              </button>
            ))}
          </div>
        </header>
        {sortedParties.length > 0 ? (
          <ol className="space-y-3">
            {sortedParties.slice(0, 6).map((party, index) => {
              const value =
                partyMetric === "media"
                  ? party.totalLiquido /
                    Math.max(party.parlamentaresComDespesas, 1)
                  : party.totalLiquido;
              const ratio = (value / maxPartyValue) * 100;

              return (
                <li
                  key={party.partidoId}
                  className="rounded-lg p-2 hover:bg-surface-hover"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex min-w-0 items-center gap-2">
                      <span className="w-4 shrink-0 text-center text-xs font-bold text-text-muted tabular-nums">
                        {index + 1}
                      </span>
                      <span className="truncate text-xs font-bold text-text">
                        {party.sigla}
                      </span>
                      <span className="truncate text-[10px] text-text-muted">
                        {party.nome}
                      </span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span
                        title={formatCurrency(value)}
                        className="block font-mono text-xs font-bold text-text tabular-nums"
                      >
                        {formatCompactCurrency(value)}
                      </span>
                      <span className="block text-[10px] text-text-muted">
                        {formatInteger(party.parlamentaresComDespesas)}{" "}
                        parlamentares
                      </span>
                    </span>
                  </div>
                  <div
                    aria-hidden="true"
                    className="mt-2 h-1 overflow-hidden rounded-full bg-border-subtle"
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.max(ratio, 0)}%`,
                        backgroundColor: "var(--chart-2)",
                      }}
                    />
                  </div>
                </li>
              );
            })}
          </ol>
        ) : (
          <p className="text-xs text-text-muted">
            Nenhuma despesa atribuída a partidos no período.
          </p>
        )}
      </article>

      <article className="min-w-0 rounded-xl border border-border bg-surface p-5">
        <header className="mb-4 border-b border-border-subtle pb-3">
          <h2 className="text-sm font-semibold text-text">
            Maiores fornecedores
          </h2>
          <p className="mt-1 text-xs text-text-muted">
            Fornecedores com maior valor líquido registrado
          </p>
        </header>
        {fornecedores.length > 0 ? (
          <ol className="space-y-3">
            {fornecedores.map((supplier, index) => {
              const ratio =
                (supplier.totalLiquido / Math.max(maxSupplierValue, 1)) * 100;

              return (
                <li key={supplier.fornecedorId}>
                  <Link
                    href={`/fornecedores/${supplier.fornecedorId}`}
                    className="group block rounded-lg p-2 transition-colors hover:bg-surface-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex min-w-0 items-start gap-2">
                        <span className="w-4 shrink-0 pt-0.5 text-center text-xs font-bold text-text-muted tabular-nums">
                          {index + 1}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-xs font-semibold text-text group-hover:text-primary">
                            {supplier.nome}
                          </span>
                          <span className="block truncate font-mono text-[10px] text-text-muted">
                            CNPJ/CPF: {supplier.cnpjCpf}
                          </span>
                        </span>
                      </span>
                      <span className="shrink-0 text-right">
                        <span
                          title={formatCurrency(supplier.totalLiquido)}
                          className="block font-mono text-xs font-bold text-text tabular-nums"
                        >
                          {formatCompactCurrency(supplier.totalLiquido)}
                        </span>
                        <span className="block text-[10px] text-text-muted">
                          {formatInteger(supplier.parlamentaresComDespesas)}{" "}
                          parlamentares
                        </span>
                      </span>
                    </div>
                    <div
                      aria-hidden="true"
                      className="mt-2 h-1 overflow-hidden rounded-full bg-border-subtle"
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.max(ratio, 0)}%`,
                          backgroundColor: "var(--chart-3)",
                        }}
                      />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>
        ) : (
          <p className="text-xs text-text-muted">
            Nenhum fornecedor com despesas no período.
          </p>
        )}
        <Link
          href="/fornecedores"
          className="mt-4 block border-t border-border-subtle pt-3 text-center text-xs font-semibold text-primary hover:underline"
        >
          Ver todos os fornecedores
        </Link>
      </article>
    </section>
  );
};
