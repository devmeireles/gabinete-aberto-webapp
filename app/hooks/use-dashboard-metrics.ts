"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/app/lib/trpc/client";

const SEVEN_DAYS_MS: number = 7 * 24 * 60 * 60 * 1000;

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
