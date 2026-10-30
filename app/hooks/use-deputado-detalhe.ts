"use client"

import { useQuery } from "@tanstack/react-query"

import { useTRPC } from "@/app/lib/trpc/client"

const ONE_HOUR_MS: number = 60 * 60 * 1000

export function useDeputadoDetalhe(id: number) {
  const trpc = useTRPC()

  return useQuery(
    trpc.deputado.detail.queryOptions(
      { id },
      { staleTime: ONE_HOUR_MS, retry: false },
    ),
  )
}