"use client";

import { formatCurrency, formatInteger } from "@/app/lib/formartters.lib";
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

    <div className="relative z-10 mt-8 grid grid-cols-1 gap-4 border-t border-emerald-500/20 pt-6 sm:grid-cols-3">
      <HeroMetric
        label="Total líquido declarado no período"
        value={formatCurrency(totais.totalLiquido)}
        detail="Valor líquido após glosas registradas"
        emphasis="default"
      />
      <HeroMetric
        label="Média por parlamentar"
        value={formatCurrency(totais.mediaPorParlamentar)}
        detail={`${formatInteger(totais.totalParlamentares)} parlamentares cadastrados na legislatura`}
        emphasis="accent"
      />
      <HeroMetric
        label="Documentos de despesa declarados"
        value={formatInteger(totais.totalRegistros)}
        detail="Registros no período e legislatura selecionados"
        emphasis="default"
      />
    </div>
  </section>
);

interface IHeroMetricProps {
  label: string;
  value: string;
  detail: string;
  emphasis: "default" | "accent";
}

const HeroMetric = ({ label, value, detail, emphasis }: IHeroMetricProps) => (
  <div className="flex flex-col justify-between gap-2 rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
    <span className="block text-xs font-bold tracking-wider text-emerald-200 uppercase">
      {label}
    </span>
    <span
      className={`mt-1 block text-2xl font-black sm:text-3xl ${
        emphasis === "accent" ? "text-emerald-300" : "text-white"
      }`}
    >
      {value}
    </span>
    <span className="mt-0.5 block text-[11px] text-emerald-200">{detail}</span>
  </div>
);
