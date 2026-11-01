import Link from "next/link";

import { formatCurrency } from "@/app/lib/formartters.lib";
import type { FornecedorListItem } from "@/server/schemas/fornecedor.schema";

interface IFornecedorCardProps {
  fornecedor: FornecedorListItem;
  href: string;
}

export const FornecedorCard = ({ fornecedor, href }: IFornecedorCardProps) => (
  <Link
    href={href}
    className="block h-full rounded-lg border border-border bg-surface p-4 transition-colors hover:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
  >
    <h2 className="truncate font-semibold text-text">{fornecedor.nome}</h2>
    <p className="mt-1 font-mono text-xs text-text-muted">
      {fornecedor.cnpjCpf}
    </p>
    <div className="mt-4 border-t border-border-subtle pt-3">
      <p className="text-[11px] text-text-muted">Total bruto declarado</p>
      <p className="mt-0.5 font-mono text-base font-semibold text-primary">
        {formatCurrency(fornecedor.totalBruto)}
      </p>
    </div>
  </Link>
);
