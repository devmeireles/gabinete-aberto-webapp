"use client";

import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useLegislaturas } from "@/app/hooks/use-legislaturas";

export interface IDashboardFilters {
  legislaturaId: number;
  fromMonth: string;
  toMonth: string;
  isInitialized: boolean;
}

export interface IDashboardFiltersActions {
  setLegislaturaId: (value: number) => void;
  setFromMonth: (value: string) => void;
  setToMonth: (value: string) => void;
}

const FiltersContext = createContext<IDashboardFilters | null>(null);
const ActionsContext = createContext<IDashboardFiltersActions | null>(null);

export function useDashboardFilters(): IDashboardFilters {
  const context: IDashboardFilters | null = useContext(FiltersContext);
  if (!context) {
    throw new Error(
      "useDashboardFilters must be used within a DashboardFiltersProvider",
    );
  }
  return context;
}

export function useDashboardFiltersActions(): IDashboardFiltersActions {
  const context: IDashboardFiltersActions | null = useContext(ActionsContext);
  if (!context) {
    throw new Error(
      "useDashboardFiltersActions must be used within a DashboardFiltersProvider",
    );
  }
  return context;
}

interface IDashboardFiltersProviderProps {
  children: ReactNode;
}

export function DashboardFiltersProvider({
  children,
}: IDashboardFiltersProviderProps) {
  const { data: legislaturas } = useLegislaturas();
  const currentLegislatura = legislaturas?.find(
    (legislatura) => legislatura.legislaturaAtual,
  );
  const [selectedLegislaturaId, setSelectedLegislaturaId] = useState<
    number | null
  >(null);
  const [fromMonthOverride, setFromMonthOverride] = useState<string | null>(
    null,
  );
  const [toMonthOverride, setToMonthOverride] = useState<string | null>(null);

  const selectedLegislatura =
    legislaturas?.find(
      (legislatura) => legislatura.id === selectedLegislaturaId,
    ) ?? currentLegislatura;
  const legislaturaId = selectedLegislatura?.id ?? 0;
  const fromMonth =
    fromMonthOverride ?? selectedLegislatura?.dataInicio.slice(0, 7) ?? "";
  const toMonth =
    toMonthOverride ?? selectedLegislatura?.dataFim?.slice(0, 7) ?? "";
  const setLegislaturaId = useCallback(
    (id: number) => {
      setSelectedLegislaturaId(id);
      setFromMonthOverride(null);
      setToMonthOverride(null);
    },
    [setFromMonthOverride, setSelectedLegislaturaId, setToMonthOverride],
  );

  const filters: IDashboardFilters = useMemo(
    () => ({
      legislaturaId,
      fromMonth,
      toMonth,
      isInitialized: Boolean(selectedLegislatura),
    }),
    [legislaturaId, fromMonth, toMonth, selectedLegislatura],
  );

  const actions: IDashboardFiltersActions = useMemo(
    () => ({
      setLegislaturaId,
      setFromMonth: (value) => setFromMonthOverride(value),
      setToMonth: (value) => setToMonthOverride(value),
    }),
    [setFromMonthOverride, setLegislaturaId, setToMonthOverride],
  );

  return (
    <ActionsContext.Provider value={actions}>
      <FiltersContext.Provider value={filters}>
        {children}
      </FiltersContext.Provider>
    </ActionsContext.Provider>
  );
}
