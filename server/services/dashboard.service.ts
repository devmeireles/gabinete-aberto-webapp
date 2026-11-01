import "server-only";

import type { IDashboardRepository } from "@/server/repositories/dashboard.repository";
import type {
  DashboardMetrics,
  DashboardMetricsInput,
} from "@/server/schemas/dashboard.schema";

export interface IDashboardService {
  metrics(input: DashboardMetricsInput): Promise<DashboardMetrics>;
}

export function createDashboardService(
  repository: IDashboardRepository,
): IDashboardService {
  return {
    metrics(input) {
      return repository.metrics(input);
    },
  };
}
