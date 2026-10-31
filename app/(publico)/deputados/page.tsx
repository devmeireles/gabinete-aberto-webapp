import { DeputadosFiltersProvider } from "@/app/contexts/deputados-filters.context";
import { DeputadosView } from "@/app/features/deputados/DeputadosView";

export default function DeputadosPage() {
  return (
    <DeputadosFiltersProvider>
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <DeputadosView />
      </div>
    </DeputadosFiltersProvider>
  );
}
