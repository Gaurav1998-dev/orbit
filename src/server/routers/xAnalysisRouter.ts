import { db } from "@/db";
import { analysis } from "@/db/analysis-schema";
import { xUser } from "@/db/x-schema";
import { protectedProcedure, router } from "@/server/trpc";
import { syncAndAnalyzeXPosts } from "@/server/workflows/sync-and-analyze-x-posts";
import { verifyXUsername } from "@/server/x";
import { TRPCError } from "@trpc/server";
import { start } from "workflow/api";
import { z } from "zod";

export type XUserAnalysisMap = {
  xUserRecordXUserId: string;
  analysisRecordId: string;
};

export const xAnalysisRouter = router({
  run: protectedProcedure
    .input(z.object({ xUsernames: z.array(z.string()) }))
    .mutation(async ({ input, ctx }) => {
      const analysisRecordIds = await Promise.all(
        input.xUsernames.map(async (xUsername) => {
          const verifiedXUserResponse = await verifyXUsername(xUsername);

          if (!verifiedXUserResponse?.data?.id) {
            return null;
          }

          /**
           * Upsert xUser record
           */
          const [xUserRecord] = await db
            .insert(xUser)
            .values({
              xUserId: verifiedXUserResponse.data.id,
              xUsername: xUsername,
              xUrl: verifiedXUserResponse.data.url ?? "",
              xProfileImageUrl:
                verifiedXUserResponse.data.profileImageUrl ?? "",
              xDescription: verifiedXUserResponse.data.description ?? "",
              xUserCreatedAt: verifiedXUserResponse.data.createdAt ?? "",
            })
            .onConflictDoUpdate({
              target: xUser.xUsername,
              set: {
                xUrl: verifiedXUserResponse.data.url ?? "",
                xProfileImageUrl:
                  verifiedXUserResponse.data.profileImageUrl ?? "",
                xDescription: verifiedXUserResponse.data.description ?? "",
                updatedAt: new Date(),
              },
            })
            .returning();

          const [insertedAnalysisRecord] = await db
            .insert(analysis)
            .values({
              userId: ctx.session.user.id,
              xUserFk: xUserRecord.id,
              analysisStage: "pending",
            })
            .returning();

          await start(syncAndAnalyzeXPosts, [
            xUserRecord.id,
            xUserRecord.xUserId,
            insertedAnalysisRecord.id,
          ]);

          return insertedAnalysisRecord.id;
        }),
      );

      return analysisRecordIds.filter(Boolean)[0];
    }),
  getById: protectedProcedure
    .input(z.object({ analysisId: z.string() }))
    .query(async ({ input }) => {
      const result = await db.query.analysis.findFirst({
        where: (analysis, { eq }) => eq(analysis.id, input.analysisId),
        with: {
          analysisXPosts: {
            with: {
              post: true,
            },
          },
        },
      });

      if (!result) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Analysis not found",
        });
      }

      return result;
    }),
  list: protectedProcedure.query(async ({ ctx }) => {
    const results = await db.query.analysis.findMany({
      where: (analysis, { eq }) => eq(analysis.userId, ctx.session.user.id),
      with: {
        xUser: true,
      },
      orderBy: (analysis, { desc }) => [desc(analysis.createdAt)],
    });

    if (results.length === 0) {
      return [];
    }

    return results;
  }),
});
