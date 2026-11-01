# Component guidelines

Components are custom React/TypeScript components styled with Tailwind CSS 4.
There is no installed shadcn/ui, Radix, CVA, `clsx`, `tailwind-merge`, or `cn` helper.
Use existing components and dependencies before proposing a new abstraction.

## Placement

- `app/components/ui/`: reusable domain-oriented UI (`DeputyAvatar`, `EmptyState`,
  `Pagination`, `TotalsBar`). This is not an upstream primitive directory.
- `app/components/layout/`: `Header`, `Footer`, `ThemeToggle`.
- `app/features/dashboard/`, `deputados/`, `despesas/`, `fornecedores/`: feature
  views, filters, tables, and profile sections.
- `app/hooks/`: query and reusable behavior hooks.
- `app/contexts/`: filter providers and their value/action hooks.

Pages compose providers/views. Keep feature-specific sections within the feature;
move a section to shared UI when actual reuse warrants it. Do not introduce
atoms/molecules/providers directories merely to follow a template.

## Contracts and composition

Props use TypeScript interfaces/types, often named with an `I` prefix. Reuse Zod
inferred types and existing interfaces where appropriate. Native controls remain
native `<button>`, `<input>`, and `<select>` elements; Lucide supplies icons and
`next/image` renders official deputy photos.

Domain components accept the props their callers need; they are not universal DOM
wrappers and do not currently promise arbitrary prop/ref forwarding. If adding a
native wrapper, preserve the relevant native events, accessibility attributes,
and ref behavior for its actual callers. See [composition patterns](composition-pattern.md).

Use semantic token utilities or the existing CSS-variable class syntax. Current
class composition uses template literals, conditionals, and named class constants.
See [design system rules](design-system-rules.md) before changing styles.

## Existing reuse patterns

`DashboardView` composes its filter controls, hero, metric cards, charts, and
party summary; chart and summary components receive prepared dashboard metrics
as props. The monthly evolution chart uses Recharts' animated line chart.
Dashboard query refreshes show a visible spinner while retaining the previous
results.

`DespesasResults` handles query states, sort defaults/toggling, and pagination;
`DespesasTable` renders supplied items and invokes `onSort`. Its `showDeputado`
prop hides the deputy column when reused in a deputy profile. Placeholder data
dims existing rows and disables pagination.

`DeputadoDespesas` creates a scoped `DespesasFiltersProvider` with the deputy ID
and most recent available legislature. It reuses expense filters/results and
`DeputadoIndicadores`. Preserve the scoped initial state on reset.

Use `EmptyState` for no matches and its reset action when available. Loading
feedback remains feature-specific. `ErrorState` is shared for recoverable query
failures; the detail route has a local Suspense skeleton.

## Verification

No component test runner or Storybook is configured. Validate changed interactions
using the [development workflow](development-workflow.md), including keyboard and
mobile checks from [accessibility](accessibility.md). Do not imply unrun automated
tests passed or install test infrastructure for a documentation-only task.
