"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import {
  useDeputadosFilters,
  type IDeputadosFilters,
} from "@/app/contexts/deputados-filters.context";
import { useDebouncedValue } from "@/app/hooks/use-debounced-value";
import { useTRPC } from "@/app/lib/trpc/client";

const FIVE_MINUTES_MS: number = 5 * 60 * 1000;
const NOME_DEBOUNCE_MS: number = 400;

export function useDeputados() {
  const trpc = useTRPC();
  const filters: IDeputadosFilters = useDeputadosFilters();

  const nome: string = filters.nome.trim();
  const debouncedNome: string = useDebouncedValue(nome, NOME_DEBOUNCE_MS);
  const isTyping: boolean = nome !== debouncedNome;

  const input = {
    ...(debouncedNome && { nome: debouncedNome }),
    ...(filters.siglaUf && { siglaUf: filters.siglaUf }),
    ...(filters.siglaPartido && { siglaPartido: filters.siglaPartido }),
    ...(filters.siglaSexo && { siglaSexo: filters.siglaSexo }),
    pagina: filters.pagina,
    itens: filters.itens,
  };

  return useQuery(
    trpc.deputado.list.queryOptions(input, {
      placeholderData: keepPreviousData,
      staleTime: FIVE_MINUTES_MS,
      enabled: !isTyping,
    }),
  );
}
