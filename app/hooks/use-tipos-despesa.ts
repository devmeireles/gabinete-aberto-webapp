// app/hooks/use-tipos-despesa.ts
"use client";

import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/app/lib/trpc/client";
import { ONE_DAY_MS } from "@/app/lib/cache-durations";

export function useTiposDespesa() {
  const trpc = useTRPC();

  // Os tipos da cota são praticamente fixos.
  return useQuery(
    trpc.despesa.tipos.queryOptions(undefined, {
      staleTime: ONE_DAY_MS,
      gcTime: ONE_DAY_MS,
    }),
  );
}
