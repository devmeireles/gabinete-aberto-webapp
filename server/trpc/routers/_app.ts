import "server-only";

import { createTRPCRouter } from "../init";
import { legislaturaRouter } from "./legislatura.router";
import { deputadoRouter } from "./deputado.router";
import { despesaRouter } from "./despesa.router";
import { fornecedorRouter } from "./fornecedor.router";

export const appRouter = createTRPCRouter({
  legislatura: legislaturaRouter,
  deputado: deputadoRouter,
  despesa: despesaRouter,
  fornecedor: fornecedorRouter,
});

export type AppRouter = typeof appRouter;
