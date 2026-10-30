import "server-only";

import type { ILegislaturaRepository } from "@/server/repositories/legislatura.repository";
import type { Legislatura } from "@/server/schemas/legislatura.schema";

export interface ILegislaturaService {
  list(): Promise<Legislatura[]>;
}

export function createLegislaturaService(
  repository: ILegislaturaRepository,
): ILegislaturaService {
  return {
    list() {
      return repository.list();
    },
  };
}
