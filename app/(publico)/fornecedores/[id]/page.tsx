import { Suspense } from "react";
import { notFound } from "next/navigation";

import { DetailSkeleton } from "@/app/components/ui/LoadingState";
import { FornecedorDetailView } from "@/app/features/fornecedores/FornecedorDetailView";

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
