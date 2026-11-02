"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { useDespesasFilters } from "@/app/contexts/despesas-filters.context";
import { useDebouncedValue } from "@/app/hooks/use-debounced-value";
import { SEVEN_DAYS_MS } from "@/app/lib/cache-durations";
import { useTRPC } from "@/app/lib/trpc/client";

const FORNECEDOR_DEBOUNCE_MS = 400;
const FORNECEDOR_MIN_LENGTH = 2;

export function useDeputadoDespesasAnalytics(deputadoId: number) {
  const trpc = useTRPC();
  const filters = useDespesasFilters();
  const fornecedor = filters.fornecedor.trim();
  const debouncedFornecedor = useDebouncedValue(
    fornecedor,
    FORNECEDOR_DEBOUNCE_MS,
  );
  const isTyping = fornecedor !== debouncedFornecedor;
  const input = {
    legislaturaId: filters.legislaturaId ?? 0,
    deputadoId,
    ...(filters.fornecedorId && { fornecedorId: filters.fornecedorId }),
    ...(filters.tipoDespesaId && { tipoDespesaId: filters.tipoDespesaId }),
    ...(filters.fromMonth && { fromMonth: filters.fromMonth }),
    ...(filters.toMonth && { toMonth: filters.toMonth }),
    ...(debouncedFornecedor.length >= FORNECEDOR_MIN_LENGTH && {
      fornecedor: debouncedFornecedor,
    }),
  };

  const query = useQuery(
    trpc.despesa.analytics.queryOptions(input, {
      placeholderData: keepPreviousData,
      staleTime: SEVEN_DAYS_MS,
      gcTime: SEVEN_DAYS_MS,
      enabled: Boolean(filters.legislaturaId) && !isTyping,
    }),
  );

  return { ...query, isTyping };
}
