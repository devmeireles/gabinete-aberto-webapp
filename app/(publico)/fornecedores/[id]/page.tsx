import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DetailSkeleton } from "@/app/components/ui/LoadingState";
import { FornecedorDetailView } from "@/app/features/fornecedores/FornecedorDetailView";
import { createPageMetadata } from "@/app/lib/seo";
import { fornecedorService } from "@/server/services";

export async function generateMetadata({
  params,
}: PageProps<"/fornecedores/[id]">): Promise<Metadata> {
  const { id } = await params;

  if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) {
    notFound();
  }

  const fornecedor = await fornecedorService.detail(Number(id));

  if (!fornecedor) {
    notFound();
  }

  return createPageMetadata(
    fornecedor.nome,
    `Despesas parlamentares relacionadas a ${fornecedor.nome}. Consulte valores declarados, notas fiscais e informações do fornecedor.`,
  );
}

export default function FornecedorPage({
  params,
}: PageProps<"/fornecedores/[id]">) {
  return (
    <Suspense
      fallback={
        <DetailSkeleton label="Carregando fornecedor" kind="supplier" />
      }
    >
      <FornecedorContent params={params} />
    </Suspense>
  );
}

async function FornecedorContent({
  params,
}: {
  params: PageProps<"/fornecedores/[id]">["params"];
}) {
  const { id } = await params;

  if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) {
    notFound();
  }

  return <FornecedorDetailView id={id} />;
}
