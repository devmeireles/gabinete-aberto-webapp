import "server-only";

import { TRPCError } from "@trpc/server";

import {
  fornecedorDetailInputSchema,
  fornecedorListInputSchema,
  fornecedorTopDeputiesInputSchema,
  type FornecedorDetail,
  type FornecedorListResult,
  type FornecedorTopDeputy,
} from "@/server/schemas/fornecedor.schema";
import { baseProcedure, createTRPCRouter } from "../init";

export const fornecedorRouter = createTRPCRouter({
  list: baseProcedure
    .input(fornecedorListInputSchema)
    .query(({ ctx, input }): Promise<FornecedorListResult> =>
      ctx.fornecedorService.list(input),
    ),

  detail: baseProcedure
    .input(fornecedorDetailInputSchema)
    .query(async ({ ctx, input }): Promise<FornecedorDetail> => {
      const fornecedor = await ctx.fornecedorService.detail(input.id);

      if (!fornecedor) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Fornecedor não encontrado",
        });
      }

      return fornecedor;
    }),

  topDeputies: baseProcedure
    .input(fornecedorTopDeputiesInputSchema)
    .query(({ ctx, input }): Promise<FornecedorTopDeputy[]> =>
      ctx.fornecedorService.topDeputies(input),
    ),
});
