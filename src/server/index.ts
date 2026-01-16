import { publicProcedure, router } from "./trpc";
import { z } from "zod";

export const appRouter = router({
  getTodos: publicProcedure.input(z.object({ name: z.string() })).query(async (opts) => {
    return { message: "Hello, world!" };
  }),
});

export type AppRouter = typeof appRouter;
