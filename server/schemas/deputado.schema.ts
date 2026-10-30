import { z } from "zod";

export const deputadoSchema = z.object({
  id: z.number().int(),
  nome: z.string(),
  urlFoto: z.string(),
  siglaPartido: z.string(),
  situacao: z.string(),
  siglaUf: z.string(),
});

export type Deputado = z.infer<typeof deputadoSchema>;
