import type { Metadata } from "next";

import { FornecedoresView } from "@/app/features/fornecedores/FornecedoresView";
import { createPageMetadata } from "@/app/lib/seo";

export const metadata: Metadata = createPageMetadata(
  "Fornecedores",
  "Pesquise fornecedores registrados nas despesas parlamentares e consulte os documentos e valores associados.",
);

export default function FornecedoresPage() {
  return <FornecedoresView />;
}
