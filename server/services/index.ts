import "server-only";

import { db } from "@/server/db/client";
import { createLegislaturaRepository } from "@/server/repositories/legislatura.repository";

import { createLegislaturaService } from "./legislatura.service";

export const legislaturaService = createLegislaturaService(
  createLegislaturaRepository(db),
);
