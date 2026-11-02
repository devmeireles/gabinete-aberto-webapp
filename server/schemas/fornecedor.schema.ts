import { z } from "zod";

const fornecedorIdSchema = z
  .string()
  .regex(/^[1-9]\d*$/, "ID do fornecedor inválido")
  .refine((value) => Number.isSafeInteger(Number(value)), {
    message: "ID do fornecedor fora do intervalo permitido",
  })
  .transform(Number);

export const fornecedorListInputSchema = z.object({
  busca: z.string().trim().min(2).max(100).optional(),
  ordenarPor: z.enum(["nome", "cnpjCpf", "totalBruto"]).default("totalBruto"),
  ordem: z.enum(["asc", "desc"]).default("desc"),
  pagina: z.number().int().min(1).default(1),
  itens: z.number().int().min(1).max(100).default(20),
});

export const fornecedorDetailInputSchema = z.object({
  id: fornecedorIdSchema,
});

export const fornecedorTopDeputiesInputSchema = z.object({
  fornecedorId: z.number().int().positive().safe(),
  legislaturaId: z.number().int().positive().optional(),
  tipoDespesaId: z.number().int().positive().optional(),
  fromMonth: z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Formato esperado: AAAA-MM")
    .optional(),
  toMonth: z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Formato esperado: AAAA-MM")
    .optional(),
  fornecedor: z.string().trim().min(2).max(100).optional(),
});

export const fornecedorTopDeputiesSchema = z.array(
  z.object({
    deputadoId: z.number().int(),
    nome: z.string(),
    siglaPartido: z.string().nullable(),
    siglaUf: z.string().nullable(),
    urlFoto: z.string().nullable(),
    totalLiquido: z.number(),
    totalRegistros: z.number().int(),
  }),
);

export const fornecedorListItemSchema = z.object({
  id: z.string(),
  nome: z.string(),
  cnpjCpf: z.string(),
  totalBruto: z.number(),
  totalDespesas: z.number().int(),
  tipoDespesaPrincipal: z.string().nullable(),
});

export const fornecedorListResultSchema = z.object({
  items: z.array(fornecedorListItemSchema),
  total: z.number().int(),
  pagina: z.number().int(),
  itens: z.number().int(),
  totalPaginas: z.number().int(),
});

export const fornecedorDetailSchema = z.object({
  id: z.string(),
  nome: z.string(),
  cnpjCpf: z.string(),
});

export type FornecedorListInput = z.infer<typeof fornecedorListInputSchema>;
export type FornecedorListItem = z.infer<typeof fornecedorListItemSchema>;
export type FornecedorListResult = z.infer<typeof fornecedorListResultSchema>;
export type FornecedorDetailInput = z.infer<typeof fornecedorDetailInputSchema>;
export type FornecedorDetail = z.infer<typeof fornecedorDetailSchema>;
export type FornecedorTopDeputiesInput = z.infer<
  typeof fornecedorTopDeputiesInputSchema
>;
export type FornecedorTopDeputy = z.infer<
  typeof fornecedorTopDeputiesSchema
>[number];
export type FornecedorOrdenarPor = FornecedorListInput["ordenarPor"];
