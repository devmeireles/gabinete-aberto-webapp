"use client";

import Link from "next/link";

import { ArrowRight } from "lucide-react";

import {
  formatCompactCurrency,
  formatCurrency,
  formatInteger,
} from "@/app/lib/formartters.lib";
import type { DashboardMetrics } from "@/server/schemas/dashboard.schema";

interface IDashboardHeroProps {
  totais: DashboardMetrics["totais"];
}

export const DashboardHero = ({ totais }: IDashboardHeroProps) => (
  <section
    aria-labelledby="dashboard-hero-title"
    className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 p-6 text-white shadow-xl sm:p-10"
  >
    <div className="relative z-10 max-w-3xl space-y-3">
      <h2
        id="dashboard-hero-title"
        className="text-2xl leading-tight font-black tracking-tight text-white sm:text-4xl"
      >
        Para onde vai o dinheiro da Cota Parlamentar?
      </h2>
      <p className="text-sm leading-relaxed text-emerald-100/90 sm:text-base">
        A CEAP cobre despesas do exercício do mandato, como passagens,
        divulgação, combustíveis e manutenção de escritórios. Explore os valores
        declarados no período selecionado e consulte os documentos associados.
      </p>
    </div>

    <div
      aria-label="Indicadores gerais da legislatura vigente"
      className="relative z-10 mt-8 grid grid-cols-1 gap-3 border-t border-emerald-500/20 pt-6 sm:grid-cols-3 lg:grid-cols-3"
    >
      <HeroMetric
        label="Total líquido declarado no período"
        value={formatCompactCurrency(totais.totalLiquido)}
        exactValue={formatCurrency(totais.totalLiquido)}
        detail={`Bruto ${formatCompactCurrency(totais.totalBruto)} · Glosas ${formatCompactCurrency(totais.totalGlosa)}`}
        detailTitle={`Bruto ${formatCurrency(totais.totalBruto)} · Glosas ${formatCurrency(totais.totalGlosa)}`}
        emphasis="default"
        href="/despesas"
      />
      <HeroMetric
        label="Despesas declaradas"
        value={formatInteger(totais.totalRegistros)}
        detail="Documentos registrados na legislatura"
        emphasis="default"
        href="/despesas"
      />
      <HeroMetric
        label="Parlamentares com despesas"
        value={formatInteger(totais.parlamentaresComDespesas)}
        detail={`${formatInteger(totais.totalParlamentares)} parlamentares na legislatura`}
        emphasis="accent"
        href="/deputados"
      />
    </div>
  </section>
);

interface IHeroMetricProps {
  label: string;
  value: string;
  exactValue?: string;
  detail: string;
  detailTitle?: string;
  emphasis: "default" | "accent";
  href?: string;
}

const HeroMetric = ({
  label,
  value,
  exactValue,
  detail,
  detailTitle,
  emphasis,
  href,
}: IHeroMetricProps) => {
  const content = (
    <>
      <span className="block text-xs font-bold tracking-wider text-emerald-200 uppercase">
        {label}
      </span>
      <span
        aria-label={
          exactValue ? `${label}: ${exactValue}` : `${label}: ${value}`
        }
        title={exactValue}
        className={`mt-1 block text-2xl font-black sm:text-3xl ${emphasis === "accent" ? "text-emerald-300" : "text-white"
          }`}
      >
        {value}
      </span>
      <span
        title={detailTitle}
        className="mt-0.5 flex items-center justify-between gap-2 text-[11px] text-emerald-200"
      >
        {detail}
        {href && <ArrowRight className="h-3 w-3 shrink-0" aria-hidden="true" />}
      </span>
    </>
  );
  const className =
    "flex h-full flex-col justify-between gap-2 rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-md";

  return href ? (
    <Link
      href={href}
      className={`${className} transition-colors hover:border-emerald-300/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white`}
    >
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  );
};
