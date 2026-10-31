import { z } from "zod";

export const deputadoListInputSchema = z.object({
  nome: z.string().trim().min(2).max(100).optional(),
  legislaturaId: z.number().int().positive().optional(),
  siglaUf: z.string().length(2).toUpperCase().optional(),
  siglaPartido: z.string().trim().min(1).max(20).optional(),
  siglaSexo: z.enum(["M", "F"]).optional(),
  situacao: z.string().trim().min(1).max(60).optional(),
  condicaoEleitoral: z.string().trim().min(1).max(60).optional(),
  escolaridade: z.string().trim().min(1).max(100).optional(),
  ufNascimento: z.string().length(2).toUpperCase().optional(),
  municipioNascimento: z.string().trim().min(2).max(100).optional(),
  anoNascimentoDe: z.number().int().min(1800).max(2100).optional(),
  anoNascimentoAte: z.number().int().min(1800).max(2100).optional(),
  ordenarPor: z
    .enum(["nome", "siglaPartido", "siglaUf", "dataNascimento"])
    .default("nome"),
  ordem: z.enum(["asc", "desc"]).default("asc"),
  pagina: z.number().int().min(1).default(1),
  itens: z.number().int().min(1).max(100).default(20),
});

/** Valores distintos que existem no banco, para popular os selects. */
export const deputadoFiltroOpcoesSchema = z.object({
  siglasUf: z.array(z.string()),
  siglasPartido: z.array(z.string()),
  situacoes: z.array(z.string()),
  condicoesEleitorais: z.array(z.string()),
  escolaridades: z.array(z.string()),
  ufsNascimento: z.array(z.string()),
});

export const deputadoListItemSchema = z.object({
  id: z.number().int(),
  nome: z.string(),
  urlFoto: z.string(),
  siglaPartido: z.string(),
  situacao: z.string(),
  siglaUf: z.string(),
});

export const deputadoListResultSchema = z.object({
  items: z.array(deputadoListItemSchema),
  total: z.number().int(),
  pagina: z.number().int(),
  itens: z.number().int(),
  totalPaginas: z.number().int(),
});

export type DeputadoListInput = z.infer<typeof deputadoListInputSchema>;
export type DeputadoListItem = z.infer<typeof deputadoListItemSchema>;
export type DeputadoListResult = z.infer<typeof deputadoListResultSchema>;
export type DeputadoFiltroOpcoes = z.infer<typeof deputadoFiltroOpcoesSchema>