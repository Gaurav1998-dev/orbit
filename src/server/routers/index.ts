import { router } from "../trpc";
import { userRouter } from "./userRouter";
import { xAnalysisRouter } from "./xAnalysisRouter";
import { xRouter } from "./xRouter";

export const appRouter = router({
  user: userRouter,
  xAnalysis: xAnalysisRouter,
  x: xRouter,
});

export type AppRouter = typeof appRouter;
