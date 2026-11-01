# Accessibility

This guide records existing patterns and review targets. There is no automated
accessibility audit or custom zero-warning contract in this repository.

## Current implementation

- Expense tables use native table elements, column scopes, sort buttons, and
  `aria-sort` in `app/features/despesas/DespesasTable.tsx`.
- Filter controls generally use visible labels linked through `htmlFor`/`id`.
- Pagination uses a named `<nav>` and named native previous/next buttons.
- The mobile menu toggle has an accessible name, `aria-expanded`, and
  `aria-controls`. The theme toggle has a name describing the current mode.
- Many decorative Lucide icons use `aria-hidden="true"`; deputy photos have alt
  text and missing-photo fallbacks have labels.
- Loading feedback uses status/`aria-busy` states in feature results and the
  detail skeleton. Empty results use the shared `EmptyState` component.
- Data-loading failures use the shared `ErrorState` alert with a retry action where
  retrying is meaningful. A missing deputy is announced as a status, not a
  retriable network error.

## Review targets for UI changes

Use native buttons/links for actions/navigation, meaningful headings, associated
input labels, and accessible names for icon-only controls. Preserve visible focus
and verify Tab, Shift+Tab, Enter, and Space where applicable. Sorting must remain
keyboard operable and expose its direction; disabled pagination must not navigate.

Do not encode financial meaning or status solely in color. Keep gross/glosa/net
labels and readable values. Aim for text contrast of at least 4.5:1 and large text
or essential non-text controls at least 3:1 in light/dark modes. These are review
targets, not measured results for the current palette.

Check mobile menu operation, narrow-screen table scrolling, zoom, truncated labels,
and loading/error/empty states. Errors should be understandable and changes should
be announced appropriately for the interaction. The shared `ErrorState` currently
covers recoverable query failures; it is not a general error boundary.

## Tooling

`eslint.config.mjs` extends Next core-web-vitals and TypeScript presets. There is
no explicit custom `jsx-a11y` configuration, warning baseline, axe integration,
or browser/component test suite. Lint success does not prove accessibility.
Follow the manual checks in [development workflow](development-workflow.md).
