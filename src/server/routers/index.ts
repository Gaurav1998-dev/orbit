import { router } from "../trpc";
import { xAnalysisRouter } from "./xAnalysisRouter";
import { xRouter } from "./xRouter";

export const appRouter = router({
  xAnalysis: xAnalysisRouter,
  x: xRouter,
});

export type AppRouter = typeof appRouter;
