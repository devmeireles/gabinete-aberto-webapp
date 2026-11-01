"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { useDashboardFilters } from "@/app/contexts/dashboard-filters.context";
import { useTRPC } from "@/app/lib/trpc/client";

const ONE_DAY_MS: number = 24 * 60 * 60 * 1000;

export function useDashboardMetrics() {
  const trpc = useTRPC();
  const { fromMonth, isInitialized, legislaturaId, toMonth } =
    useDashboardFilters();

  return useQuery(
    trpc.dashboard.metrics.queryOptions(
      {
        legislaturaId,
        fromMonth,
        ...(toMonth && { toMonth }),
      },
      {
        placeholderData: keepPreviousData,
        staleTime: ONE_DAY_MS,
        enabled: isInitialized,
      },
    ),
  );
}
