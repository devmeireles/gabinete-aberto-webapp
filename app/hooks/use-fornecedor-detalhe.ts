"use client";

import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/app/lib/trpc/client";

const ONE_HOUR_MS = 60 * 60 * 1000;

export function useFornecedorDetalhe(id: string) {
  const trpc = useTRPC();

  return useQuery(
    trpc.fornecedor.detail.queryOptions(
      { id },
      { staleTime: ONE_HOUR_MS, retry: false },
    ),
  );
}
