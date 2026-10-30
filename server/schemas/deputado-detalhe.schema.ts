import { z } from "zod";

export const gabineteSchema = z.object({
  nome: z.string().nullable(),
  predio: z.string().nullable(),
  sala: z.string().nullable(),
  andar: z.string().nullable(),
  telefone: z.string().nullable(),
  email: z.string().nullable(),
});

export const deputadoPerfilSchema = z.object({
  id: z.number().int(),
  nome: z.string(),
  urlFoto: z.string().nullable(),
  nomeCivil: z.string().nullable(),
  nomeEleitoral: z.string().nullable(),
  sexo: z.string().nullable(),
  dataNascimento: z.string().nullable(),
  dataFalecimento: z.string().nullable(),
  ufNascimento: z.string().nullable(),
  municipioNascimento: z.string().nullable(),
  escolaridade: z.string().nullable(),
  urlWebsite: z.string().nullable(),
  redesSociais: z.array(z.string()),
  siglaPartido: z.string().nullable(),
  siglaUf: z.string().nullable(),
  situacao: z.string().nullable(),
  condicaoEleitoral: z.string().nullable(),
  gabinete: gabineteSchema,
  updatedAt: z.string().nullable(),
  dataStatus: z.string().nullable(),
});

export const deputadoLegislaturaSchema = z.object({
  legislaturaId: z.number().int(),
  siglaUf: z.string().nullable(),
  email: z.string().nullable(),
  dataInicio: z.string(),
  dataFim: z.string().nullable(),
});

export const deputadoFiliacaoSchema = z.object({
  legislaturaId: z.number().int(),
  partidoId: z.number().int().nullable(),
  siglaPartido: z.string().nullable(),
  nomePartido: z.string().nullable(),
  dataInicio: z.string().nullable(),
  dataFim: z.string().nullable(),
});

export const deputadoDetalheSchema = z.object({
  perfil: deputadoPerfilSchema,
  legislaturas: z.array(deputadoLegislaturaSchema),
  filiacoes: z.array(deputadoFiliacaoSchema),
});

export type DeputadoPerfil = z.infer<typeof deputadoPerfilSchema>;
export type DeputadoLegislatura = z.infer<typeof deputadoLegislaturaSchema>;
export type DeputadoFiliacao = z.infer<typeof deputadoFiliacaoSchema>;
export type DeputadoDetalhe = z.infer<typeof deputadoDetalheSchema>;
export type Gabinete = z.infer<typeof gabineteSchema>;
