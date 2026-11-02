import { z } from "zod";

const monthSchema = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Formato esperado: AAAA-MM");

export const DESPESA_ORDENAR_POR = [
  "dataDocumento",
  "deputadoNome",
  "tipoDespesa",
  "fornecedorNome",
  "valorDocumento",
  "valorGlosa",
  "valorLiquido",
] as const;

export const despesaListInputSchema = z.object({
  legislaturaId: z.number().int().positive().optional(),
  deputadoId: z.number().int().positive().optional(),
  fornecedorId: z.number().int().positive().safe().optional(),
  tipoDespesaId: z.number().int().positive().optional(),
  fromMonth: monthSchema.optional(),
  toMonth: monthSchema.optional(),
  fornecedor: z.string().trim().min(2).max(100).optional(),
  ordenarPor: z.enum(DESPESA_ORDENAR_POR).default("dataDocumento"),
  ordem: z.enum(["asc", "desc"]).default("desc"),
  pagina: z.number().int().min(1).default(1),
  itens: z.number().int().min(1).max(100).default(20),
});

export const despesaAnalyticsInputSchema = z.object({
  legislaturaId: z.number().int().positive(),
  deputadoId: z.number().int().positive(),
  fornecedorId: z.number().int().positive().safe().optional(),
  tipoDespesaId: z.number().int().positive().optional(),
  fromMonth: monthSchema.optional(),
  toMonth: monthSchema.optional(),
  fornecedor: z.string().trim().min(2).max(100).optional(),
});

export const despesaAnalyticsResultSchema = z.object({
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
  maioresFornecedores: z.array(
    z.object({
      fornecedorId: z.number().int(),
      nome: z.string(),
      cnpjCpf: z.string(),
      totalLiquido: z.number(),
      totalRegistros: z.number().int(),
    }),
  ),
});

export const despesaItemSchema = z.object({
  id: z.string(), // bigint do banco serializado como string
  deputadoId: z.number().int(),
  fornecedorId: z.string(),
  deputadoNome: z.string(),
  ano: z.number().int(),
  mes: z.number().int(),
  dataDocumento: z.string().nullable(),
  tipoDespesa: z.string(),
  fornecedorNome: z.string(),
  fornecedorCnpjCpf: z.string(),
  numDocumento: z.string(),
  valorDocumento: z.number(),
  valorGlosa: z.number(),
  valorLiquido: z.number(),
  urlDocumento: z.string().nullable(),
  siglaPartido: z.string().nullable(),
  siglaUf: z.string().nullable(),
});

export const despesaListResultSchema = z.object({
  items: z.array(despesaItemSchema),
  total: z.number().int(),
  totalLiquido: z.number(),
  totalBruto: z.number(),
  totalGlosa: z.number(),
  pagina: z.number().int(),
  itens: z.number().int(),
  totalPaginas: z.number().int(),
});

export const tipoDespesaSchema = z.object({
  id: z.number().int(),
  nome: z.string(),
});

export type DespesaListInput = z.infer<typeof despesaListInputSchema>;
export type DespesaAnalyticsInput = z.infer<typeof despesaAnalyticsInputSchema>;
export type DespesaAnalyticsResult = z.infer<
  typeof despesaAnalyticsResultSchema
>;
export type DespesaItem = z.infer<typeof despesaItemSchema>;
export type DespesaListResult = z.infer<typeof despesaListResultSchema>;
export type TipoDespesa = z.infer<typeof tipoDespesaSchema>;

export type DespesaOrdenarPor = (typeof DESPESA_ORDENAR_POR)[number];
