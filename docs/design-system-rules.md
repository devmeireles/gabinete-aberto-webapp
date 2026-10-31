# Design system rules

The current styling system is Tailwind CSS 4 plus app-specific CSS variables and
custom React components. It has no shadcn/Radix primitive layer, CVA recipes, or
Tailwind JavaScript configuration file.

## Sources and consumption

`app/globals.css` imports Tailwind and `app/styles/tokens.css`. Tokens define brand,
surfaces, text, feedback, focus/overlay, and chart colors for light/dark themes;
`@theme` exposes named utility mappings. Global CSS also contains overlapping
starter background/foreground and font mappings; see [design tokens](design-tokens.md)
before assuming every visible style comes from one token source.

Prefer the existing semantic vocabulary: `bg-surface`, `text-text-muted`,
`border-border`, `text-primary`, `text-warning`, and `ring-focus-ring`. Components
also use token references such as `bg-[var(--color-surface)]` and
`bg-(--color-background)`. Both forms occur in the codebase.

Spacing, radii, shadows, and responsive layouts generally use Tailwind utilities.
Arbitrary values such as `text-[11px]` and `max-w-[240px]` also exist and are not
banned by ESLint. Follow nearby patterns; do not require a token migration for an
unrelated change. Reuse semantic colors for new styles and extend the token file
when a new reusable semantic color is actually needed.

## Themes

Light values live in `:root`. Automatic dark values use
`prefers-color-scheme`; explicit dark values use `[data-theme="dark"]` or `.dark`.
`ThemeToggle` cycles auto → dark → light → auto and stores the selection in
localStorage. No theme provider is installed.

Check automatic and explicit modes when changing colors. Existing global CSS has
OS-driven starter colors that do not follow the same explicit selectors; this is
a current implementation limitation, not a reason to silently rewrite CSS during
documentation maintenance.

## Data presentation

Use the existing number/date/currency formatters in `app/lib/formartters.lib.ts`
(the filename is spelled this way). Financial tables use `font-mono tabular-nums`
and distinguish gross value, glosa, and net value through labels and color.
`--chart-1` through `--chart-6` exist as variables, but there is no implemented chart
component or chart-color utility mapping. Do not assume a chart library exists.

Contrast and keyboard behavior require manual verification; there is no custom
style-token or accessibility enforcement configured. See [accessibility](accessibility.md).
