"use client";

import { useQuery } from "@tanstack/react-query";

import { ONE_HOUR_MS } from "@/app/lib/cache-durations";
import { useTRPC } from "@/app/lib/trpc/client";

export function useDeputadoDetalhe(id: number) {
  const trpc = useTRPC();

  return useQuery(
    trpc.deputado.detail.queryOptions(
      { id },
      { staleTime: ONE_HOUR_MS, gcTime: ONE_HOUR_MS, retry: false },
    ),
  );
}
