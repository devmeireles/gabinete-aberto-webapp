/**
 * Formatters according to Brazilian locale standards (pt-BR)
 */

import { Gabinete } from "@/server/schemas/deputado-detalhe.schema";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const decimalFormatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const integerFormatter = new Intl.NumberFormat("pt-BR");

const MONTH_NAMES_SHORT = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
];

/**
 * Formata valores numéricos como moeda brasileira (R$)
 */
export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "R$ 0,00";
  }
  return currencyFormatter.format(value);
}

/**
 * Formata números inteiros com separador de milhar (pt-BR)
 */
export function formatInteger(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "0";
  }
  return integerFormatter.format(value);
}

/**
 * Formata valores decimais ou percentuais
 */
export function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "0,0%";
  }
  return `${decimalFormatter.format(value)}%`;
}

/**
 * Formata data ISO (YYYY-MM-DD ou ISO string completa) para dd/MM/yyyy
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) {
    return "Não informado";
  }

  try {
    // If it's already YYYY-MM-DD
    const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      const [, year, month, day] = match;
      return `${day}/${month}/${year}`;
    }

    const d = new Date(dateString);
    if (isNaN(d.getTime())) {
      return "Não informado";
    }
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return "Não informado";
  }
}

/**
 * Formata competência mensal para o formato 'mês/ano' (ex: 'jan/2026')
 */
export function formatCompetencia(ano: number, mes: number): string {
  const monthIdx = mes - 1;
  const shortMonth = MONTH_NAMES_SHORT[monthIdx] || `mês ${mes}`;
  return `${shortMonth}/${ano}`;
}

/**
 * Formata data e hora para exibição de atualização (ex: '28/10/2026 às 14:00 (Brasília)')
 */
export function formatDateTime(isoString: string | null | undefined): string {
  if (!isoString) {
    return "Não informado";
  }

  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) {
      return "Não informado";
    }
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} às ${hours}:${minutes}`;
  } catch {
    return "Não informado";
  }
}

/**
 * Retorna texto seguro para campos nulos ou vazios
 */
export function safeText(
  value: string | null | undefined,
  fallback: string = "Não informado",
): string {
  if (!value || value.trim() === "") {
    return fallback;
  }
  return value.trim();
}

/**
 * Formata CNPJ ou CPF para exibição anonimizada/formatada
 */
export function formatCnpjOrCpf(doc: string | null | undefined): string {
  if (!doc) return "Não informado";
  const clean = doc.replace(/\D/g, "");
  if (clean.length === 14) {
    // CNPJ: 00.000.000/0000-00
    return clean.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      "$1.$2.$3/$4-$5",
    );
  }
  if (clean.length === 11) {
    // CPF: mascarar por privacidade
    return clean.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "***.$2.$3-**");
  }
  return doc;
}

export const toRoman = (value: string | null): string => {
  if (!value) return "";

  const number = Number(value);
  if (!Number.isInteger(number) || number < 1 || number > 3999) return value;

  const roman = [
    ["M", 1000],
    ["CM", 900],
    ["D", 500],
    ["CD", 400],
    ["C", 100],
    ["XC", 90],
    ["L", 50],
    ["XL", 40],
    ["X", 10],
    ["IX", 9],
    ["V", 5],
    ["IV", 4],
    ["I", 1],
  ] as const;

  let remaining = Number(value);
  let result = "";

  for (const [symbol, amount] of roman) {
    while (remaining >= amount) {
      result += symbol;
      remaining -= amount;
    }
  }

  return result;
};

export const formatGabineteAddressLine = (gabinete: Gabinete): string => {
  return [
    gabinete.predio ? `Anexo ${toRoman(gabinete.predio)}` : null,
    gabinete.sala ? `Sala ${gabinete.sala}` : null,
    gabinete.telefone ? `Tel: ${gabinete.telefone}` : null,
  ]
    .filter(Boolean)
    .join(" · ");
};

export function formatBirthDate(dateString: string | null | undefined): string {
  if (!dateString) return "Não informado";

  const date = new Date(`${dateString.slice(0, 10)}T00:00:00`);

  if (isNaN(date.getTime())) return "Não informado";

  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();

  if (
    today.getMonth() < date.getMonth() ||
    (today.getMonth() === date.getMonth() && today.getDate() < date.getDate())
  ) {
    age--;
  }

  return `${formatDate(dateString)} (${age} anos)`;
}
