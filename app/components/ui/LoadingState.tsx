import type { ReactNode } from "react";
import { LoaderCircle } from "lucide-react";

interface ILoadingStateProps {
  label: string;
  children: ReactNode;
  className?: string;
}

interface ISkeletonProps {
  className: string;
}

export const Skeleton = ({ className }: ISkeletonProps) => (
  <div
    aria-hidden="true"
    className={`animate-pulse rounded bg-surface-subtle ${className}`}
  />
);

export const LoadingSpinner = ({
  className = "h-4 w-4",
}: {
  className?: string;
}) => (
  <LoaderCircle
    aria-hidden="true"
    className={`shrink-0 animate-spin text-primary ${className}`}
  />
);

export const LoadingState = ({
  label,
  children,
  className = "",
}: ILoadingStateProps) => (
  <div role="status" aria-label={label} aria-busy="true" className={className}>
    <span className="sr-only">{label}</span>
    {children}
  </div>
);

export const CardGridSkeleton = ({
  label,
  kind = "supplier",
  count = 6,
  className = "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
}: {
  label: string;
  kind?: "deputy" | "supplier";
  count?: number;
  className?: string;
}) => (
  <LoadingState label={label} className={className}>
    {Array.from({ length: count }, (_, index) => (
      <div
        key={index}
        aria-hidden="true"
        className="rounded-lg border border-border bg-surface p-4"
      >
        <div className="flex items-start gap-3">
          {kind === "deputy" && <Skeleton className="h-18 w-14 shrink-0" />}
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            {kind === "deputy" && <Skeleton className="h-3 w-2/3" />}
          </div>
        </div>
        {kind === "supplier" && (
          <div className="mt-4 border-t border-border-subtle pt-3">
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="mt-2 h-5 w-1/2" />
          </div>
        )}
      </div>
    ))}
  </LoadingState>
);

export const DetailSkeleton = ({
  label,
  kind,
}: {
  label: string;
  kind: "deputy" | "supplier";
}) => (
  <LoadingState
    label={label}
    className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8"
  >
    <div className="flex items-center justify-between border-b border-border pb-4">
      <Skeleton className="h-4 w-40" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-24" />
        {kind === "deputy" && <Skeleton className="h-8 w-28" />}
      </div>
    </div>

    <section className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="flex flex-col gap-6 bg-surface-subtle p-6 sm:flex-row sm:p-8">
        {kind === "deputy" && (
          <Skeleton className="h-28 w-28 shrink-0 rounded-2xl sm:h-36 sm:w-36" />
        )}
        <div className="min-w-0 flex-1 space-y-4">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <div className="grid gap-3 border-t border-border pt-4 sm:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </div>
      {kind === "deputy" && (
        <div className="space-y-3 border-t border-border p-6">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      )}
    </section>

    <section className="space-y-4">
      <Skeleton className="h-6 w-48" />
      {kind === "supplier" && (
        <div className="grid gap-3 rounded-lg border border-border bg-surface p-4 sm:grid-cols-3">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </div>
      )}
      <TotalsBarSkeleton />
      <ExpenseTableSkeleton />
    </section>
  </LoadingState>
);

export const TotalsBarSkeleton = () => (
  <LoadingState
    label="Carregando totais das despesas"
    className="rounded-lg border border-border bg-surface-subtle p-4"
  >
    <div
      aria-hidden="true"
      className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
    >
      <div className="space-y-2">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-3 w-52" />
      </div>
      <div className="grid grid-cols-1 gap-3 border-t border-border pt-3 sm:grid-cols-3 md:gap-6 md:border-t-0 md:pt-0">
        <div className="space-y-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-5 w-28" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-5 w-24" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-36" />
          <Skeleton className="h-6 w-32" />
        </div>
      </div>
    </div>
  </LoadingState>
);

export const ExpenseTableSkeleton = ({
  label,
  rows = 6,
  showDeputado = true,
}: {
  label?: string;
  rows?: number;
  showDeputado?: boolean;
} = {}) => {
  const columns = [
    { key: "date", width: "w-16" },
    ...(showDeputado ? [{ key: "deputy", width: "w-28" }] : []),
    { key: "type", width: "w-32" },
    { key: "supplier", width: "w-28" },
    { key: "document", width: "w-16" },
    { key: "gross", width: "w-20" },
    { key: "withheld", width: "w-16" },
    { key: "net", width: "w-20" },
    { key: "source", width: "w-12" },
  ];

  const table = (
    <div className="space-y-4">
      <div
        aria-hidden="true"
        className="overflow-x-auto rounded-lg border border-border bg-surface shadow-xs"
      >
        <table className="w-full min-w-[72rem] border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-border bg-surface-subtle">
              {columns.map(({ key, width }) => (
                <th key={key} scope="col" className="px-3 py-3">
                  <Skeleton className={`h-3 ${width}`} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }, (_, row) => (
              <tr
                key={row}
                className="border-b border-border-subtle last:border-0"
              >
                {columns.map(({ key, width }, column) => (
                  <td key={key} className="px-3 py-3">
                    <Skeleton
                      className={`h-4 ${column === 1 ? "w-3/4" : width}`}
                    />
                    {key === "supplier" && (
                      <Skeleton className="mt-1 h-2 w-20" />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div
        aria-hidden="true"
        className="flex items-center justify-between gap-3"
      >
        <Skeleton className="h-8 w-24" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  );

  return label ? <LoadingState label={label}>{table}</LoadingState> : table;
};
