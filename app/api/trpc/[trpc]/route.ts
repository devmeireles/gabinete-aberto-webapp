import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { createContext } from "@/server/trpc/init";
import { appRouter } from "@/server/trpc/routers/_app";

function handler(req: Request): Promise<Response> {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext,
  });
}

export { handler as GET, handler as POST };
