"use client";

import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { formatCurrency, formatInteger } from "@/app/lib/formartters.lib";
import type { DashboardMetrics } from "@/server/schemas/dashboard.schema";

interface IDashboardMetricCardsProps {
  totais: DashboardMetrics["totais"];
}

export const DashboardMetricCards = ({
  totais,
}: IDashboardMetricCardsProps) => (
  <section
    aria-label="Indicadores gerais do período"
    className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
  >
    <MetricCard
      title="Valor líquido ressarcido"
      value={formatCurrency(totais.totalLiquido)}
      detail={`Valor bruto declarado: ${formatCurrency(totais.totalBruto)}`}
      context={`Glosas retidas: ${formatCurrency(totais.totalGlosa)}`}
      href="/despesas"
    />
    <MetricCard
      title="Despesas declaradas"
      value={formatInteger(totais.totalRegistros)}
      detail="Documentos registrados no período"
      context="Consultar despesas"
      href="/despesas"
    />
    <MetricCard
      title="Parlamentares com despesas"
      value={formatInteger(totais.parlamentaresComDespesas)}
      detail={`${formatInteger(totais.totalParlamentares)} parlamentares cadastrados na legislatura`}
      context="Ver diretório de deputados"
      href="/deputados"
    />
    <MetricCard
      title="Partidos com despesas"
      value={formatInteger(totais.partidosComDespesas)}
      detail="Com vínculo partidário identificável no período"
      context="Distribuição detalhada por partido abaixo"
    />
  </section>
);

interface IMetricCardProps {
  title: string;
  value: string;
  detail: string;
  context: string;
  href?: string;
}

const MetricCard = ({
  title,
  value,
  detail,
  context,
  href,
}: IMetricCardProps) => {
  const contents = (
    <>
      <span className="block text-xs font-medium text-text-muted">{title}</span>
      <span className="mt-1 block font-mono text-2xl font-bold text-text tabular-nums">
        {value}
      </span>
      <span className="mt-1 block text-[11px] text-text-subtle">{detail}</span>
      <span className="mt-3 flex items-center gap-1 text-[11px] font-medium text-primary">
        {context}
        {href && <ArrowRight className="h-3 w-3" aria-hidden="true" />}
      </span>
    </>
  );

  const className = `block h-full rounded-xl border border-border bg-surface p-4 shadow-2xs ${
    href
      ? "transition-colors hover:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
      : ""
  }`;

  return href ? (
    <Link href={href} className={className}>
      {contents}
    </Link>
  ) : (
    <div className={className}>{contents}</div>
  );
};
