"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/app/lib/trpc/client";
import { THIRTY_DAYS_MS } from "@/app/lib/cache-durations";

export function useLegislaturas() {
  const trpc = useTRPC();

  return useQuery(
    trpc.legislatura.list.queryOptions(undefined, {
      staleTime: THIRTY_DAYS_MS,
      gcTime: THIRTY_DAYS_MS,
    }),
  );
}
