import "server-only";

import type { Deputado } from "@/server/schemas/deputado.schema";

import { baseProcedure, createTRPCRouter } from "../init";

export const deputadoRouter = createTRPCRouter({
  list: baseProcedure.query(({ ctx }): Promise<Deputado[]> => {
    return ctx.deputadoService.list();
  }),
});
