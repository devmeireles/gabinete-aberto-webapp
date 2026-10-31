"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

export interface IDashboardFilters {
  legislaturaId: number;
  fromMonth: string; // "2026-01"
  toMonth: string; // "2026-10"
}

export interface IDashboardFiltersActions {
  setLegislaturaId: Dispatch<SetStateAction<number>>;
  setFromMonth: Dispatch<SetStateAction<string>>;
  setToMonth: Dispatch<SetStateAction<string>>;
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
  const [legislaturaId, setLegislaturaId] = useState<number>(57);
  const [fromMonth, setFromMonth] = useState<string>("2026-01");
  const [toMonth, setToMonth] = useState<string>("2026-10");

  const filters: IDashboardFilters = useMemo(
    () => ({ legislaturaId, fromMonth, toMonth }),
    [legislaturaId, fromMonth, toMonth],
  );

  // Setters do useState têm identidade estável: este objeto nunca muda.
  const actions: IDashboardFiltersActions = useMemo(
    () => ({ setLegislaturaId, setFromMonth, setToMonth }),
    [],
  );

  return (
    <ActionsContext.Provider value={actions}>
      <FiltersContext.Provider value={filters}>
        {children}
      </FiltersContext.Provider>
    </ActionsContext.Provider>
  );
}
