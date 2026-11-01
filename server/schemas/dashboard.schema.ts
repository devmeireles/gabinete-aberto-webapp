import { z } from "zod";

export const dashboardMetricsInputSchema = z.void();

export const dashboardMetricsSchema = z.object({
  periodo: z.object({
    dataInicio: z.string(),
    dataFim: z.string().nullable(),
  }),
  totais: z.object({
    totalBruto: z.number(),
    totalGlosa: z.number(),
    totalLiquido: z.number(),
    totalRegistros: z.number().int(),
    totalParlamentares: z.number().int(),
    parlamentaresComDespesas: z.number().int(),
    partidosComDespesas: z.number().int(),
    mediaPorParlamentar: z.number(),
  }),
  evolucaoMensal: z.array(
    z.object({
      ano: z.number().int(),
      mes: z.number().int(),
      totalLiquido: z.number(),
      totalRegistros: z.number().int(),
    }),
  ),
  distribuicaoPorTipo: z.array(
    z.object({
      tipoDespesaId: z.number().int(),
      tipoDespesa: z.string(),
      totalLiquido: z.number(),
      totalRegistros: z.number().int(),
    }),
  ),
  despesasPorUf: z.array(
    z.object({
      siglaUf: z.string().length(2),
      totalLiquido: z.number(),
      totalRegistros: z.number().int(),
      totalParlamentares: z.number().int(),
    }),
  ),
  despesasSemUf: z.object({
    totalLiquido: z.number(),
    totalRegistros: z.number().int(),
  }),
  maioresGastosPartidos: z.array(
    z.object({
      partidoId: z.number().int(),
      sigla: z.string(),
      nome: z.string(),
      totalLiquido: z.number(),
      totalRegistros: z.number().int(),
      parlamentaresComDespesas: z.number().int(),
    }),
  ),
});

export type DashboardMetricsInput = z.infer<typeof dashboardMetricsInputSchema>;
export type DashboardMetrics = z.infer<typeof dashboardMetricsSchema>;
