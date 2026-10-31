import "server-only";

import type { IDeputadoRepository } from "@/server/repositories/deputado.repository";
import type {
  DeputadoListResult,
  DeputadoListInput,
  DeputadoFiltroOpcoes,
} from "@/server/schemas/deputado.schema";
import { DeputadoDetalhe } from "../schemas/deputado-detalhe.schema";

export interface IDeputadoService {
  list(input: DeputadoListInput): Promise<DeputadoListResult>;
  detail(id: number): Promise<DeputadoDetalhe | null>;
  opcoesFiltro(): Promise<DeputadoFiltroOpcoes>;
}

export function createDeputadoService(
  repository: IDeputadoRepository,
): IDeputadoService {
  return {
    list(input) {
      return repository.list(input);
    },
    detail(id) {
      return repository.detail(id);
    },
    opcoesFiltro() {
      return repository.opcoesFiltro();
    },
  };
}
