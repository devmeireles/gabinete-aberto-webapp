import "server-only";

import { desc, eq } from "drizzle-orm";

import type { Database } from "@/server/db/client";
import {
  deputadoDetalhes,
  deputados,
  deputadoLegislaturas,
  deputadoPartidoVigencias,
  legislaturas,
  partidos,
} from "@/drizzle/schema";
import {
  deputadoSchema,
  type Deputado,
} from "@/server/schemas/deputado.schema";
import {
  DeputadoDetalhe,
  deputadoDetalheSchema,
} from "../schemas/deputado-detalhe.schema";

export interface IDeputadoRepository {
  list(): Promise<Deputado[]>;
  detail(id: number): Promise<DeputadoDetalhe | null>;
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

    async detail(id: number): Promise<DeputadoDetalhe | null> {
      const [perfilRows, legislaturaRows, filiacaoRows] = await Promise.all([
        db
          .select({ deputado: deputados, detalhes: deputadoDetalhes })
          .from(deputados)
          .leftJoin(
            deputadoDetalhes,
            eq(deputadoDetalhes.deputadoId, deputados.id),
          )
          .where(eq(deputados.id, id))
          .limit(1),

        db
          .select({
            legislaturaId: deputadoLegislaturas.legislaturaId,
            siglaUf: deputadoLegislaturas.siglaUf,
            email: deputadoLegislaturas.email,
            dataInicio: legislaturas.dataInicio,
            dataFim: legislaturas.dataFim,
          })
          .from(deputadoLegislaturas)
          .innerJoin(
            legislaturas,
            eq(legislaturas.id, deputadoLegislaturas.legislaturaId),
          )
          .where(eq(deputadoLegislaturas.deputadoId, id))
          .orderBy(desc(deputadoLegislaturas.legislaturaId)),

        db
          .select({
            legislaturaId: deputadoPartidoVigencias.legislaturaId,
            partidoId: deputadoPartidoVigencias.partidoId,
            siglaPartido: partidos.sigla,
            nomePartido: partidos.nome,
            dataInicio: deputadoPartidoVigencias.dataInicio,
            dataFim: deputadoPartidoVigencias.dataFim,
          })
          .from(deputadoPartidoVigencias)
          .leftJoin(
            partidos,
            eq(partidos.id, deputadoPartidoVigencias.partidoId),
          )
          .where(eq(deputadoPartidoVigencias.deputadoId, id))
          .orderBy(
            desc(deputadoPartidoVigencias.legislaturaId),
            desc(deputadoPartidoVigencias.dataInicio),
          ),
      ]);

      const row = perfilRows[0];
      if (!row) return null;

      const { deputado, detalhes } = row;

      return deputadoDetalheSchema.parse({
        perfil: {
          id: deputado.id,
          nome: deputado.nome,
          urlFoto: detalhes?.urlFoto ?? deputado.urlFoto,
          nomeCivil: detalhes?.nomeCivil ?? null,
          nomeEleitoral: detalhes?.nomeEleitoral ?? null,
          sexo: detalhes?.sexo ?? null,
          dataNascimento: detalhes?.dataNascimento ?? null,
          dataFalecimento: detalhes?.dataFalecimento ?? null,
          ufNascimento: detalhes?.ufNascimento ?? null,
          municipioNascimento: detalhes?.municipioNascimento ?? null,
          escolaridade: detalhes?.escolaridade ?? null,
          urlWebsite: detalhes?.urlWebsite ?? null,
          redesSociais: detalhes?.redesSociais ?? [],
          siglaPartido: detalhes?.siglaPartido ?? null,
          siglaUf: detalhes?.siglaUf ?? null,
          email: detalhes?.email ?? null,
          situacao: detalhes?.situacao ?? null,
          condicaoEleitoral: detalhes?.condicaoEleitoral ?? null,
          gabinete: {
            nome: detalhes?.gabineteNome ?? null,
            predio: detalhes?.gabinetePredio ?? null,
            sala: detalhes?.gabineteSala ?? null,
            andar: detalhes?.gabineteAndar ?? null,
            telefone: detalhes?.gabineteTelefone ?? null,
            email: detalhes?.gabineteEmail ?? null,
          },
          dataStatus: detalhes?.dataStatus ?? null,
          updatedAt: detalhes?.updatedAt ?? null,
        },
        legislaturas: legislaturaRows,
        filiacoes: filiacaoRows,
      });
    },
  };
}
