import { z } from "zod";

export const legislaturaSchema = z.object({
  id: z.number().int(),
  dataInicio: z.string(),
  dataFim: z.string().nullable(),
  legislaturaAtual: z.boolean(),
});

export type Legislatura = z.infer<typeof legislaturaSchema>;
