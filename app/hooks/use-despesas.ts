// app/hooks/use-despesas.ts
"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import {
  useDespesasFilters,
  type IDespesasFilters,
} from "@/app/contexts/despesas-filters.context";
import { useDebouncedValue } from "@/app/hooks/use-debounced-value";
import { useTRPC } from "@/app/lib/trpc/client";

const FIVE_MINUTES_MS: number = 5 * 60 * 1000;
const FORNECEDOR_DEBOUNCE_MS: number = 400;
const FORNECEDOR_MIN_LENGTH: number = 2; // o servidor exige min(2)

export function useDespesas() {
  const trpc = useTRPC();
  const filters: IDespesasFilters = useDespesasFilters();

  const fornecedor: string = filters.fornecedor.trim();
  const debouncedFornecedor: string = useDebouncedValue(
    fornecedor,
    FORNECEDOR_DEBOUNCE_MS,
  );
  const isTyping: boolean = fornecedor !== debouncedFornecedor;

  const input = {
    ...(filters.legislaturaId && { legislaturaId: filters.legislaturaId }),
    ...(filters.deputadoId && { deputadoId: filters.deputadoId }),
    ...(filters.fornecedorId && { fornecedorId: filters.fornecedorId }),
    ...(filters.tipoDespesaId && { tipoDespesaId: filters.tipoDespesaId }),
    ...(filters.fromMonth && { fromMonth: filters.fromMonth }),
    ...(filters.toMonth && { toMonth: filters.toMonth }),
    ...(debouncedFornecedor.length >= FORNECEDOR_MIN_LENGTH && {
      fornecedor: debouncedFornecedor,
    }),
    ordenarPor: filters.ordenarPor,
    ordem: filters.ordem,
    pagina: filters.pagina,
    itens: filters.itens,
  };

  return useQuery(
    trpc.despesa.list.queryOptions(input, {
      placeholderData: keepPreviousData,
      staleTime: FIVE_MINUTES_MS,
      enabled: !isTyping,
    }),
  );
}
