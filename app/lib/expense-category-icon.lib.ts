import { createElement, type ComponentProps, type ReactElement } from "react";
import {
  Briefcase,
  Building,
  Car,
  Coffee,
  Fuel,
  Hotel,
  Megaphone,
  Plane,
  Wrench,
  type LucideIcon,
} from "lucide-react";

function getIconForExpenseCategory(category: string | null): LucideIcon {
  const normalizedCategory = (category ?? "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

  if (
    normalizedCategory.includes("passag") ||
    normalizedCategory.includes("aere")
  )
    return Plane;
  if (
    normalizedCategory.includes("divulga") ||
    normalizedCategory.includes("public")
  )
    return Megaphone;
  if (
    normalizedCategory.includes("combust") ||
    normalizedCategory.includes("lubrif")
  )
    return Fuel;
  if (
    normalizedCategory.includes("locacao") ||
    normalizedCategory.includes("veicul") ||
    normalizedCategory.includes("fretament")
  )
    return Car;
  if (normalizedCategory.includes("hosped")) return Hotel;
  if (normalizedCategory.includes("aliment")) return Coffee;
  if (normalizedCategory.includes("manutenc")) return Wrench;
  if (
    normalizedCategory.includes("consult") ||
    normalizedCategory.includes("pesquis") ||
    normalizedCategory.includes("servico")
  )
    return Briefcase;

  return Building;
}

export function formatExpenseCategoryIcon(
  category: string | null,
  props: ComponentProps<LucideIcon>,
): ReactElement {
  return createElement(getIconForExpenseCategory(category), props);
}
