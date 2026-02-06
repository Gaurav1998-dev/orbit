import { appRouter } from "@/server/routers";
import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { handle } from "hono/vercel";

const app = new Hono().basePath("/api");

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    onError: (opts) => {
      console.error(opts.error);
    },
  }),
);

export const GET = handle(app);
export const POST = handle(app);
