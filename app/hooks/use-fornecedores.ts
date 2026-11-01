"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { useDebouncedValue } from "@/app/hooks/use-debounced-value";
import { useTRPC } from "@/app/lib/trpc/client";
import type { FornecedorOrdenarPor } from "@/server/schemas/fornecedor.schema";

const FIVE_MINUTES_MS = 5 * 60 * 1000;
const SEARCH_DEBOUNCE_MS = 400;
const SEARCH_MIN_LENGTH = 2;

interface IUseFornecedoresInput {
  busca: string;
  ordenarPor: FornecedorOrdenarPor;
  ordem: "asc" | "desc";
  pagina: number;
  itens: number;
}

export function useFornecedores(filters: IUseFornecedoresInput) {
  const trpc = useTRPC();
  const busca = filters.busca.trim();
  const buscaDebounced = useDebouncedValue(busca, SEARCH_DEBOUNCE_MS);
  const isTyping = busca !== buscaDebounced;

  const input = {
    ...(buscaDebounced.length >= SEARCH_MIN_LENGTH && {
      busca: buscaDebounced,
    }),
    ordenarPor: filters.ordenarPor,
    ordem: filters.ordem,
    pagina: filters.pagina,
    itens: filters.itens,
  };

  return useQuery(
    trpc.fornecedor.list.queryOptions(input, {
      placeholderData: keepPreviousData,
      staleTime: FIVE_MINUTES_MS,
      enabled: !isTyping,
    }),
  );
}
