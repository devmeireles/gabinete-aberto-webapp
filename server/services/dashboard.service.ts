import "server-only";

import type { IDashboardRepository } from "@/server/repositories/dashboard.repository";
import type { DashboardMetrics } from "@/server/schemas/dashboard.schema";

export interface IDashboardService {
  metrics(): Promise<DashboardMetrics>;
}

export function createDashboardService(
  repository: IDashboardRepository,
): IDashboardService {
  return {
    metrics() {
      return repository.metrics();
    },
  };
}
