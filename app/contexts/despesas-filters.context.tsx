"use client";

import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from "react";

export interface IDespesasFilters {
    legislaturaId: number;
    deputadoId: number | undefined;
    tipoDespesaId: number | undefined;
    fromMonth: string; // "" = sem limite
    toMonth: string;
    fornecedor: string;
    ordenarPor: "dataDocumento" | "valorLiquido" | "valorDocumento";
    ordem: "asc" | "desc";
    pagina: number;
    itens: number;
}

type DespesasFilterKey = Exclude<keyof IDespesasFilters, "pagina">;

export interface IDespesasFiltersActions {
    setFilter: <K extends DespesasFilterKey>(key: K, value: IDespesasFilters[K]) => void;
    setPagina: (pagina: number) => void;
    reset: () => void;
}

const DEFAULT_FILTERS: IDespesasFilters = {
    legislaturaId: 57,
    deputadoId: undefined,
    tipoDespesaId: undefined,
    fromMonth: "",
    toMonth: "",
    fornecedor: "",
    ordenarPor: "dataDocumento",
    ordem: "desc",
    pagina: 1,
    itens: 20,
};

const FiltersContext = createContext<IDespesasFilters | null>(null);
const ActionsContext = createContext<IDespesasFiltersActions | null>(null);

export function useDespesasFilters(): IDespesasFilters {
    const context: IDespesasFilters | null = useContext(FiltersContext);
    if (!context) {
        throw new Error("useDespesasFilters must be used within a DespesasFiltersProvider");
    }
    return context;
}

export function useDespesasFiltersActions(): IDespesasFiltersActions {
    const context: IDespesasFiltersActions | null = useContext(ActionsContext);
    if (!context) {
        throw new Error("useDespesasFiltersActions must be used within a DespesasFiltersProvider");
    }
    return context;
}

interface IDespesasFiltersProviderProps {
    children: ReactNode;
    initialFilters?: Partial<IDespesasFilters>;
}

export function DespesasFiltersProvider({ children, initialFilters }: IDespesasFiltersProviderProps) {
    // Calculado uma vez: reset() volta ao estado inicial do provider, não ao global.
    const [initial] = useState<IDespesasFilters>(() => ({ ...DEFAULT_FILTERS, ...initialFilters }));
    const [filters, setFilters] = useState<IDespesasFilters>(initial);

    const setFilter = useCallback<IDespesasFiltersActions["setFilter"]>((key, value) => {
        setFilters((prev: IDespesasFilters) => ({ ...prev, [key]: value, pagina: 1 }));
    }, []);

    const setPagina = useCallback((pagina: number): void => {
        setFilters((prev: IDespesasFilters) => ({ ...prev, pagina }));
    }, []);

    const reset = useCallback((): void => {
        setFilters(initial);
    }, [initial]);

    const actions: IDespesasFiltersActions = useMemo(
        () => ({ setFilter, setPagina, reset }),
        [setFilter, setPagina, reset],
    );

    return (
        <ActionsContext.Provider value={actions}>
            <FiltersContext.Provider value={filters}>{children}</FiltersContext.Provider>
        </ActionsContext.Provider>
    );
}