import { Suspense } from "react";
import { notFound } from "next/navigation";

import { DetailSkeleton } from "@/app/components/ui/LoadingState";
import { DeputadoDetailView } from "@/app/features/deputados/DeputadoDetailView";

export default function DeputadoPage({ params }: PageProps<"/deputados/[id]">) {
  return (
    <Suspense
      fallback={
        <DetailSkeleton label="Carregando perfil do deputado" kind="deputy" />
      }
    >
      <DeputadoContent params={params} />
    </Suspense>
  );
}

async function DeputadoContent({
  params,
}: {
  params: PageProps<"/deputados/[id]">["params"];
}) {
  const { id } = await params;
  const deputadoId: number = Number(id);

  if (!Number.isInteger(deputadoId) || deputadoId <= 0) {
    notFound();
  }

  return <DeputadoDetailView id={deputadoId} />;
}
