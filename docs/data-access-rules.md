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

- `legislaturaId`, deputy, supplier ID/text, type, and month bounds are optional.
  The public expenses page supplies its configured legislature; supplier profiles
  omit it initially to include expenses across all legislatures.
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

## Dashboard metrics

The dashboard uses dedicated grouped queries rather than loading paginated
expense rows into the client. It resolves the single row marked
`legislaturaAtual` server-side and scopes all totals to that legislature, without
client-supplied legislature or month filters. Party totals use the party
affiliation valid for the expense document date (or the first day of its
competence when that date is unavailable); expenses without an identifiable
affiliation are not included in the party breakdown. The per-member headline
divides the net total by all deputies registered in the current legislature.
State map metrics are grouped by `deputado_legislaturas.sigla_uf` for that same
legislature. The expense join is left-sided so deputies with no expenses still
count in the state average denominator. Null or empty UF expense totals are
returned separately and are not assigned to a state.

The response includes the current legislature's `dataInicio` and `dataFim` for
the monthly chart. If no row is marked current, or multiple rows are marked
current, the dashboard query fails explicitly rather than choosing an arbitrary
legislature.

## Sources and environment

The app reads the existing Câmara-domain database. There is no crawler, ingestion
service, Inngest workflow, seed command, or external API client in this repository.
Crawler/raw-payload tables in `drizzle/schema.ts` do not establish a runnable
ingestion process or verify its schedule.

Supplier list totals are the sum of linked expenses' gross document values
(`valorDocumento`), not verified supplier payments. The list computes this with a
single grouped join; expenses have an index on `fornecedorId`. If list volume or
query cost grows, measure the query before considering a maintained summary table.
The supplier card's service category is the most frequent linked expense type,
counted across that supplier's records; it identifies a predominant category,
not the supplier's exclusive business activity.

`server/db/client.ts` reads server-side `process.env.DATABASE_URL` directly; there
is no `env.ts` validation module. Never expose the connection string through a
`NEXT_PUBLIC_` variable, client code, logs, or documentation examples with secrets.
See [development workflow](development-workflow.md) before using Drizzle tooling;
its configured schema path currently differs from the actual schema location.
