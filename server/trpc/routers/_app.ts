import "server-only";

import { createTRPCRouter } from "../init";
import { legislaturaRouter } from "./legislatura.router";

export const appRouter = createTRPCRouter({
  legislatura: legislaturaRouter,
});

export type AppRouter = typeof appRouter;
