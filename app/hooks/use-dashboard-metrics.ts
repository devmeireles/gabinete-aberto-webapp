"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/app/lib/trpc/client";
import { SEVEN_DAYS_MS } from "@/app/lib/cache-durations";

export function useDashboardMetrics() {
  const trpc = useTRPC();

  return useQuery(
    trpc.dashboard.metrics.queryOptions(undefined, {
      placeholderData: keepPreviousData,
      staleTime: SEVEN_DAYS_MS,
      gcTime: SEVEN_DAYS_MS,
    }),
  );
}
