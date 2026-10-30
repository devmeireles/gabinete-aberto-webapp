import "server-only";

import type { IDeputadoRepository } from "@/server/repositories/deputado.repository";
import type { Deputado } from "@/server/schemas/deputado.schema";
import { DeputadoDetalhe } from "../schemas/deputado-detalhe.schema";

export interface IDeputadoService {
  list(): Promise<Deputado[]>;
  detail(id: number): Promise<DeputadoDetalhe | null>;
}

export function createDeputadoService(
  repository: IDeputadoRepository,
): IDeputadoService {
  return {
    list() {
      return repository.list();
    },
    detail(id) {
      return repository.detail(id);
    },
  };
}
