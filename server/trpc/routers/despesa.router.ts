// server/trpc/routers/despesa.router.ts
import "server-only";

import {
  despesaAnalyticsInputSchema,
  type DespesaAnalyticsResult,
  despesaListInputSchema,
  type DespesaListResult,
  type TipoDespesa,
} from "@/server/schemas/despesa.schema";

import { baseProcedure, createTRPCRouter } from "../init";

export const despesaRouter = createTRPCRouter({
  analytics: baseProcedure
    .input(despesaAnalyticsInputSchema)
    .query(({ ctx, input }): Promise<DespesaAnalyticsResult> =>
      ctx.despesaService.analytics(input),
    ),

  list: baseProcedure
    .input(despesaListInputSchema)
    .query(({ ctx, input }): Promise<DespesaListResult> =>
      ctx.despesaService.list(input),
    ),

  tipos: baseProcedure.query(({ ctx }): Promise<TipoDespesa[]> =>
    ctx.despesaService.listTipos(),
  ),
});
