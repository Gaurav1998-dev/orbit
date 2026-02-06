import { initTRPC, TRPCError } from "@trpc/server";
import { headers } from "next/headers";
import { auth } from "./auth";

const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ next }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({ ctx: { session } });
});
