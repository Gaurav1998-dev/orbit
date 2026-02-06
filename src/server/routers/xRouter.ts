import { protectedProcedure, router } from "@/server/trpc";
import { xClient } from "@/server/x";
import { TRPCError } from "@trpc/server";
import type { ApiError } from "@xdevplatform/xdk";

type XUsageData = {
  cap_reset_day: number;
  project_cap: number;
  project_id: string;
  project_usage: number;
};

export const xRouter = router({
  getXUsage: protectedProcedure.query(async () => {
    try {
      const usageResponse = await xClient.usage.get();
      
      return usageResponse.data as XUsageData;
    } catch (error) {
      if ((error as ApiError).status === 429) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "X Usage API rate limit exceeded. Retry in 15 min.",
          cause: error,
        });
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: (error as ApiError).message,
          cause: error,
        });
      }
    }
  }),
});
