# Agent guardrails

These guides describe Gabinete Aberto as implemented. Treat repository code,
configuration, and the user's requested scope as evidence. When documentation and
code disagree, update the documentation; do not retrofit code to a borrowed spec.
Unimplemented ideas require an explicit feature task before becoming requirements.

## Before editing

1. Read root `AGENTS.md` and the relevant installed Next.js guides in
   `node_modules/next/dist/docs/` before writing code.
2. Check `git status` and preserve existing user work, including untracked files.
3. Trace the affected route, feature, context/hook, and server path. Use
   [architecture](architecture.md) and [development workflow](development-workflow.md)
   as starting points, then inspect the source.
4. Keep changes within the task. Report unrelated inconsistencies rather than
   silently expanding scope.

## Implementation boundaries

- Use the existing Next App Router, React/TypeScript, Tailwind, tRPC/TanStack Query,
  Zod, Drizzle, and Neon stack. Reuse `app/` and `server/` organization.
- Keep database operations server-only and inside repositories. Client features
  consume typed operations through hooks. Preserve result validation and wire types.
- Use existing filter contexts for filters/sorting/pagination, TanStack Query for
  fetched data, and component state for transient UI. URL filters are not implemented.
- Keep the public read-only query behavior unless the requested task changes it.
  There is no auth/admin or ingestion runtime here.
- Read database definitions from `drizzle/schema.ts`; the Drizzle config's
  `server/db/schema.ts` path is stale. Do not run schema push/migrations as routine
  build or verification steps.
- Keep `DATABASE_URL` server-side and never print secrets while discovering env
  requirements. No `env.ts` or external API credentials are required by current code.
- Preserve expense aggregation, filtering, stable ordering, and profile-scoped
  reset behavior described in [data-access rules](data-access-rules.md).

## UI boundaries

Reuse custom UI components and semantic tokens. shadcn, Radix, CVA, class-merging
helpers, atomic component folders, and chart/test libraries are not installed.
Do not add them simply because a generic convention mentions them.

Follow [component guidelines](component-guidelines.md),
[composition patterns](composition-pattern.md),
[design system rules](design-system-rules.md), and [accessibility](accessibility.md).
Existing arbitrary-value utilities and local class composition are supported
patterns, not documented lint violations.

## Verification and reporting

Use the commands actually present in `package.json`; lint is separate from build.
No `test` script, test runner, Storybook, or CI workflow is configured. Run relevant
checks for code changes and report exact failures or untested behavior. For docs
changes, verify source claims, links/paths, commands, and diff scope; do not imply
runtime behavior was tested. Never invent test results, crawler schedules, or
completed routes from labels or commented code.
