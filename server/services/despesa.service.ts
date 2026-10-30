import "server-only"

import type { IDespesaRepository } from "@/server/repositories/despesa.repository"
import type {
  DespesaListInput,
  DespesaListResult,
  TipoDespesa,
} from "@/server/schemas/despesa.schema"

/** Business logic for despesas. */
export interface IDespesaService {
  list(input: DespesaListInput): Promise<DespesaListResult>
  listTipos(): Promise<TipoDespesa[]>
}

export function createDespesaService(repository: IDespesaRepository): IDespesaService {
  return {
    list(input) {
      // Intervalo invertido (de > até) não é erro: devolve vazio em vez de lançar.
      return repository.list(input)
    },
    listTipos() {
      return repository.listTipos()
    },
  }
}