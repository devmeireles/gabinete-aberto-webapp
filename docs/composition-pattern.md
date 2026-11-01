# Composition patterns

These patterns describe existing composition in Gabinete Aberto. They do not
require introducing a generic component library or refactoring working components.

## Typed display components and feature controllers

`DespesasTable` accepts typed `DespesaItem[]`, the sort column/direction, and an
`onSort` callback. `DespesasResults` reads filter context and query state, chooses
the default direction for a newly selected column, toggles the active column,
and updates both sort values with `setSort`. Keep rendering and query/filter
coordination at those existing boundaries.

`Pagination` accepts `IPaginationMeta`, `onPageChange`, and optional `disabled`.
Callers map the server's `pagina`, `itens`, `total`, and `totalPaginas` to that
contract. It hides itself for a single page and disables navigation at bounds or
while showing placeholder data.

`TotalsBar` accepts `ITotais` and optional context/filter-count/dimming props.
Totals come from server aggregates; callers must not calculate them from page rows.

## Provider-scoped reuse

`DeputadosFiltersProvider` and `DespesasFiltersProvider` accept optional
`initialFilters`. They capture initial state once, keep values/actions in separate
contexts, and expose guarded consumer hooks that throw outside their provider.
Filter changes reset pagination to 1 in the same state update. Expense sorting
updates column, direction, and page together.

`DeputadoDespesas` scopes the expense provider to a deputy and legislature, then
composes existing filter, indicator, and results components. Its reset action
restores those initial constraints. Do not replace this with a global filter store
or URL synchronization as incidental cleanup.

## Local and controlled state

Filter inputs receive values/actions from context; transient menu and avatar error
state stays local. Server data stays in TanStack Query. There is no generic
controlled/uncontrolled hook or compound Select/Dialog API to copy from this repo.
Add such abstractions only when a requested feature needs them.

`ErrorState` standardizes recoverable query errors and retry actions across feature
views. Keep loading and not-found states specific to their owning feature.

## Native wrappers, classes, and refs

Existing UI components have explicit domain props rather than spreading all DOM
props. When a new reusable component is intended to wrap a native element,
`ComponentProps<"button">` (or the relevant element) can express its native
contract. Pass through the props/ref its public API promises. React 19 is installed;
check its types and real caller needs before choosing a ref API. Do not impose
`forwardRef` on every component that happens to render DOM.

Use existing conditional/template-literal classes and token names. Class string
order alone does not guarantee conflicting Tailwind utilities override one another;
avoid conflicting classes or choose the style explicitly. No class-merging or
variant package is installed.

Existing providers use `useMemo`/`useCallback` for value/action identity. Retain
useful behavior, but do not add blanket memoization or replace readable inline
handlers with dataset indirection without evidence of a performance problem.

See [component guidelines](component-guidelines.md) and
[development workflow](development-workflow.md) for placement and verification.
