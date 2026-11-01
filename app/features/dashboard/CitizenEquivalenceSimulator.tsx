"use client";

import { Calculator } from "lucide-react";
import { useState } from "react";

import { formatCurrency } from "@/app/lib/formartters.lib";

const MINIMUM_WAGE_REFERENCE = 1_509;
const BASIC_FOOD_BASKET_REFERENCE = 830;
const AVERAGE_INCOME_REFERENCE = 3_210;
const POPULAR_CAR_REFERENCE = 80_000;

const multiplierFormatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

interface IEquivalenceCardProps {
  title: string;
  multiplier: number;
  description: string;
  className: string;
}

const EquivalenceCard = ({
  title,
  multiplier,
  description,
  className,
}: IEquivalenceCardProps) => (
  <div className="rounded-xl border border-border bg-surface p-4 shadow-xs">
    <span className="block text-[11px] font-bold text-text-muted uppercase">
      {title}
    </span>
    <span
      className={`mt-1 block font-mono text-2xl font-black sm:text-3xl ${className}`}
    >
      {multiplierFormatter.format(multiplier)}
    </span>
    <span className="mt-1 block text-xs text-text-muted">{description}</span>
  </div>
);

interface ICitizenEquivalenceSimulatorProps {
  totalLiquido: number;
}

export const CitizenEquivalenceSimulator = ({
  totalLiquido,
}: ICitizenEquivalenceSimulatorProps) => {
  const [amount, setAmount] = useState(totalLiquido);
  const maxAmount = Math.max(totalLiquido, 1);

  return (
    <section
      aria-labelledby="citizen-equivalence-title"
      className="space-y-6 rounded-2xl border border-border bg-gradient-to-br from-surface to-surface-hover/30 p-6 shadow-sm sm:p-8"
    >
      <header>
        <h2
          id="citizen-equivalence-title"
          className="flex items-center gap-2 text-xl font-black text-text sm:text-2xl"
        >
          <Calculator
            className="h-6 w-6 shrink-0 text-primary"
            aria-hidden="true"
          />
          Calculadora de perspectiva do cidadão
        </h2>
        <p className="mt-1 text-xs text-text-muted sm:text-sm">
          A faixa começa no total líquido declarado no período e permite simular
          valores menores. As equivalências são ilustrativas, não uma medida de
          poder de compra.
        </p>
      </header>

      <div className="max-w-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label
            htmlFor="equivalence-amount"
            className="text-xs font-bold tracking-wider text-text-muted uppercase"
          >
            Simular valor até o total líquido do período
          </label>
          <output
            htmlFor="equivalence-amount"
            className="font-mono text-2xl font-black text-primary"
          >
            {formatCurrency(amount)}
          </output>
        </div>

        <input
          id="equivalence-amount"
          type="range"
          min={0}
          max={maxAmount}
          step="any"
          value={amount}
          disabled={totalLiquido === 0}
          onChange={(event) => setAmount(Number(event.target.value))}
          aria-valuetext={formatCurrency(amount)}
          className="h-2.5 w-full cursor-pointer appearance-none rounded-lg bg-border accent-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
        />

        <div
          aria-hidden="true"
          className="flex justify-between gap-3 font-mono text-[11px] text-text-muted"
        >
          <span>{formatCurrency(0)}</span>
          <span>{formatCurrency(totalLiquido)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2 lg:grid-cols-4">
        <EquivalenceCard
          title="Salários mínimos"
          multiplier={amount / MINIMUM_WAGE_REFERENCE}
          description={`Referência: ${formatCurrency(MINIMUM_WAGE_REFERENCE)} por mês.`}
          className="text-primary"
        />
        <EquivalenceCard
          title="Cestas básicas (DIEESE)"
          multiplier={amount / BASIC_FOOD_BASKET_REFERENCE}
          description={`Referência: ${formatCurrency(BASIC_FOOD_BASKET_REFERENCE)} por cesta.`}
          className="text-amber-600 dark:text-amber-400"
        />
        <EquivalenceCard
          title="Rendas médias (IBGE)"
          multiplier={amount / AVERAGE_INCOME_REFERENCE}
          description={`Referência: ${formatCurrency(AVERAGE_INCOME_REFERENCE)} mensais.`}
          className="text-emerald-700 dark:text-emerald-400"
        />
        <EquivalenceCard
          title="Carros populares"
          multiplier={amount / POPULAR_CAR_REFERENCE}
          description={`Referência ilustrativa: ${formatCurrency(POPULAR_CAR_REFERENCE)} por veículo.`}
          className="text-sky-700 dark:text-sky-400"
        />
      </div>

      <p className="border-t border-border pt-3 text-[11px] text-text-subtle">
        Valores de referência ilustrativos: salário mínimo de R$ 1.509, cesta
        básica de R$ 830, renda média mensal de R$ 3.210 e carro popular de R$
        80.000. As referências não são atualizadas automaticamente.
      </p>
    </section>
  );
};
