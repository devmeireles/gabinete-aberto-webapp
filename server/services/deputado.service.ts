import "server-only";

import type { IDeputadoRepository } from "@/server/repositories/deputado.repository";
import type { Deputado } from "@/server/schemas/deputado.schema";

export interface IDeputadoService {
  list(): Promise<Deputado[]>;
}

export function createDeputadoService(
  repository: IDeputadoRepository,
): IDeputadoService {
  return {
    list() {
      return repository.list();
    },
  };
}
