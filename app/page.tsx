import { DashboardFiltersProvider } from "./contexts/dashboard-filters.context";
import { DashboardView } from "./features/dashboard/DashboardView";

export default function Home() {
  return (
    <DashboardFiltersProvider>
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <DashboardView />
      </div>
    </DashboardFiltersProvider>
  );
}
