import "server-only";

import { db } from "@/server/db/client";
import { createLegislaturaRepository } from "@/server/repositories/legislatura.repository";
import { createDeputadoRepository } from "@/server/repositories/deputado.repository";

import { createLegislaturaService } from "./legislatura.service";
import { createDeputadoService } from "./deputado.service";
import { createDespesaRepository } from "../repositories/despesa.repository";
import { createDespesaService } from "./despesa.service";
import { createFornecedorRepository } from "../repositories/fornecedor.repository";
import { createFornecedorService } from "./fornecedor.service";

export const legislaturaService = createLegislaturaService(
  createLegislaturaRepository(db),
);

export const deputadoService = createDeputadoService(
  createDeputadoRepository(db),
);

export const despesaService = createDespesaService(createDespesaRepository(db));

export const fornecedorService = createFornecedorService(
  createFornecedorRepository(db),
);
