import "server-only";

import { desc } from "drizzle-orm";

import type { Database } from "@/server/db/client";
import { legislaturas } from "@/drizzle/schema";
import {
  legislaturaSchema,
  type Legislatura,
} from "@/server/schemas/legislatura.schema";

export interface ILegislaturaRepository {
  list(): Promise<Legislatura[]>;
}

export function createLegislaturaRepository(
  db: Database,
): ILegislaturaRepository {
  return {
    async list(): Promise<Legislatura[]> {
      const rows = await db
        .select()
        .from(legislaturas)
        .orderBy(desc(legislaturas.id));

      return legislaturaSchema.array().parse(rows);
    },
  };
}
