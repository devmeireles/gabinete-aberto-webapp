import "server-only";

import { db } from "@/server/db/client";
import { createLegislaturaRepository } from "@/server/repositories/legislatura.repository";
import { createDeputadoRepository } from "@/server/repositories/deputado.repository";

import { createLegislaturaService } from "./legislatura.service";
import { createDeputadoService } from "./deputado.service";

export const legislaturaService = createLegislaturaService(
  createLegislaturaRepository(db),
);

export const deputadoService = createDeputadoService(
  createDeputadoRepository(db),
);
