import "server-only";

import {
  and,
  asc,
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
  deputadoDetalhes,
  deputados,
  deputadoPartidoVigencias,
  deputadoLegislaturas,
  despesas,
  fornecedores,
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
      const stateUf = sql<
        string | null
      >`nullif(upper(trim(${deputadoLegislaturas.siglaUf})), '')`;

      const [
        totalsRows,
        monthlyRows,
        categoryRows,
        stateRows,
        partyRows,
        membersRows,
        deputyRows,
        supplierRows,
      ] = await Promise.all([
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
          .innerJoin(tiposDespesa, eq(tiposDespesa.id, despesas.tipoDespesaId))
          .where(where)
          .groupBy(tiposDespesa.id, tiposDespesa.nome)
          .orderBy(desc(sum(despesas.valorLiquido))),

        db
          .select({
            siglaUf: stateUf,
            totalLiquido: sum(despesas.valorLiquido),
            totalRegistros: count(despesas.id),
            totalParlamentares: countDistinct(deputadoLegislaturas.deputadoId),
          })
          .from(deputadoLegislaturas)
          .leftJoin(
            despesas,
            and(
              eq(despesas.deputadoId, deputadoLegislaturas.deputadoId),
              eq(despesas.legislaturaId, deputadoLegislaturas.legislaturaId),
            ),
          )
          .where(eq(deputadoLegislaturas.legislaturaId, currentLegislatura.id))
          .groupBy(stateUf),

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
          .where(eq(deputadoLegislaturas.legislaturaId, currentLegislatura.id)),

        db
          .select({
            deputadoId: despesas.deputadoId,
            nome: sql<string>`coalesce(nullif(trim(${deputadoDetalhes.nomeEleitoral}), ''), ${deputados.nome})`,
            siglaPartido: deputadoDetalhes.siglaPartido,
            siglaUf: deputadoDetalhes.siglaUf,
            urlFoto: deputadoDetalhes.urlFoto,
            totalLiquido: sum(despesas.valorLiquido),
            totalRegistros: count(),
          })
          .from(despesas)
          .innerJoin(deputados, eq(deputados.id, despesas.deputadoId))
          .leftJoin(
            deputadoDetalhes,
            and(
              eq(deputadoDetalhes.deputadoId, despesas.deputadoId),
              eq(deputadoDetalhes.statusLegislaturaId, currentLegislatura.id),
            ),
          )
          .where(where)
          .groupBy(
            despesas.deputadoId,
            deputados.nome,
            deputadoDetalhes.nomeEleitoral,
            deputadoDetalhes.siglaPartido,
            deputadoDetalhes.siglaUf,
            deputadoDetalhes.urlFoto,
          )
          .orderBy(desc(sum(despesas.valorLiquido)), asc(despesas.deputadoId))
          .limit(5),

        db
          .select({
            fornecedorId: fornecedores.id,
            nome: fornecedores.nome,
            cnpjCpf: fornecedores.cnpjCpf,
            totalLiquido: sum(despesas.valorLiquido),
            parlamentaresComDespesas: countDistinct(despesas.deputadoId),
          })
          .from(despesas)
          .innerJoin(fornecedores, eq(fornecedores.id, despesas.fornecedorId))
          .where(where)
          .groupBy(fornecedores.id, fornecedores.nome, fornecedores.cnpjCpf)
          .orderBy(desc(sum(despesas.valorLiquido)), asc(fornecedores.id))
          .limit(5),
      ]);

      const totals = totalsRows[0];
      const totalLiquido = Number(totals?.totalLiquido ?? 0);
      const totalParlamentares = membersRows[0]?.total ?? 0;
      const unassignedStateTotals = stateRows.find(
        (row) => row.siglaUf === null,
      );

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
        despesasPorUf: stateRows
          .filter(
            (row): row is typeof row & { siglaUf: string } =>
              row.siglaUf !== null,
          )
          .map((row) => ({
            siglaUf: row.siglaUf.trim(),
            totalLiquido: Number(row.totalLiquido ?? 0),
            totalRegistros: row.totalRegistros,
            totalParlamentares: row.totalParlamentares,
          })),
        despesasSemUf: {
          totalLiquido: Number(unassignedStateTotals?.totalLiquido ?? 0),
          totalRegistros: unassignedStateTotals?.totalRegistros ?? 0,
        },
        maioresGastosPartidos: partyRows.map((row) => ({
          partidoId: row.partidoId,
          sigla: row.sigla,
          nome: row.nome,
          totalLiquido: Number(row.totalLiquido ?? 0),
          totalRegistros: row.totalRegistros,
          parlamentaresComDespesas: row.parlamentaresComDespesas,
        })),
        maioresGastosParlamentares: deputyRows.map((row) => ({
          deputadoId: row.deputadoId,
          nome: row.nome,
          siglaPartido: row.siglaPartido,
          siglaUf: row.siglaUf,
          urlFoto: row.urlFoto,
          totalLiquido: Number(row.totalLiquido ?? 0),
          totalRegistros: row.totalRegistros,
        })),
        maioresGastosFornecedores: supplierRows.map((row) => ({
          fornecedorId: Number(row.fornecedorId),
          nome: row.nome,
          cnpjCpf: row.cnpjCpf,
          totalLiquido: Number(row.totalLiquido ?? 0),
          parlamentaresComDespesas: row.parlamentaresComDespesas,
        })),
      });
    },
  };
}
