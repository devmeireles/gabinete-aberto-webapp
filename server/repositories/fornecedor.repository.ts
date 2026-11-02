import "server-only";

import {
  and,
  asc,
  count,
  desc,
  eq,
  ilike,
  inArray,
  or,
  sql,
  sum,
  type SQL,
} from "drizzle-orm";

import {
  deputadoDetalhes,
  deputados,
  despesas,
  fornecedores,
  tiposDespesa,
} from "@/drizzle/schema";
import type { Database } from "@/server/db/client";
import {
  fornecedorDetailSchema,
  fornecedorListResultSchema,
  fornecedorTopDeputiesInputSchema,
  fornecedorTopDeputiesSchema,
  type FornecedorDetail,
  type FornecedorListInput,
  type FornecedorListResult,
  type FornecedorTopDeputiesInput,
  type FornecedorTopDeputy,
} from "@/server/schemas/fornecedor.schema";

export interface IFornecedorRepository {
  list(input: FornecedorListInput): Promise<FornecedorListResult>;
  detail(id: number): Promise<FornecedorDetail | null>;
  topDeputies(
    input: FornecedorTopDeputiesInput,
  ): Promise<FornecedorTopDeputy[]>;
}

function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, "\\$&");
}

function parseMonth(value: string): { ano: number; mes: number } {
  const [ano, mes] = value.split("-").map(Number);
  return { ano, mes };
}

