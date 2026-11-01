# Data access rules

Use the implemented path documented in [data access](data-access.md). Keep database
queries in repositories, orchestration/business rules in services, input contracts
in server schemas, and client fetching in feature hooks.

## Server boundaries

- Preserve `server-only` protection around database access, repositories, services,
  and runtime tRPC server modules. Client imports of server types should use
  `import type`; shared schema modules must remain safe for their actual consumers.
- Extend a domain through its schema, repository/service interfaces and factories,
  router, and hook as needed. Wire new dependencies in `server/services/index.ts`
  and expose routers through `server/trpc/routers/_app.ts`.
- Keep SQL values parameterized through Drizzle. Sorting uses explicit allowed
  column maps; never interpolate an arbitrary client-provided SQL identifier.
- Preserve literal substring searches: repositories escape LIKE wildcards before
  applying `ilike` to deputy names or supplier name/CPF/CNPJ.
- Result schemas parse mapped repository output. Do not silently discard invalid
  rows or replace a validation failure with fabricated data.

## Expense behavior to preserve

`server/schemas/despesa.schema.ts` defines the sortable columns in
`DESPESA_ORDENAR_POR`. Its repository map and table controls use the same domain.

- `legislaturaId` is required; deputy/type, supplier, and month bounds are optional.
- Months use `YYYY-MM`; bounds compare the expense `(ano, mes)` tuple inclusively,
  rather than filtering `dataDocumento`.
- Inverted month bounds naturally return no matches; the service does not throw.
- Default order is document date descending. Both directions put nulls last;
  expense ID descending breaks ties for stable pagination.
- Pagination is one-based, defaults to 20 items, and caps page size at 100.
  `totalPaginas` is at least 1 even for empty results.
- Counts and gross/deduction/net totals cover the full filtered result, not just
  the current page. Row and aggregate queries run separately with shared filters.
- Party labels come from `deputadoDetalhes`; UF comes from the deputy/legislature
  relationship. Do not claim party labels are historical as of the expense date.
- IDs, amounts, nullable documents, party, and UF follow the serialized schema
  described in [data access](data-access.md).

## Sources and environment

The app reads the existing Câmara-domain database. There is no crawler, ingestion
service, Inngest workflow, seed command, or external API client in this repository.
Crawler/raw-payload tables in `drizzle/schema.ts` do not establish a runnable
ingestion process or verify its schedule.

`server/db/client.ts` reads server-side `process.env.DATABASE_URL` directly; there
is no `env.ts` validation module. Never expose the connection string through a
`NEXT_PUBLIC_` variable, client code, logs, or documentation examples with secrets.
See [development workflow](development-workflow.md) before using Drizzle tooling;
its configured schema path currently differs from the actual schema location.
