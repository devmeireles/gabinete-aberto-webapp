"use client";

import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/app/lib/trpc/client";
import { ONE_DAY_MS } from "@/app/lib/cache-durations";

export function useDeputadosFiltroOpcoes() {
  const trpc = useTRPC();

  return useQuery(
    trpc.deputado.opcoesFiltro.queryOptions(undefined, {
      staleTime: ONE_DAY_MS,
      gcTime: ONE_DAY_MS,
    }),
  );
}
