import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DetailSkeleton } from "@/app/components/ui/LoadingState";
import { DeputadoDetailView } from "@/app/features/deputados/DeputadoDetailView";
import { createPageMetadata } from "@/app/lib/seo";
import { deputadoService } from "@/server/services";

export async function generateMetadata({
  params,
}: PageProps<"/deputados/[id]">): Promise<Metadata> {
  const { id } = await params;
  const deputadoId = Number(id);

  if (!Number.isInteger(deputadoId) || deputadoId <= 0) {
    notFound();
  }

  const detalhe = await deputadoService.detail(deputadoId);

  if (!detalhe) {
    notFound();
  }

  const { nome, siglaPartido, siglaUf } = detalhe.perfil;
  const localizacao = [siglaPartido, siglaUf].filter(Boolean).join(" · ");

  return createPageMetadata(
    nome,
    `Perfil parlamentar de ${nome}${localizacao ? ` (${localizacao})` : ""}. Consulte dados biográficos, histórico partidário e despesas da Cota Parlamentar.`,
  );
}

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
