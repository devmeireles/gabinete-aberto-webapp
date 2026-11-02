"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import {
  useDeputadosFilters,
  type IDeputadosFilters,
} from "@/app/contexts/deputados-filters.context";
import { useDebouncedValue } from "@/app/hooks/use-debounced-value";
import { SEVEN_DAYS_MS } from "@/app/lib/cache-durations";
import { useTRPC } from "@/app/lib/trpc/client";

const TEXT_DEBOUNCE_MS: number = 400;
const TEXT_MIN_LENGTH: number = 2; // o servidor exige min(2)

/** Só envia o ano quando o campo tem 4 dígitos: digitar "19" não dispara busca. */
function parseYear(value: string): number | undefined {
  return /^\d{4}$/.test(value) ? Number(value) : undefined;
}

export function useDeputados() {
  const trpc = useTRPC();
  const filters: IDeputadosFilters = useDeputadosFilters();

  const nome: string = filters.nome.trim();
  const municipio: string = filters.municipioNascimento.trim();
  const debouncedNome: string = useDebouncedValue(nome, TEXT_DEBOUNCE_MS);
  const debouncedMunicipio: string = useDebouncedValue(
    municipio,
    TEXT_DEBOUNCE_MS,
  );
  const isTyping: boolean =
    nome !== debouncedNome || municipio !== debouncedMunicipio;

  const anoDe: number | undefined = parseYear(filters.anoNascimentoDe);
  const anoAte: number | undefined = parseYear(filters.anoNascimentoAte);

  // Só envia o que tem valor: a query key fica estável e o servidor não recebe "".
  const input = {
    ...(debouncedNome.length >= TEXT_MIN_LENGTH && { nome: debouncedNome }),
    ...(filters.legislaturaId && { legislaturaId: filters.legislaturaId }),
    ...(filters.siglaUf && { siglaUf: filters.siglaUf }),
    ...(filters.siglaPartido && { siglaPartido: filters.siglaPartido }),
    ...(filters.siglaSexo && { siglaSexo: filters.siglaSexo }),
    ...(filters.situacao && { situacao: filters.situacao }),
    ...(filters.condicaoEleitoral && {
      condicaoEleitoral: filters.condicaoEleitoral,
    }),
    ...(filters.escolaridade && { escolaridade: filters.escolaridade }),
    ...(filters.ufNascimento && { ufNascimento: filters.ufNascimento }),
    ...(debouncedMunicipio.length >= TEXT_MIN_LENGTH && {
      municipioNascimento: debouncedMunicipio,
    }),
    ...(anoDe && { anoNascimentoDe: anoDe }),
    ...(anoAte && { anoNascimentoAte: anoAte }),
    ordenarPor: filters.ordenarPor,
    ordem: filters.ordem,
    pagina: filters.pagina,
    itens: filters.itens,
  };

  return useQuery(
    trpc.deputado.list.queryOptions(input, {
      placeholderData: keepPreviousData,
      staleTime: SEVEN_DAYS_MS,
      gcTime: SEVEN_DAYS_MS,
      enabled: !isTyping,
    }),
  );
}
