# Architecture

Gabinete Aberto is a public application for exploring Câmara dos Deputados data:
federal deputies, their profiles and party history, and CEAP expenses. This guide
describes the checked-in implementation. When it drifts, update the documentation
from the code; documentation cleanup does not authorize an application redesign.

## Stack and layout

`package.json` declares Next.js 16.4.3, React 19.3.0, TypeScript, Tailwind CSS 4,
tRPC 11, TanStack Query 5, Zod 4, Drizzle ORM, and Neon serverless PostgreSQL.

| Location                                       | Responsibility                                               |
| ---------------------------------------------- | ------------------------------------------------------------ |
| `app/`                                         | App Router pages, layout, global CSS, and tRPC HTTP route    |
| `app/features/{dashboard,deputados,despesas}/` | Domain views and sections                                    |
| `app/components/ui/`                           | Custom reusable UI, including errors, pagination, and totals |
| `app/components/layout/`                       | Header, footer, and theme toggle                             |
| `app/contexts/`                                | Filter values and actions scoped to a view                   |
| `app/hooks/`                                   | Query hooks, debounce, and filter helpers                    |
| `app/lib/`                                     | tRPC provider/query client and formatting helpers            |
| `app/interfaces/`                              | Existing UI interfaces                                       |
| `server/trpc/`                                 | Context, router composition, and procedures                  |
| `server/services/`                             | Service interfaces/factories and dependency wiring           |
| `server/repositories/`                         | Drizzle queries and result mapping/validation                |
| `server/schemas/`                              | Zod contracts and inferred domain types                      |
| `server/db/client.ts`                          | Server-only Neon/Drizzle client                              |
| `drizzle/`                                     | Actual database schema, relations, and migration artifacts   |

## Routes and current scope

| URL                | Entry point                             | Current behavior                                                                         |
| ------------------ | --------------------------------------- | ---------------------------------------------------------------------------------------- |
| `/`                | `app/page.tsx`                          | Dashboard filter controls and introductory content; overview metrics are not implemented |
| `/deputados`       | `app/(publico)/deputados/page.tsx`      | Filtered, paginated deputy list                                                          |
| `/deputados/[id]`  | `app/(publico)/deputados/[id]/page.tsx` | Deputy profile, history, and scoped expenses                                             |
| `/despesas`        | `app/(publico)/despesas/page.tsx`       | Expense filters, totals, sorting, and pagination                                         |
| `/api/trpc/[trpc]` | `app/api/trpc/[trpc]/route.ts`          | tRPC handler exported as GET and POST                                                    |

`(publico)` is a route group, not a URL segment.

## Rendering and data flow

Pages/layout are Server Components composing interactive client views. The root
layout wraps content in `TRPCReactProvider`. Feature hooks use `useTRPC()` and
TanStack Query `useQuery(trpc.<router>.<procedure>.queryOptions(...))`.

```text
view → feature hook → /api/trpc → router → service → repository → Drizzle → Neon/PostgreSQL
```

There is no RSC query prefetch/dehydration layer. Services receive repository
interfaces; `server/services/index.ts` wires them to the database, and tRPC context
exposes the services. Database/runtime server modules use `server-only`.

`next.config.ts` enables Cache Components and partial prefetching. The deputy page
awaits dynamic `params` inside a Suspense boundary; the header also uses Suspense.
The footer caches its year with `use cache` and `cacheLife("weeks")`. Read the
installed Next.js guides before changing rendering or caching behavior, as required
by root `AGENTS.md`.

## State ownership

- TanStack Query owns fetched data, caching, and request state.
- Filter contexts own filter, sort, and pagination state; these are not synchronized
  to URL search parameters.
- Deputy and expense providers split values/actions into separate contexts. Filter
  changes reset page to 1; expense sorting updates column/direction together.
- `initialFilters` is captured once; reset returns to that provider's initial values,
  preserving a deputy constraint on profile pages.
- Component state owns local interactions such as menu expansion and photo failure.
- `ThemeToggle` owns theme selection and persists the `theme` localStorage key.

See [data access](data-access.md), [component guidelines](component-guidelines.md),
and [development workflow](development-workflow.md) for implementation details.
