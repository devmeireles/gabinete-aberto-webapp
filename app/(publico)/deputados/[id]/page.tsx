import { Suspense } from "react";
import { notFound } from "next/navigation";

import { DeputadoDetailView } from "@/app/features/deputados/DeputadoDetailView";

export default function DeputadoPage({ params }: PageProps<"/deputados/[id]">) {
  return (
    <Suspense fallback={<DeputadoDetailSkeleton />}>
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

function DeputadoDetailSkeleton() {
  return (
    <div className="animate-pulse space-y-4 p-6" aria-busy="true">
      <div className="h-24 w-24 rounded-full bg-surface" />
      <div className="h-6 w-1/3 rounded bg-surface" />
      <div className="h-4 w-1/2 rounded bg-surface" />
    </div>
  );
}
