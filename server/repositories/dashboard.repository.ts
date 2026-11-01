import "server-only";

import {
  and,
  count,
  countDistinct,
  desc,
  eq,
  isNull,
  lte,
  or,
  sql,
  sum,
} from "drizzle-orm";

import type { Database } from "@/server/db/client";
import {
  deputadoPartidoVigencias,
  deputadoLegislaturas,
  despesas,
  legislaturas,
  partidoLegislaturas,
  partidos,
  tiposDespesa,
} from "@/drizzle/schema";
import {
  dashboardMetricsSchema,
  type DashboardMetrics,
} from "@/server/schemas/dashboard.schema";

export interface IDashboardRepository {
  metrics(): Promise<DashboardMetrics>;
}

export function createDashboardRepository(db: Database): IDashboardRepository {
  return {
    async metrics(): Promise<DashboardMetrics> {
      const currentLegislaturas = await db
        .select({
          id: legislaturas.id,
          dataInicio: legislaturas.dataInicio,
          dataFim: legislaturas.dataFim,
        })
        .from(legislaturas)
        .where(eq(legislaturas.legislaturaAtual, true))
        .limit(2);

      if (currentLegislaturas.length !== 1) {
        throw new Error(
          currentLegislaturas.length === 0
            ? "Não há legislatura vigente cadastrada."
            : "Há mais de uma legislatura vigente cadastrada.",
        );
      }
      const currentLegislatura = currentLegislaturas[0];
      const where = eq(despesas.legislaturaId, currentLegislatura.id);
      const competenceDate = sql`coalesce(${despesas.dataDocumento}::date, make_date(${despesas.ano}, ${despesas.mes}, 1))`;

      const [totalsRows, monthlyRows, categoryRows, partyRows, membersRows] =
        await Promise.all([
          db
            .select({
              totalRegistros: count(),
              totalBruto: sum(despesas.valorDocumento),
              totalGlosa: sum(despesas.valorGlosa),
              totalLiquido: sum(despesas.valorLiquido),
              parlamentaresComDespesas: countDistinct(despesas.deputadoId),
            })
            .from(despesas)
            .where(where),

          db
            .select({
              ano: despesas.ano,
              mes: despesas.mes,
              totalLiquido: sum(despesas.valorLiquido),
              totalRegistros: count(),
            })
            .from(despesas)
            .where(where)
            .groupBy(despesas.ano, despesas.mes)
            .orderBy(despesas.ano, despesas.mes),

          db
            .select({
              tipoDespesaId: tiposDespesa.id,
              tipoDespesa: tiposDespesa.nome,
              totalLiquido: sum(despesas.valorLiquido),
              totalRegistros: count(),
            })
            .from(despesas)
            .innerJoin(
              tiposDespesa,
              eq(tiposDespesa.id, despesas.tipoDespesaId),
            )
            .where(where)
            .groupBy(tiposDespesa.id, tiposDespesa.nome)
            .orderBy(desc(sum(despesas.valorLiquido))),

          db
            .select({
              partidoId: partidos.id,
              sigla: partidos.sigla,
              nome: partidos.nome,
              totalLiquido: sum(despesas.valorLiquido),
              totalRegistros: count(),
              parlamentaresComDespesas: countDistinct(
                deputadoPartidoVigencias.deputadoId,
              ),
            })
            .from(despesas)
            .innerJoin(
              deputadoPartidoVigencias,
              and(
                eq(deputadoPartidoVigencias.deputadoId, despesas.deputadoId),
                eq(
                  deputadoPartidoVigencias.legislaturaId,
                  despesas.legislaturaId,
                ),
                or(
                  isNull(deputadoPartidoVigencias.dataInicio),
                  lte(deputadoPartidoVigencias.dataInicio, competenceDate),
                ),
                sql`(${deputadoPartidoVigencias.dataFim} IS NULL OR ${deputadoPartidoVigencias.dataFim} >= ${competenceDate})`,
              ),
            )
            .innerJoin(
              partidos,
              eq(partidos.id, deputadoPartidoVigencias.partidoId),
            )
            .innerJoin(
              partidoLegislaturas,
              and(
                eq(partidoLegislaturas.partidoId, partidos.id),
                eq(partidoLegislaturas.legislaturaId, despesas.legislaturaId),
              ),
            )
            .where(where)
            .groupBy(partidos.id, partidos.sigla, partidos.nome)
            .orderBy(desc(sum(despesas.valorLiquido))),

          db
            .select({ total: count() })
            .from(deputadoLegislaturas)
            .where(
              eq(deputadoLegislaturas.legislaturaId, currentLegislatura.id),
            ),
        ]);

      const totals = totalsRows[0];
      const totalLiquido = Number(totals?.totalLiquido ?? 0);
      const totalParlamentares = membersRows[0]?.total ?? 0;

      return dashboardMetricsSchema.parse({
        periodo: {
          dataInicio: currentLegislatura.dataInicio,
          dataFim: currentLegislatura.dataFim,
        },
        totais: {
          totalBruto: Number(totals?.totalBruto ?? 0),
          totalGlosa: Number(totals?.totalGlosa ?? 0),
          totalLiquido,
          totalRegistros: totals?.totalRegistros ?? 0,
          totalParlamentares,
          parlamentaresComDespesas: totals?.parlamentaresComDespesas ?? 0,
          partidosComDespesas: partyRows.length,
          mediaPorParlamentar:
            totalParlamentares > 0 ? totalLiquido / totalParlamentares : 0,
        },
        evolucaoMensal: monthlyRows.map((row) => ({
          ano: row.ano,
          mes: row.mes,
          totalLiquido: Number(row.totalLiquido ?? 0),
          totalRegistros: row.totalRegistros,
        })),
        distribuicaoPorTipo: categoryRows.map((row) => ({
          tipoDespesaId: Number(row.tipoDespesaId),
          tipoDespesa: row.tipoDespesa,
          totalLiquido: Number(row.totalLiquido ?? 0),
          totalRegistros: row.totalRegistros,
        })),
        maioresGastosPartidos: partyRows.map((row) => ({
          partidoId: row.partidoId,
          sigla: row.sigla,
          nome: row.nome,
          totalLiquido: Number(row.totalLiquido ?? 0),
          totalRegistros: row.totalRegistros,
          parlamentaresComDespesas: row.parlamentaresComDespesas,
        })),
      });
    },
  };
}
