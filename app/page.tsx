import type { Metadata } from "next";
import { DashboardView } from "./features/dashboard/DashboardView";
import { createPageMetadata } from "./lib/seo";

export const metadata: Metadata = createPageMetadata(
  "Para onde vai o dinheiro da Cota Parlamentar?",
  "Explore despesas da Cota Parlamentar (CEAP), valores declarados, parlamentares e fornecedores com dados públicos da Câmara dos Deputados.",
);

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <DashboardView />
    </div>
  );
}
