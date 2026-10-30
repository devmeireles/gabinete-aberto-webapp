"use client";

import { ILegislatura } from "@/app/interfaces/legislatura.interface";
import React, { useState } from "react";
import { Calendar, Users, Building2, Receipt, ArrowRight, Clock, AlertCircle } from 'lucide-react';
import { IOverviewMetrics } from "@/app/interfaces/overview.interface";
import { formatDate, formatDateTime } from "@/app/lib/formartters.lib";
import { useDashboardFilters, useDashboardFiltersActions } from "@/app/contexts/dashboard-filters.context";
import { useLegislaturas } from "@/app/hooks/use-legislaturas";

export const DashboardView = () => {
    // const [legislaturas, setLegislaturas] = useState<ILegislatura[]>([]);
    // const [selectedLegislaturaId, setSelectedLegislaturaId] = useState<number>(57);
    // const [metrics, setMetrics] = useState<IOverviewMetrics | null>(null);

    // // Month filters
    // const [fromMonth, setFromMonth] = useState<string>('2026-01');
    // const [toMonth, setToMonth] = useState<string>('2026-10');

    const { fromMonth, legislaturaId, toMonth } = useDashboardFilters();
    const { setFromMonth, setLegislaturaId, setToMonth } = useDashboardFiltersActions();
    const { data: legislaturas = [], isLoading: isLoadingLegislaturas } = useLegislaturas();

    return (
        <div>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-6 border-b border-border">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                        <span>Panorama Oficial</span>
                        <span aria-hidden="true">·</span>
                        <span>Câmara dos Deputados</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-text tracking-tight">
                        Transparência das Despesas Parlamentares
                    </h1>
                    <p className="mt-1 text-sm text-text-muted max-w-2xl">
                        Acompanhamento auditável da Cota para o Exercício da Atividade Parlamentar (CEAP), bancadas e deputados federais.
                    </p>
                </div>

                {/* Legislatura & Period Selectors */}
                <div className="flex flex-wrap items-center gap-3 bg-surface p-3 rounded-lg border border-border text-xs">
                    <div>
                        <label htmlFor="select-legislatura" className="block text-[11px] font-medium text-text-muted mb-1">
                            Legislatura
                        </label>
                        <select
                            id="select-legislatura"
                            value={legislaturaId}
                            onChange={(e) => setLegislaturaId(Number(e.target.value))}
                            className="px-2.5 py-1.5 rounded border border-border bg-surface text-text font-medium focus:outline-none focus-visible:ring-1 focus-visible:ring-focus-ring"
                        >
                            {legislaturas.map((legislatura) => (
                                <option key={legislatura.id} value={legislatura.id}>
                                    {legislatura.id}ª Legislatura ({legislatura.dataInicio} - {legislatura.dataFim})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="filter-from-month" className="block text-[11px] font-medium text-text-muted mb-1">
                            De (Ano/Mês)
                        </label>
                        <input
                            type="month"
                            id="filter-from-month"
                            value={fromMonth}
                            onChange={(e) => setFromMonth(e.target.value)}
                            className="px-2 py-1 rounded border border-border bg-surface text-text font-mono tabular-nums focus:outline-none focus-visible:ring-1 focus-visible:ring-focus-ring"
                        />
                    </div>

                    <div>
                        <label htmlFor="filter-to-month" className="block text-[11px] font-medium text-text-muted mb-1">
                            Até (Ano/Mês)
                        </label>
                        <input
                            type="month"
                            id="filter-to-month"
                            value={toMonth}
                            onChange={(e) => setToMonth(e.target.value)}
                            className="px-2 py-1 rounded border border-border bg-surface text-text font-mono tabular-nums focus:outline-none focus-visible:ring-1 focus-visible:ring-focus-ring"
                        />
                    </div>
                </div>
            </div>

            {/* Audit & Update Banner */}
            {/* {metrics && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 rounded-lg border border-border-subtle bg-[var(--color-surface>
                -subtle)] text-xs text-text-muted">
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                        <span>
                            Última sincronização de dados: <strong className="text-text">{formatDateTime(metrics.meta.lastUpdatedAt)}</strong>
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{metrics.meta.proximaCargaAgendada}</span>
                    </div>

                    <div className="text-[11px] text-text-subtle">
                        {metrics.legislaturaAtual.numero}ª Legislatura: {formatDate(metrics.legislaturaAtual.dataInicio)} até {formatDate(metrics.legislaturaAtual.dataFim)}
                    </div>
                </div>
            )} */}
        </div>
    )
}