export function createFornecedorRepository(
  db: Database,
): IFornecedorRepository {
  return {
    async list(input): Promise<FornecedorListResult> {
      const conditions: SQL[] = [];

      if (input.busca) {
        const pattern = `%${escapeLike(input.busca)}%`;
        const match = or(
          ilike(fornecedores.nome, pattern),
          ilike(fornecedores.cnpjCpf, pattern),
        );
        if (match) conditions.push(match);
      }

      const where: SQL | undefined =
        conditions.length > 0 ? and(...conditions) : undefined;
      const totalBrutoExpression = sql`coalesce(${sum(despesas.valorDocumento)}, 0)`;
      const orderColumn =
        input.ordenarPor === "totalBruto"
          ? totalBrutoExpression
          : input.ordenarPor === "cnpjCpf"
            ? fornecedores.cnpjCpf
            : fornecedores.nome;
      const primaryOrder: SQL =
        input.ordem === "desc"
          ? sql`${orderColumn} desc nulls last`
          : sql`${orderColumn} asc nulls last`;

      const [rows, totals] = await Promise.all([
        db
          .select({
            id: fornecedores.id,
            nome: fornecedores.nome,
            cnpjCpf: fornecedores.cnpjCpf,
            totalBruto: totalBrutoExpression,
            totalDespesas: count(despesas.id),
          })
          .from(fornecedores)
          .leftJoin(
            despesas,
            eq(despesas.fornecedorId, sql`${fornecedores.id}`),
          )
          .where(where)
          .groupBy(fornecedores.id, fornecedores.nome, fornecedores.cnpjCpf)
          .orderBy(primaryOrder, asc(fornecedores.id))
          .limit(input.itens)
          .offset((input.pagina - 1) * input.itens),
        db.select({ total: count() }).from(fornecedores).where(where),
      ]);

      const serviceTypes =
        rows.length > 0
          ? await db
              .select({
                fornecedorId: despesas.fornecedorId,
                tipoDespesa: tiposDespesa.nome,
              })
              .from(despesas)
              .innerJoin(
                tiposDespesa,
                eq(tiposDespesa.id, despesas.tipoDespesaId),
              )
              .where(
                inArray(
                  despesas.fornecedorId,
                  rows.map((row) => Number(row.id)),
                ),
              )
              .groupBy(despesas.fornecedorId, tiposDespesa.nome)
              .orderBy(
                despesas.fornecedorId,
                sql`count(*) desc`,
                asc(tiposDespesa.nome),
              )
          : [];
      const primaryServiceBySupplier = new Map<number, string>();
      for (const serviceType of serviceTypes) {
        if (!primaryServiceBySupplier.has(serviceType.fornecedorId)) {
          primaryServiceBySupplier.set(
            serviceType.fornecedorId,
            serviceType.tipoDespesa,
          );
        }
      }

      const total = totals[0]?.total ?? 0;

      return fornecedorListResultSchema.parse({
        items: rows.map((row) => ({
          id: String(row.id),
          nome: row.nome,
          cnpjCpf: row.cnpjCpf,
          totalBruto: Number(row.totalBruto),
          totalDespesas: row.totalDespesas,
          tipoDespesaPrincipal:
            primaryServiceBySupplier.get(Number(row.id)) ?? null,
        })),
        total,
        pagina: input.pagina,
        itens: input.itens,
        totalPaginas: Math.max(1, Math.ceil(total / input.itens)),
      });
    },

    async detail(id): Promise<FornecedorDetail | null> {
      const rows = await db
        .select({
          id: fornecedores.id,
          nome: fornecedores.nome,
          cnpjCpf: fornecedores.cnpjCpf,
        })
        .from(fornecedores)
        .where(eq(fornecedores.id, BigInt(id)))
        .limit(1);

      const row = rows[0];
      if (!row) return null;

      return fornecedorDetailSchema.parse({
        ...row,
        id: String(row.id),
      });
    },

    async topDeputies(
      input: FornecedorTopDeputiesInput,
    ): Promise<FornecedorTopDeputy[]> {
      const filters = fornecedorTopDeputiesInputSchema.parse(input);
      const conditions = [eq(despesas.fornecedorId, filters.fornecedorId)];

      if (filters.legislaturaId) {
        conditions.push(eq(despesas.legislaturaId, filters.legislaturaId));
      }
      if (filters.tipoDespesaId) {
        conditions.push(eq(despesas.tipoDespesaId, filters.tipoDespesaId));
      }
      if (filters.fromMonth) {
        const { ano, mes } = parseMonth(filters.fromMonth);
        conditions.push(
          sql`(${despesas.ano}, ${despesas.mes}) >= (${ano}, ${mes})`,
        );
      }
      if (filters.toMonth) {
        const { ano, mes } = parseMonth(filters.toMonth);
        conditions.push(
          sql`(${despesas.ano}, ${despesas.mes}) <= (${ano}, ${mes})`,
        );
      }
      if (filters.fornecedor) {
        const pattern = `%${escapeLike(filters.fornecedor)}%`;
        const match = or(
          ilike(fornecedores.nome, pattern),
          ilike(fornecedores.cnpjCpf, pattern),
        );
        if (match) conditions.push(match);
      }

      const deputyTotal = sum(despesas.valorLiquido).as("total_liquido");
      const deputyRecords = count().as("total_registros");
      const topDeputies = db
        .select({
          deputadoId: despesas.deputadoId,
          totalLiquido: deputyTotal,
          totalRegistros: deputyRecords,
        })
        .from(despesas)
        .innerJoin(fornecedores, eq(fornecedores.id, despesas.fornecedorId))
        .where(and(...conditions))
        .groupBy(despesas.deputadoId)
        .orderBy(desc(deputyTotal), asc(despesas.deputadoId))
        .limit(5)
        .as("top_deputies");
      const rows = await db
        .select({
          deputadoId: topDeputies.deputadoId,
          nome: sql<string>`coalesce(nullif(trim(${deputadoDetalhes.nomeEleitoral}), ''), ${deputados.nome})`,
          siglaPartido: deputadoDetalhes.siglaPartido,
          siglaUf: deputadoDetalhes.siglaUf,
          urlFoto: sql<
            string | null
          >`coalesce(${deputadoDetalhes.urlFoto}, ${deputados.urlFoto})`,
          totalLiquido: topDeputies.totalLiquido,
          totalRegistros: topDeputies.totalRegistros,
        })
        .from(topDeputies)
        .innerJoin(deputados, eq(deputados.id, topDeputies.deputadoId))
        .leftJoin(
          deputadoDetalhes,
          eq(deputadoDetalhes.deputadoId, topDeputies.deputadoId),
        )
        .orderBy(desc(topDeputies.totalLiquido), asc(topDeputies.deputadoId));

      return fornecedorTopDeputiesSchema.parse(
        rows.map((row) => ({
          ...row,
          totalLiquido: Number(row.totalLiquido ?? 0),
        })),
      );
    },
  };
}
