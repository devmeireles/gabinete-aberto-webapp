// lib/trpc/query-client.ts
import { QueryClient } from "@tanstack/react-query";
import { ONE_MINUTE_MS } from "@/app/lib/cache-durations";

export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: ONE_MINUTE_MS },
    },
  });
}
