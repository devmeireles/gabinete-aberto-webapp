import {
  LoadingSpinner,
  LoadingState,
  Skeleton,
} from "@/app/components/ui/LoadingState";

export const DashboardLoadingState = () => (
  <LoadingState label="Carregando indicadores do painel" className="space-y-6">
    <div className="flex items-center gap-2 text-sm text-text-muted">
      <LoadingSpinner className="h-5 w-5" />
      Carregando indicadores da legislatura vigente...
    </div>
    <section className="space-y-4 rounded-2xl border border-border bg-surface p-6 sm:p-10">
      <Skeleton className="h-6 w-64" />
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-full max-w-3xl" />
      <div className="grid gap-4 border-t border-border pt-6 sm:grid-cols-3">
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>
    </section>
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.8fr)]">
      <Skeleton className="h-[34rem] w-full rounded-xl" />
      <Skeleton className="h-96 w-full rounded-xl" />
    </div>
    <div className="grid gap-6 lg:grid-cols-2">
      <Skeleton className="h-96 w-full rounded-xl" />
      <Skeleton className="h-96 w-full rounded-xl" />
    </div>
  </LoadingState>
);
