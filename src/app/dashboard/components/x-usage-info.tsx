"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { trpc } from "@/lib/trpc";
import { useQuery } from "@tanstack/react-query";
import { CircleHelp } from "lucide-react";

function getDaysUntilReset(resetDay: number): number {
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  let resetDate: Date;
  if (currentDay < resetDay) {
    // Reset is this month
    resetDate = new Date(currentYear, currentMonth, resetDay);
  } else {
    // Reset is next month
    resetDate = new Date(currentYear, currentMonth + 1, resetDay);
  }

  const diffTime = resetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function XUsageInfo() {
  const getXUsage = useQuery(trpc.x.getXUsage.queryOptions());

  if (getXUsage.isError) {
    console.log("Error getting X usage:", getXUsage.error.message);
  }

  if (getXUsage.isPending) {
    return <Skeleton className="h-4 w-48" />;
  }

  if (getXUsage.isError) {
    return (
      <p className="text-xs text-muted-foreground flex items-center">
        {getXUsage.error.message}
      </p>
    );
  }

  const { project_usage, project_cap, cap_reset_day } = getXUsage.data;

  return (
    <p className="text-xs text-muted-foreground flex items-center">
      {project_usage ?? 0} / {project_cap ?? 0} posts
      <span className="mx-1">·</span>
      Resets in {getDaysUntilReset(cap_reset_day)}d
      <Tooltip>
        <TooltipTrigger asChild>
          <CircleHelp className="h-3 w-3 ml-1.5 cursor-help text-muted-foreground" />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs text-xs">
          X API Basic plan allows us to retrive up to {project_cap ?? "0"}{" "}
          posts/month. Resets every month.
        </TooltipContent>
      </Tooltip>
    </p>
  );
}
