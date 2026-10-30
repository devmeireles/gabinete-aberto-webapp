import "server-only";

import type { Deputado } from "@/server/schemas/deputado.schema";

import { baseProcedure, createTRPCRouter } from "../init";
import { DeputadoDetalhe } from "@/server/schemas/deputado-detalhe.schema";
import z from "zod";
import { TRPCError } from "@trpc/server";

export const deputadoRouter = createTRPCRouter({
  list: baseProcedure.query(({ ctx }): Promise<Deputado[]> => {
    return ctx.deputadoService.list();
  }),
  detail: baseProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ ctx, input }): Promise<DeputadoDetalhe> => {
      const detalhe: DeputadoDetalhe | null = await ctx.deputadoService.detail(
        input.id,
      );

      if (!detalhe) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Deputado não encontrado",
        });
      }

      return detalhe;
    }),
});
