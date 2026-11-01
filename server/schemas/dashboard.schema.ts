import { z } from "zod";

const monthSchema = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Formato esperado: AAAA-MM");

export const dashboardMetricsInputSchema = z
  .object({
    legislaturaId: z.number().int().positive(),
    fromMonth: monthSchema,
    toMonth: monthSchema.optional(),
  })
  .refine((input) => !input.toMonth || input.fromMonth <= input.toMonth, {
    message: "O mês inicial deve ser anterior ou igual ao mês final.",
    path: ["toMonth"],
  });

export const dashboardMetricsSchema = z.object({
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
