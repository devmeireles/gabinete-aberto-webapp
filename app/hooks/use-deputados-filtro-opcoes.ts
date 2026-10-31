"use client";

import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/app/lib/trpc/client";

const ONE_DAY_MS: number = 24 * 60 * 60 * 1000;

export function useDeputadosFiltroOpcoes() {
  const trpc = useTRPC();

  return useQuery(
    trpc.deputado.opcoesFiltro.queryOptions(undefined, {
      staleTime: ONE_DAY_MS,
      gcTime: ONE_DAY_MS,
    }),
  );
}
