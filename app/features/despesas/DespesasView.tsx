"use client";

import React from "react";
import Link from "next/link";
import {
    ExternalLink,
} from "lucide-react";

import {
    IDespesasFilters,
    useDespesasFilters,
    useDespesasFiltersActions,
} from "@/app/contexts/despesas-filters.context";
import { useDespesas } from "@/app/hooks/use-despesas";
import { formatDate } from "@/app/lib/formartters.lib";
import { EmptyState } from "@/app/components/ui/EmptyState";
import { Pagination } from "@/app/components/ui/Pagination";
import { DespesasFilters } from "./DespesasFilters";
import { TotalsBar } from "@/app/components/ui/TotalsBar";
import { DespesasResults } from "./DespesasResults";

const brl: Intl.NumberFormat = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const formatCurrency = (value: number): string => brl.format(value);


export const DespesasView = () => {
    const filters: IDespesasFilters = useDespesasFilters();

    const { setPagina, reset } = useDespesasFiltersActions();

    const { data, isPending, isError, isPlaceholderData } = useDespesas();

    const activeFiltersCount: number = [
        filters.tipoDespesaId,
        filters.fornecedor.trim(),
        filters.fromMonth,
        filters.toMonth,
    ].filter(Boolean).length;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-border pb-5">
                <div>
                    <h1 className="text-2xl font-bold text-text tracking-tight">
                        Despesas da Cota Parlamentar (CEAP)
                    </h1>
                    <p className="mt-1 text-sm text-text-muted">
                        Consulta auditável com discriminação de valor bruto declarado, glosas retidas e valor líquido ressarcido.
                    </p>
                </div>
            </div>

            <DespesasFilters />

            {data && (
                <TotalsBar
                    totais={{
                        valorBruto: data.totalBruto,
                        valorGlosa: data.totalGlosa,
                        valorLiquido: data.totalLiquido,
                        totalRegistros: data.total,
                    }}
                    filtrosAtivosCount={activeFiltersCount}
                    labelContexto="Total das despesas filtradas"
                    dimmed={isPlaceholderData}
                />
            )}

            <DespesasResults />
        </div>
    );
};