"use client";

import { trpc } from "@/lib/trpc";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import { IconFileAnalytics } from "@tabler/icons-react";

export function NavAnalyses() {
  const pathname = usePathname();
  const { data: analyses, isLoading } = useQuery(
    trpc.xAnalysis.list.queryOptions()
  );

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
                  <Link href={href}>
                    <IconFileAnalytics className="size-4" />
                    <span>@{analysis.xUser.xUsername}</span>
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