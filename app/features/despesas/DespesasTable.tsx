"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, ExternalLink } from "lucide-react";
import Link from "next/link";

import { formatCurrency, formatDate } from "@/app/lib/formartters.lib";
import type {
  DespesaItem,
  DespesaOrdenarPor,
} from "@/server/schemas/despesa.schema";

type SortDirection = "asc" | "desc";

interface IDespesasTableProps {
  items: DespesaItem[];
  ordenarPor: DespesaOrdenarPor;
  ordem: SortDirection;
  onSort: (column: DespesaOrdenarPor) => void;
  /** Oculta a coluna Parlamentar (ex.: no perfil do próprio deputado). */
  showDeputado?: boolean;
  /** Esmaece a tabela enquanto a próxima página carrega. */
  dimmed?: boolean;
}

interface ISortableThProps {
  column: DespesaOrdenarPor;
  label: string;
  ordenarPor: DespesaOrdenarPor;
  ordem: SortDirection;
  onSort: (column: DespesaOrdenarPor) => void;
  align?: "left" | "right";
}

const SortableTh = ({
  column,
  label,
  ordenarPor,
  ordem,
  onSort,
  align = "left",
}: ISortableThProps) => {
  const isActive: boolean = ordenarPor === column;
  const ariaSort: "ascending" | "descending" | "none" = !isActive
    ? "none"
    : ordem === "asc"
      ? "ascending"
      : "descending";
  const Icon = !isActive ? ArrowUpDown : ordem === "asc" ? ArrowUp : ArrowDown;

  return (
    <th
      scope="col"
      aria-sort={ariaSort}
      className={`px-3 py-3 ${align === "right" ? "text-right" : ""}`}
    >
      <button
        type="button"
        onClick={() => onSort(column)}
        title={`Ordenar por ${label}`}
        className={`inline-flex items-center gap-1 rounded font-semibold hover:text-text focus:outline-none focus-visible:ring-1 focus-visible:ring-focus-ring ${isActive ? "text-text" : ""
          }`}
      >
        <span>{label}</span>
        <Icon
          className={`h-3 w-3 ${isActive ? "text-primary" : "opacity-50"}`}
          aria-hidden="true"
        />
      </button>
    </th>
  );
};

/** "Nome - PARTIDO (UF)", omitindo as partes que não existirem. */
function formatDeputadoLabel(item: DespesaItem): string {
  const partido: string = item.siglaPartido ? ` - ${item.siglaPartido}` : "";
  const uf: string = item.siglaUf ? ` (${item.siglaUf})` : "";
  return `${item.deputadoNome}${partido}${uf}`;
}

export const DespesasTable = ({
  items,
  ordenarPor,
  ordem,
  onSort,
  showDeputado = true,
  dimmed = false,
}: IDespesasTableProps) => {
  const sortProps = { ordenarPor, ordem, onSort };

  return (
    <div
      className={`overflow-x-auto rounded-lg border border-border bg-surface shadow-xs ${dimmed ? "opacity-60" : ""
        }`}
    >
      <table className="w-full border-collapse text-left text-xs">
        <thead>
          <tr className="border-b border-border bg-surface-subtle font-semibold text-text-muted">
            <SortableTh column="dataDocumento" label="Data" {...sortProps} />
            {showDeputado && (
              <SortableTh
                column="deputadoNome"
                label="Parlamentar"
                {...sortProps}
              />
            )}
            <SortableTh
              column="tipoDespesa"
              label="Tipo de Despesa"
              {...sortProps}
            />
            <SortableTh
              column="fornecedorNome"
              label="Fornecedor"
              {...sortProps}
            />
            <th scope="col" className="px-3 py-3">
              Documento
            </th>
            <SortableTh
              column="valorDocumento"
              label="Valor Bruto"
              align="right"
              {...sortProps}
            />
            <SortableTh
              column="valorGlosa"
              label="Glosa"
              align="right"
              {...sortProps}
            />
            <SortableTh
              column="valorLiquido"
              label="Valor Líquido"
              align="right"
              {...sortProps}
            />
            <th scope="col" className="px-3 py-3 text-center">
              Origem
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle font-mono tabular-nums">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-surface-hover">
              <td className="px-3 py-3 whitespace-nowrap text-text">
                {item.dataDocumento ? formatDate(item.dataDocumento) : "—"}
              </td>

              {showDeputado && (
                <td className="px-3 py-3 font-sans">
                  <Link
                    href={`/deputados/${item.deputadoId}`}
                    className="block max-w-60 truncate font-semibold text-text hover:text-primary hover:underline"
                    title={`Ver perfil de ${formatDeputadoLabel(item)}`}
                  >
                    {formatDeputadoLabel(item)}
                  </Link>
                </td>
              )}

              <td className="max-w-xs px-3 py-3 font-sans text-text">
                <div className="truncate font-medium" title={item.tipoDespesa}>
                  {item.tipoDespesa}
                </div>
              </td>

              <td className="max-w-xs px-3 py-3 font-sans text-text">
                <div
                  className="truncate font-medium"
                  title={item.fornecedorNome}
                >
                  {item.fornecedorNome}
                </div>
                <div className="font-mono text-[10px] text-text-subtle">
                  {item.fornecedorCnpjCpf}
                </div>
              </td>

              <td className="px-3 py-3 whitespace-nowrap text-text-muted">
                {item.numDocumento}
              </td>

              <td className="px-3 py-3 text-right whitespace-nowrap text-text-muted">
                {formatCurrency(item.valorDocumento)}
              </td>

              <td className="px-3 py-3 text-right whitespace-nowrap text-warning">
                {formatCurrency(item.valorGlosa)}
              </td>

              <td className="px-3 py-3 text-right font-bold whitespace-nowrap text-primary">
                {formatCurrency(item.valorLiquido)}
              </td>

              <td className="px-3 py-3 text-center font-sans">
                {item.urlDocumento ? (
                  <a
                    href={item.urlDocumento}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-link hover:text-link-hover hover:underline"
                    title="Abre comprovante fiscal oficial em nova aba (origem externa)"
                  >
                    <span>Nota</span>
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </a>
                ) : (
                  <span className="text-[10px] text-text-subtle">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
