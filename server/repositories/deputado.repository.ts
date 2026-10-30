import "server-only";

import { desc, eq } from "drizzle-orm";

import type { Database } from "@/server/db/client";
import { deputadoDetalhes, deputados } from "@/drizzle/schema";
import {
  deputadoSchema,
  type Deputado,
} from "@/server/schemas/deputado.schema";

export interface IDeputadoRepository {
  list(): Promise<Deputado[]>;
}

export function createDeputadoRepository(db: Database): IDeputadoRepository {
  return {
    async list(): Promise<Deputado[]> {
      const rows = await db
        .select()
        .from(deputados)
        .leftJoin(
          deputadoDetalhes,
          eq(deputadoDetalhes.deputadoId, deputados.id),
        )
        .orderBy(desc(deputados.id))
        .limit(12);

      const result = rows.map(({ deputados, deputado_detalhes }) => ({
        id: deputados.id,
        nome: deputados.nome,
        urlFoto: deputados.urlFoto,
        siglaPartido: deputado_detalhes?.siglaPartido,
        situacao: deputado_detalhes?.situacao,
        siglaUf: deputado_detalhes?.siglaUf,
      }));

      return deputadoSchema.array().parse(result);
    },
  };
}
