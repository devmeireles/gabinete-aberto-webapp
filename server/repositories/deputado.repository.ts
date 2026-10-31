import "server-only";

import {
  and,
  asc,
  desc,
  count,
  eq,
  exists,
  gte,
  ilike,
  isNotNull,
  lte,
  or,
  sql,
  type SQL,
} from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";
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
  deputadoFiltroOpcoesSchema,
  deputadoListResultSchema,
  type DeputadoListInput,
  type DeputadoListResult,
  type DeputadoFiltroOpcoes,
} from "@/server/schemas/deputado.schema";
import {
  DeputadoDetalhe,
  deputadoDetalheSchema,
} from "../schemas/deputado-detalhe.schema";

export interface IDeputadoRepository {
  list(input: DeputadoListInput): Promise<DeputadoListResult>;
  detail(id: number): Promise<DeputadoDetalhe | null>;
  opcoesFiltro(): Promise<DeputadoFiltroOpcoes>;
}

const ORDER_COLUMNS = {
  nome: deputados.nome,
  siglaPartido: deputadoDetalhes.siglaPartido,
  siglaUf: deputadoDetalhes.siglaUf,
  dataNascimento: deputadoDetalhes.dataNascimento,
} as const;

async function distinctValues(
  db: Database,
  column: PgColumn,
): Promise<string[]> {
  const rows = await db
    .selectDistinct({ value: column })
    .from(deputadoDetalhes)
    .where(isNotNull(column))
    .orderBy(asc(column));

  return rows
    .map((row) => String(row.value).trim())
    .filter((value) => value !== "");
}

function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, "\\$&");
}

export function createDeputadoRepository(db: Database): IDeputadoRepository {
  return {
    async list(input: DeputadoListInput): Promise<DeputadoListResult> {
      const conditions: SQL[] = [];

      if (input.nome) {
        const pattern: string = `%${escapeLike(input.nome)}%`;
        const match: SQL | undefined = or(
          ilike(deputados.nome, pattern),
          ilike(deputadoDetalhes.nomeCivil, pattern),
          ilike(deputadoDetalhes.nomeEleitoral, pattern),
        );
        if (match) conditions.push(match);
      }
      if (input.legislaturaId) {
        conditions.push(
          exists(
            db
              .select({ one: sql`1` })
              .from(deputadoLegislaturas)
              .where(
                and(
                  eq(deputadoLegislaturas.deputadoId, deputados.id),
                  eq(deputadoLegislaturas.legislaturaId, input.legislaturaId),
                ),
              ),
          ),
        );
      }
      if (input.siglaUf)
        conditions.push(eq(deputadoDetalhes.siglaUf, input.siglaUf));
      if (input.siglaPartido)
        conditions.push(eq(deputadoDetalhes.siglaPartido, input.siglaPartido));
      if (input.siglaSexo)
        conditions.push(eq(deputadoDetalhes.sexo, input.siglaSexo));
      if (input.situacao)
        conditions.push(eq(deputadoDetalhes.situacao, input.situacao));
      if (input.condicaoEleitoral) {
        conditions.push(
          eq(deputadoDetalhes.condicaoEleitoral, input.condicaoEleitoral),
        );
      }
      if (input.escolaridade)
        conditions.push(eq(deputadoDetalhes.escolaridade, input.escolaridade));
      if (input.ufNascimento)
        conditions.push(eq(deputadoDetalhes.ufNascimento, input.ufNascimento));
      if (input.municipioNascimento) {
        conditions.push(
          ilike(
            deputadoDetalhes.municipioNascimento,
            `%${escapeLike(input.municipioNascimento)}%`,
          ),
        );
      }
      // Comparação por data (e não por extract(year)) mantém o filtro aproveitável por índice.
      if (input.anoNascimentoDe) {
        conditions.push(
          gte(
            deputadoDetalhes.dataNascimento,
            `${input.anoNascimentoDe}-01-01`,
          ),
        );
      }
      if (input.anoNascimentoAte) {
        conditions.push(
          lte(
            deputadoDetalhes.dataNascimento,
            `${input.anoNascimentoAte}-12-31`,
          ),
        );
      }

      const where: SQL | undefined =
        conditions.length > 0 ? and(...conditions) : undefined;

      // `nulls last`: deputados sem linha em deputado_detalhes não devem abrir a lista.
      const orderColumn = ORDER_COLUMNS[input.ordenarPor];
      const primaryOrder: SQL =
        input.ordem === "asc"
          ? sql`${orderColumn} asc nulls last`
          : sql`${orderColumn} desc nulls last`;

      const [rows, totals] = await Promise.all([
        db
          .select({
            id: deputados.id,
            nome: deputados.nome,
            urlFoto: deputados.urlFoto,
            siglaPartido: deputadoDetalhes.siglaPartido,
            siglaUf: deputadoDetalhes.siglaUf,
            situacao: deputadoDetalhes.situacao,
          })
          .from(deputados)
          .leftJoin(
            deputadoDetalhes,
            eq(deputadoDetalhes.deputadoId, deputados.id),
          )
          .where(where)
          .orderBy(primaryOrder, asc(deputados.nome), asc(deputados.id))
          .limit(input.itens)
          .offset((input.pagina - 1) * input.itens),

        db
          .select({ total: count() })
          .from(deputados)
          .leftJoin(
            deputadoDetalhes,
            eq(deputadoDetalhes.deputadoId, deputados.id),
          )
          .where(where),
      ]);

      const total: number = totals[0]?.total ?? 0;

      return deputadoListResultSchema.parse({
        items: rows,
        total,
        pagina: input.pagina,
        itens: input.itens,
        totalPaginas: Math.max(1, Math.ceil(total / input.itens)),
      });
    },

    async opcoesFiltro(): Promise<DeputadoFiltroOpcoes> {
      const [
        siglasUf,
        siglasPartido,
        situacoes,
        condicoesEleitorais,
        escolaridades,
        ufsNascimento,
      ] = await Promise.all([
        distinctValues(db, deputadoDetalhes.siglaUf),
        distinctValues(db, deputadoDetalhes.siglaPartido),
        distinctValues(db, deputadoDetalhes.situacao),
        distinctValues(db, deputadoDetalhes.condicaoEleitoral),
        distinctValues(db, deputadoDetalhes.escolaridade),
        distinctValues(db, deputadoDetalhes.ufNascimento),
      ]);

      return deputadoFiltroOpcoesSchema.parse({
        siglasUf,
        siglasPartido,
        situacoes,
        condicoesEleitorais,
        escolaridades,
        ufsNascimento,
      });
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
