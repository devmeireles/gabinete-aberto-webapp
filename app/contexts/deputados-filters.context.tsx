"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface IDeputadosFilters {
  nome: string;
  legislaturaId: number | undefined;
  siglaUf: string;
  siglaPartido: string;
  siglaSexo: "" | "M" | "F";
  situacao: string;
  condicaoEleitoral: string;
  escolaridade: string;
  ufNascimento: string;
  municipioNascimento: string;
  anoNascimentoDe: string;
  anoNascimentoAte: string;
  ordenarPor: "nome" | "siglaPartido" | "siglaUf" | "dataNascimento";
  ordem: "asc" | "desc";
  pagina: number;
  itens: number;
}

type DeputadosFilterKey = Exclude<keyof IDeputadosFilters, "pagina">;

export interface IDeputadosFiltersActions {
  setFilter: <K extends DeputadosFilterKey>(
    key: K,
    value: IDeputadosFilters[K],
  ) => void;
  setPagina: (pagina: number) => void;
  reset: () => void;
}

const INITIAL_FILTERS: IDeputadosFilters = {
  nome: "",
  legislaturaId: undefined,
  siglaUf: "",
  siglaPartido: "",
  siglaSexo: "",
  situacao: "",
  condicaoEleitoral: "",
  escolaridade: "",
  ufNascimento: "",
  municipioNascimento: "",
  anoNascimentoDe: "",
  anoNascimentoAte: "",
  ordenarPor: "nome",
  ordem: "asc",
  pagina: 1,
  itens: 20,
};

const FiltersContext = createContext<IDeputadosFilters | null>(null);
const ActionsContext = createContext<IDeputadosFiltersActions | null>(null);

export function useDeputadosFilters(): IDeputadosFilters {
  const context: IDeputadosFilters | null = useContext(FiltersContext);
  if (!context) {
    throw new Error(
      "useDeputadosFilters must be used within a DeputadosFiltersProvider",
    );
  }
  return context;
}

export function useDeputadosFiltersActions(): IDeputadosFiltersActions {
  const context: IDeputadosFiltersActions | null = useContext(ActionsContext);
  if (!context) {
    throw new Error(
      "useDeputadosFiltersActions must be used within a DeputadosFiltersProvider",
    );
  }
  return context;
}

interface IDeputadosFiltersProviderProps {
  children: ReactNode;
  initialFilters?: Partial<IDeputadosFilters>;
}

export function DeputadosFiltersProvider({
  children,
  initialFilters,
}: IDeputadosFiltersProviderProps) {
  const [initial] = useState<IDeputadosFilters>(() => ({
    ...INITIAL_FILTERS,
    ...initialFilters,
  }));
  const [filters, setFilters] = useState<IDeputadosFilters>(initial);

  // Trocar qualquer filtro volta para a página 1, no mesmo update.
  const setFilter = useCallback<IDeputadosFiltersActions["setFilter"]>(
    (key, value) => {
      setFilters((prev: IDeputadosFilters) => ({
        ...prev,
        [key]: value,
        pagina: 1,
      }));
    },
    [],
  );

  const setPagina = useCallback((pagina: number): void => {
    setFilters((prev: IDeputadosFilters) => ({ ...prev, pagina }));
  }, []);

  const reset = useCallback((): void => {
    setFilters(initial);
  }, [initial]);

  const actions: IDeputadosFiltersActions = useMemo(
    () => ({ setFilter, setPagina, reset }),
    [setFilter, setPagina, reset],
  );

  return (
    <ActionsContext.Provider value={actions}>
      <FiltersContext.Provider value={filters}>
        {children}
      </FiltersContext.Provider>
    </ActionsContext.Provider>
  );
}
