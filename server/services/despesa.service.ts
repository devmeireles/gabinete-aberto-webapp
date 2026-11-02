import "server-only";

import type { IDespesaRepository } from "@/server/repositories/despesa.repository";
import type {
  DespesaAnalyticsInput,
  DespesaAnalyticsResult,
  DespesaListInput,
  DespesaListResult,
  TipoDespesa,
} from "@/server/schemas/despesa.schema";

/** Business logic for despesas. */
export interface IDespesaService {
  list(input: DespesaListInput): Promise<DespesaListResult>;
  analytics(input: DespesaAnalyticsInput): Promise<DespesaAnalyticsResult>;
  listTipos(): Promise<TipoDespesa[]>;
}

export function createDespesaService(
  repository: IDespesaRepository,
): IDespesaService {
  return {
    list(input) {
      // Intervalo invertido (de > até) não é erro: devolve vazio em vez de lançar.
      return repository.list(input);
    },
    analytics(input) {
      return repository.analytics(input);
    },
    listTipos() {
      return repository.listTipos();
    },
  };
}
