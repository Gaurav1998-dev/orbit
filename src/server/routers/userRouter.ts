

import { db } from "@/db";
import { user } from "@/db/auth-schema";
import { DEFAULT_ANALYSIS_PROMPT } from "@/server/default-analysis-prompt";
import { protectedProcedure, router } from "@/server/trpc";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const userRouter = router({
  getAnalysisPrompt: protectedProcedure.query(async ({ ctx }) => {
    const result = await db.query.user.findFirst({
      where: (u, { eq }) => eq(u.id, ctx.session.user.id),
      columns: { analysisPrompt: true },
    });

    return {
      analysisPrompt: result?.analysisPrompt ?? DEFAULT_ANALYSIS_PROMPT,
    };
  }),

  updateAnalysisPrompt: protectedProcedure
    .input(
      z.object({
        analysisPrompt: z.string().min(1),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await db
        .update(user)
        .set({ analysisPrompt: input.analysisPrompt })
        .where(eq(user.id, ctx.session.user.id));

      return { success: true };
    }),

  resetAnalysisPrompt: protectedProcedure.mutation(async ({ ctx }) => {
    await db
      .update(user)
      .set({ analysisPrompt: null })
      .where(eq(user.id, ctx.session.user.id));

    return { success: true };
  }),
});
