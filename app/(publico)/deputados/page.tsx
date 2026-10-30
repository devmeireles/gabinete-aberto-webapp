import { DeputadosFiltersProvider } from "@/app/contexts/deputados-filters.context";
import { DeputadosView } from "@/app/features/deputados/DeputadosView";

export default function DeputadosPage() {
  return (
    <DeputadosFiltersProvider>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <DeputadosView />
      </div>
    </DeputadosFiltersProvider>
  );
}