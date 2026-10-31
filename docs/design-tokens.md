# Design tokens

The main app palette lives in `app/styles/tokens.css`, imported by
`app/globals.css`. Components use named Tailwind utilities and direct CSS-variable
references. `eslint.config.mjs` does not enforce token usage.

## Token inventory

| Purpose | Variables | Existing utility examples |
| --- | --- | --- |
| Primary | `--color-primary`, `--color-primary-hover`, `--color-primary-soft` | `text-primary`, `bg-primary-soft` |
| Accent | `--color-accent`, `--color-accent-hover` | `text-accent` |
| Surfaces | `--color-background`, `--color-surface`, `--color-surface-subtle`, `--color-surface-hover` | `bg-surface`, `bg-surface-subtle`, `hover:bg-surface-hover` |
| Borders | `--color-border`, `--color-border-subtle` | `border-border`, `divide-border-subtle` |
| Text | `--color-text`, `--color-text-muted`, `--color-text-subtle` | `text-text`, `text-text-muted` |
| Links | `--color-link`, `--color-link-hover` | `text-link`, `hover:text-link-hover` |
| Feedback | `--color-success`, `--color-warning`, `--color-danger`, `--color-info`, plus each `-soft` | `text-warning`, `bg-danger-soft` |
| Focus/overlay | `--color-focus-ring`, `--color-overlay` | `focus-visible:ring-focus-ring`, `bg-overlay` |
| Charts | `--chart-1` … `--chart-6` | CSS variables only; no `--color-chart-*` mapping |
| Calendar appearance | `--calendar-invert` | Non-color variable available for control styling |

`@theme` in the token file maps the `--color-*` palette and declares Plus Jakarta
Sans / JetBrains Mono font stacks. There is no custom radius token scale,
`font-display`/`font-heading` mapping, rarity palette, or game-specific palette.

## Theme selectors

- `:root`: light palette and `color-scheme: light`.
- Dark OS preference: `:root:not([data-theme="light"])` within a media query.
- Explicit dark: `:root[data-theme="dark"]` and `.dark`.
- `ThemeToggle` writes/removes `data-theme`, adjusts `.dark`, and persists
  `light`, `dark`, or `auto` under the localStorage key `theme`.

The root layout does not force dark mode. Automatic mode applies the current OS
preference when the toggle initializes or cycles; the component does not register
an OS-preference change listener.

## Overlapping global definitions

`app/globals.css` retains starter `--background`/`--foreground` values and an
`@theme inline` mapping for background/foreground and Geist font variables. Its
body uses those starter variables and an Arial/Helvetica stack. `app/layout.tsx`
loads Geist/Geist Mono, while its app wrapper references `--color-background` and
`text-text`. These overlapping declarations mean the token file alone is not a
complete description of computed styles.

Inspect both CSS files and the rendered element when diagnosing theme/font issues.
Record this overlap as current behavior; resolving it is a separate code change.
For styling guidance, see [design system rules](design-system-rules.md).
