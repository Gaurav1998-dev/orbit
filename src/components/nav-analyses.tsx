"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import { trpc } from "@/lib/trpc";
import { useQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function formatAnalysisTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMins < 60) {
    return `${diffMins}m`;
  }
  if (diffHours < 24) {
    return `${diffHours}h`;
  }
  if (diffDays < 7) {
    return `${diffDays}d`;
  }

  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function NavAnalyses() {
  const pathname = usePathname();

  // Re-render every 60s to keep relative timestamps fresh
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(interval);
  }, []);

  const { data: analyses, isLoading } = useQuery({
    ...trpc.xAnalysis.list.queryOptions(),
    refetchInterval: (query) => {
      const hasAnyPending = query.state.data?.some(
        (a) => a.analysisStage === "pending",
      );
      return hasAnyPending ? 4000 : false;
    },
  });

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Analyses</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {isLoading && (
            <>
              <SidebarMenuSkeleton />
              <SidebarMenuSkeleton />
              <SidebarMenuSkeleton />
            </>
          )}
          {analyses?.map((analysis) => {
            const href = `/dashboard/a/${analysis.id}`;
            const isActive = pathname === href;

            return (
              <SidebarMenuItem key={analysis.id}>
                <SidebarMenuButton asChild isActive={isActive}>
                  <Link href={href} className="flex w-full items-center gap-2">
                    <Avatar className="size-6 shrink-0">
                      <AvatarImage
                        src={analysis.xUser.xProfileImageUrl ?? undefined}
                        alt={`@${analysis.xUser.xUsername}`}
                      />
                      <AvatarFallback className="text-[10px]">
                        @{analysis.xUser.xUsername.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="min-w-0 flex-1 truncate">
                      @{analysis.xUser.xUsername}
                    </span>
                    {analysis.analysisStage === "pending" ? (
                      <Loader2Icon className="size-4 shrink-0 animate-spin text-muted-foreground" />
                    ) : (
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {formatAnalysisTime(new Date(analysis.createdAt))}
                      </span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
          {!isLoading && analyses?.length === 0 && (
            <p className="px-2 py-1.5 text-xs text-muted-foreground">
              No analyses yet
            </p>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
