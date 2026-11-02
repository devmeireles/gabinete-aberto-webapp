import type { Metadata } from "next";

import { DeputadosFiltersProvider } from "@/app/contexts/deputados-filters.context";
import { DeputadosView } from "@/app/features/deputados/DeputadosView";
import { createPageMetadata } from "@/app/lib/seo";

export const metadata: Metadata = createPageMetadata(
  "Deputados federais",
  "Consulte perfis parlamentares, partidos, estados e histórico dos deputados federais.",
);

export default function DeputadosPage() {
  return (
    <DeputadosFiltersProvider>
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <DeputadosView />
      </div>
    </DeputadosFiltersProvider>
  );
}
