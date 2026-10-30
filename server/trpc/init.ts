import "server-only";

import { initTRPC } from "@trpc/server";

import {
  deputadoService,
  despesaService,
  legislaturaService,
} from "@/server/services";

export function createContext() {
  return { legislaturaService, deputadoService, despesaService };
}
export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();

export const createTRPCRouter = t.router;
export const baseProcedure = t.procedure;
