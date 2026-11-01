import "server-only";

import {
  and,
  asc,
  count,
  desc,
  eq,
  ilike,
  or,
  sql,
  sum,
  type SQL,
} from "drizzle-orm";

import type { Database } from "@/server/db/client";
import {
  deputadoDetalhes,
  deputadoLegislaturas,
  deputados,
  despesas,
  fornecedores,
  tiposDespesa,
} from "@/drizzle/schema";
import {
  despesaListResultSchema,
  DespesaOrdenarPor,
  tipoDespesaSchema,
  type DespesaListInput,
  type DespesaListResult,
  type TipoDespesa,
} from "@/server/schemas/despesa.schema";

/** Data access for despesas (cota parlamentar). */
export interface IDespesaRepository {
  list(input: DespesaListInput): Promise<DespesaListResult>;
  listTipos(): Promise<TipoDespesa[]>;
}

const ORDER_COLUMNS = {
  dataDocumento: despesas.dataDocumento,
  deputadoNome: deputados.nome,
  tipoDespesa: tiposDespesa.nome,
  fornecedorNome: fornecedores.nome,
  valorDocumento: despesas.valorDocumento,
  valorGlosa: despesas.valorGlosa,
  valorLiquido: despesas.valorLiquido,
} satisfies Record<DespesaOrdenarPor, unknown>;

function parseMonth(value: string): { ano: number; mes: number } {
  const [ano, mes] = value.split("-").map(Number);
  return { ano, mes };
}

/** Escapa curingas do LIKE para o texto digitado ser literal. */
function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, "\\$&");
}

export function createDespesaRepository(db: Database): IDespesaRepository {
  return {
    async list(input: DespesaListInput): Promise<DespesaListResult> {
      const conditions: SQL[] = [];

      if (input.legislaturaId) {
        conditions.push(eq(despesas.legislaturaId, input.legislaturaId));
      }
      if (input.deputadoId) {
        conditions.push(eq(despesas.deputadoId, input.deputadoId));
      }
      if (input.fornecedorId) {
        conditions.push(eq(despesas.fornecedorId, input.fornecedorId));
      }
      if (input.tipoDespesaId) {
        conditions.push(eq(despesas.tipoDespesaId, input.tipoDespesaId));
      }
      if (input.fromMonth) {
        const { ano, mes } = parseMonth(input.fromMonth);
        // Comparação de tupla: o Postgres consegue usar o índice (legislatura, ano, mes).
        conditions.push(
          sql`(${despesas.ano}, ${despesas.mes}) >= (${ano}, ${mes})`,
        );
      }
      if (input.toMonth) {
        const { ano, mes } = parseMonth(input.toMonth);
        conditions.push(
          sql`(${despesas.ano}, ${despesas.mes}) <= (${ano}, ${mes})`,
        );
      }
      if (input.fornecedor) {
        const pattern: string = `%${escapeLike(input.fornecedor)}%`;
        const match: SQL | undefined = or(
          ilike(fornecedores.nome, pattern),
          ilike(fornecedores.cnpjCpf, pattern),
        );
        if (match) conditions.push(match);
      }

      const where: SQL | undefined = and(...conditions);

      // `nulls last`: no Postgres, DESC põe NULL primeiro, e dataDocumento é nullable.
      const orderColumn = ORDER_COLUMNS[input.ordenarPor];
      const orderBy: SQL =
        input.ordem === "asc"
          ? sql`${orderColumn} asc nulls last`
          : sql`${orderColumn} desc nulls last`;

      const [rows, totals] = await Promise.all([
        db
          .select({
            id: despesas.id,
            deputadoId: despesas.deputadoId,
            fornecedorId: despesas.fornecedorId,
            deputadoNome: deputados.nome,
            siglaPartido: deputadoDetalhes.siglaPartido,
            siglaUf: deputadoLegislaturas.siglaUf,
            ano: despesas.ano,
            mes: despesas.mes,
            dataDocumento: despesas.dataDocumento,
            tipoDespesa: tiposDespesa.nome,
            fornecedorNome: fornecedores.nome,
            fornecedorCnpjCpf: fornecedores.cnpjCpf,
            numDocumento: despesas.numDocumento,
            valorDocumento: despesas.valorDocumento,
            valorGlosa: despesas.valorGlosa,
            valorLiquido: despesas.valorLiquido,
            urlDocumento: despesas.urlDocumento,
          })
          .from(despesas)
          .innerJoin(tiposDespesa, eq(tiposDespesa.id, despesas.tipoDespesaId))
          .innerJoin(fornecedores, eq(fornecedores.id, despesas.fornecedorId))
          .innerJoin(deputados, eq(deputados.id, despesas.deputadoId))
          .leftJoin(
            deputadoDetalhes,
            eq(deputadoDetalhes.deputadoId, despesas.deputadoId),
          )
          .leftJoin(
            deputadoLegislaturas,
            and(
              eq(deputadoLegislaturas.deputadoId, despesas.deputadoId),
              eq(deputadoLegislaturas.legislaturaId, despesas.legislaturaId),
            ),
          )
          .where(where)
          // O desempate por id mantém a paginação estável entre páginas.
          .orderBy(orderBy, desc(despesas.id))
          .limit(input.itens)
          .offset((input.pagina - 1) * input.itens),

        db
          .select({
            total: count(),
            totalLiquido: sum(despesas.valorLiquido),
            totalBruto: sum(despesas.valorDocumento),
            totalGlosa: sum(despesas.valorGlosa),
          })
          .from(despesas)
          .innerJoin(fornecedores, eq(fornecedores.id, despesas.fornecedorId))
          .where(where),
      ]);

      const total: number = totals[0]?.total ?? 0;

      return despesaListResultSchema.parse({
        items: rows.map((row) => ({
          ...row,
          id: String(row.id),
          fornecedorId: String(row.fornecedorId),
          valorDocumento: Number(row.valorDocumento),
          valorGlosa: Number(row.valorGlosa),
          valorLiquido: Number(row.valorLiquido),
        })),
        total,
        totalLiquido: Number(totals[0]?.totalLiquido ?? 0),
        totalBruto: Number(totals[0]?.totalBruto ?? 0),
        totalGlosa: Number(totals[0]?.totalGlosa ?? 0),
        pagina: input.pagina,
        itens: input.itens,
        totalPaginas: Math.max(1, Math.ceil(total / input.itens)),
      });
    },

    async listTipos(): Promise<TipoDespesa[]> {
      const rows = await db
        .select()
        .from(tiposDespesa)
        .orderBy(asc(tiposDespesa.nome));

      return tipoDespesaSchema
        .array()
        .parse(rows.map((row) => ({ id: Number(row.id), nome: row.nome })));
    },
  };
}
