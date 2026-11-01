import "server-only";

import {
  dashboardMetricsInputSchema,
  type DashboardMetrics,
} from "@/server/schemas/dashboard.schema";

import { baseProcedure, createTRPCRouter } from "../init";

export const dashboardRouter = createTRPCRouter({
  metrics: baseProcedure
    .input(dashboardMetricsInputSchema)
    .query(({ ctx }): Promise<DashboardMetrics> =>
      ctx.dashboardService.metrics(),
    ),
});
