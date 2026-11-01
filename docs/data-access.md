# Data access

The existing typed data path is tRPC → services → repositories → Drizzle →
Neon/PostgreSQL. Client views use feature hooks backed by TanStack Query. There is
no separate fixture/adapter layer or Prisma client.

## Implementation map

| Concern                    | Source                                                      |
| -------------------------- | ----------------------------------------------------------- |
| HTTP transport             | `app/api/trpc/[trpc]/route.ts`, using `fetchRequestHandler` |
| Router composition         | `server/trpc/routers/_app.ts`                               |
| Context and procedure base | `server/trpc/init.ts`: `createContext`, `baseProcedure`     |
| Dependency construction    | `server/services/index.ts`                                  |
| Domain contracts           | `server/schemas/*.schema.ts`                                |
| Database operations        | `server/repositories/*.repository.ts`                       |
| Database connection        | `server/db/client.ts`, Neon HTTP driver                     |
| Database tables            | `drizzle/schema.ts` (relations in `drizzle/relations.ts`)   |
| Client provider            | `app/lib/trpc/client.tsx`                                   |
| Cache defaults             | `app/lib/trpc/query-client.ts`                              |
| Feature queries            | `app/hooks/use-*.ts`                                        |

## Procedures

All current procedures are queries built from `baseProcedure`, without auth
middleware:

- `legislatura.list`
- `deputado.list`, `deputado.detail`, `deputado.opcoesFiltro`
- `despesa.list`, `despesa.tipos`
- `fornecedor.list`, `fornecedor.detail`

POST transport support does not imply that mutation procedures exist.
`deputado.detail` raises tRPC `NOT_FOUND` when the repository returns `null`.
`fornecedor.detail` raises `NOT_FOUND` for an unknown supplier ID. Supplier list
and detail contracts live in `server/schemas/fornecedor.schema.ts`. Supplier
list joins expenses once, groups by supplier, and sums gross document values;
this aggregate also supports ordering by total declared value.

## Validation and serialization

Routers validate inputs with Zod. Repositories map database rows and parse result
schemas before returning them. Current schemas use `z.object`, without `.strict()`,
and routers do not declare `.output()` validators. Do not describe validation as
strict at every layer or add validators merely to match a generic guide.

Expense row IDs are serialized as strings from database bigint values. Expense
amounts and aggregate sums become JavaScript numbers; dates/timestamps are strings
or null according to the result schema. Preserve these wire types and the declared
nullability. A database column and an application schema can differ: inspect both
before treating either as a complete description of a result.

## Client delivery and cache

Hooks use `@trpc/tanstack-react-query` query options with TanStack `useQuery`, not
legacy `api.*.useQuery` hooks. `httpBatchLink` targets `/api/trpc`. A browser query
client is reused; server renders create their own query client. No server prefetch
or `HydrateClient` implementation exists.

The query client defaults to a one-minute stale time. Deputy/expense list hooks
use five minutes and `keepPreviousData`; text search is debounced by 400 ms, omits
terms shorter than two characters, and pauses querying while typing. Deputy birth
years are sent only after four digits. Detail uses one hour and disables retries;
legislatures, filter options, and expense types use one-day stale and GC times.

Supplier search is debounced by 400 ms and ignores terms shorter than two
characters. Supplier detail uses the expense list with a fixed supplier ID and
all legislatures selected initially; the legislature filter can narrow that view.

Filter contexts contain UI state rather than fetched data. See
[data-access rules](data-access-rules.md) for query invariants and
[architecture](architecture.md) for state ownership.
