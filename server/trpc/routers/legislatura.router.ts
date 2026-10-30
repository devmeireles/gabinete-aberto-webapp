import "server-only";

import type { Legislatura } from "@/server/schemas/legislatura.schema";

import { baseProcedure, createTRPCRouter } from "../init";

export const legislaturaRouter = createTRPCRouter({
  list: baseProcedure.query(({ ctx }): Promise<Legislatura[]> => {
    return ctx.legislaturaService.list();
  }),
});
