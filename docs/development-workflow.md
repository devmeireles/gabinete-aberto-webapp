# Development workflow

This is a repository-local workflow, based on `package.json`, configuration, and
source files. It does not assume unavailable test, ingestion, or deployment tools.

## Discover before changing

Read root `AGENTS.md` and check `git status --short`. Use `rg --files app server
drizzle docs` to find the relevant implementation. Inspect `package.json`,
`next.config.ts`, `tsconfig.json`, and `eslint.config.mjs` before changing tooling.
The `@/` alias resolves to the repository root.

Trace a feature through page → view → filter provider/query hook → tRPC router →
service → repository → schema/database tables. For expenses, start with
`app/features/despesas/`, `app/contexts/despesas-filters.context.tsx`,
`app/hooks/use-despesas.ts`, and `server/{schemas,repositories}/despesa.*.ts`.

Before writing Next.js code, read the relevant guide under
`node_modules/next/dist/docs/`, as required by `AGENTS.md`. Useful installed paths:

- `01-app/01-getting-started/05-server-and-client-components.md`
- `01-app/03-api-reference/03-file-conventions/page.md`
- `01-app/02-guides/migrating-to-cache-components.md`
- `01-app/02-guides/environment-variables.md`
- `01-app/02-guides/testing/index.md`

The local Next.js version has its own APIs and conventions. In particular, keep
async route params and Cache Components/Suspense behavior in mind. Do not disable
framework features merely to bypass a build failure.

## Install and run

Use npm with the checked-in `package-lock.json`. For a clean dependency install:

```sh
npm ci
```

Skip reinstalling dependencies when the existing installation suffices. Configure
a server-side `DATABASE_URL` for a suitable existing Neon/PostgreSQL database using
local environment configuration; never commit or print its value. There is no
checked-in environment template or seed script. Next loads its environment files;
standalone tools can have different loading rules.

```sh
npm run dev
```

Open the local URL printed by Next (normally `http://localhost:3000`). Avoid starting
a duplicate server when one is already running. Data queries need an accessible,
populated database; the UI is not backed by fallback fixtures.

## Build and static checks

Available package scripts are `dev`, `build`, `start`, `format:check`,
`format:fix`, `lint:check`, `lint:fix`, `typecheck`, and `check`:

```sh
npm run format:check
npm run lint:check
npm run typecheck
npm run check
npm run build
```

`lint:check` runs ESLint with Next core-web-vitals and TypeScript presets; no
custom style/a11y guardrail rules are configured. `typecheck` runs `tsc --noEmit`.
`check` runs formatting, lint, and type checks in sequence. `PageProps`/`LayoutProps`
come from generated Next route types; if they are absent in a clean checkout, run
`npx next typegen` before the compiler check. A running dev server or build also
generates route types.

`build` compiles and prerenders the production app; it does not replace lint or
manual interaction checks. The layout uses Google-hosted Geist fonts via
`next/font/google`, so font retrieval can require network access. Server module
initialization needs environment configuration. Report environment/network failures
separately from code failures, and do not expose connection credentials in logs.

After a successful build, `npm run start` serves the production output. No CI
workflow, deployment command, or hosting configuration is checked in.

## Manual verification for behavior changes

There is no `test` script, installed test runner, browser harness, or Storybook.
Choose checks that exercise the changed behavior and report what you actually ran.
Relevant flows include:

- `/deputados`: name/attribute filters, debounced text, pagination, and reset.
- `/deputados/[id]`: valid detail, malformed/nonpositive route ID, and a missing
  positive ID. Invalid route IDs call `notFound`; absent records raise tRPC
  `NOT_FOUND` and are handled by the client view.
- `/fornecedores`: name/CPF/CNPJ search, sort, pagination, and reset.
- `/fornecedores/[id]`: valid and missing supplier IDs, all-legislature expense
  results, legislature/month/type filters, sorting, and reset retaining supplier ID.
- Profile expenses: confirm hidden deputy column, available legislatures, and reset
  retaining the profile's deputy and initial legislature.
- `/despesas`: supplier name/CPF/CNPJ, expense type, inclusive month bounds, inverted
  range, empty results, default/toggled sort, and pagination.
- Confirm expense totals describe all filtered results and remain independent of
  page size; check null document dates/links and placeholder-data transitions.
- Check loading/error feedback, narrow-screen table scrolling, mobile navigation,
  keyboard operation, and light/dark/automatic theme modes.

For documentation-only edits, review source accuracy, relative links, file paths,
command availability, and diff scope. Runtime tests are unnecessary when no
executable behavior changes.

## Database tooling limitation

Runtime imports `drizzle/schema.ts`. `drizzle.config.ts` points to the nonexistent
`server/db/schema.ts` and explicitly loads `.env.local` via dotenv. There are
migration artifacts under `drizzle/`, but no migration/package scripts or documented
crawler runtime. Do not present `drizzle-kit push`, generation, migration, or a
crawler schedule as a verified setup step. Resolving schema configuration or
applying database changes belongs to a separate, appropriately scoped task.

## Finish

Inspect the diff and working-tree status. Preserve unrelated user changes. Report
what changed, which checks ran, and any remaining limitations; update affected
guides whenever a code change invalidates their descriptions.
