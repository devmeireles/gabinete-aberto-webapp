import { z } from "zod"

const monthSchema = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Formato esperado: AAAA-MM")

export const despesaListInputSchema = z.object({
  legislaturaId: z.number().int().positive(),
  deputadoId: z.number().int().positive().optional(),
  tipoDespesaId: z.number().int().positive().optional(),
  fromMonth: monthSchema.optional(),
  toMonth: monthSchema.optional(),
  fornecedor: z.string().trim().min(2).max(100).optional(),
  ordenarPor: z.enum(["dataDocumento", "valorLiquido", "valorDocumento"]).default("dataDocumento"),
  ordem: z.enum(["asc", "desc"]).default("desc"),
  pagina: z.number().int().min(1).default(1),
  itens: z.number().int().min(1).max(100).default(20),
})

export const despesaItemSchema = z.object({
  id: z.string(), // bigint do banco serializado como string
  deputadoId: z.number().int(),
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
})

export const despesaListResultSchema = z.object({
  items: z.array(despesaItemSchema),
  total: z.number().int(),
  totalLiquido: z.number(),
  pagina: z.number().int(),
  itens: z.number().int(),
  totalPaginas: z.number().int(),
})

export const tipoDespesaSchema = z.object({
  id: z.number().int(),
  nome: z.string(),
})

export type DespesaListInput = z.infer<typeof despesaListInputSchema>
export type DespesaItem = z.infer<typeof despesaItemSchema>
export type DespesaListResult = z.infer<typeof despesaListResultSchema>
export type TipoDespesa = z.infer<typeof tipoDespesaSchema>