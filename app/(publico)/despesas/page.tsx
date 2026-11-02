import type { Metadata } from "next";

import { DespesasFiltersProvider } from "@/app/contexts/despesas-filters.context";
import { DespesasView } from "@/app/features/despesas/DespesasView";
import { createPageMetadata } from "@/app/lib/seo";

export const metadata: Metadata = createPageMetadata(
  "Despesas da Cota Parlamentar (CEAP)",
  "Consulte despesas da Cota para o Exercício da Atividade Parlamentar (CEAP), valores brutos, glosas, valores líquidos e documentos fiscais.",
);

export default function DespesasPage() {
  return (
    <DespesasFiltersProvider>
      <DespesasView />
    </DespesasFiltersProvider>
  );
}
