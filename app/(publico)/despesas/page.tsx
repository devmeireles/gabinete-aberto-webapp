import { DespesasFiltersProvider } from "@/app/contexts/despesas-filters.context";
import { DespesasView } from "@/app/features/despesas/DespesasView";

export default function DespesasPage() {
  return (
    <DespesasFiltersProvider>
      <DespesasView />
    </DespesasFiltersProvider>
  );
}
