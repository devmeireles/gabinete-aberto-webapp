import "server-only";

import { createTRPCRouter } from "../init";
import { legislaturaRouter } from "./legislatura.router";
import { deputadoRouter } from "./deputado.router";

export const appRouter = createTRPCRouter({
  legislatura: legislaturaRouter,
  deputado: deputadoRouter,
});

export type AppRouter = typeof appRouter;
