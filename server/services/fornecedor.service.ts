import "server-only";

import type { IFornecedorRepository } from "@/server/repositories/fornecedor.repository";
import type {
  FornecedorDetail,
  FornecedorListInput,
  FornecedorListResult,
} from "@/server/schemas/fornecedor.schema";

export interface IFornecedorService {
  list(input: FornecedorListInput): Promise<FornecedorListResult>;
  detail(id: number): Promise<FornecedorDetail | null>;
}

export function createFornecedorService(
  repository: IFornecedorRepository,
): IFornecedorService {
  return {
    list(input) {
      return repository.list(input);
    },
    detail(id) {
      return repository.detail(id);
    },
  };
}
