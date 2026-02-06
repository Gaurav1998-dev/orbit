import { NavAnalyses } from "@/components/nav-analyses";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { auth } from "@/server/auth";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import type * as React from "react";

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const data = {
    user: {
      name: session?.user?.name ?? "",
      email: session?.user?.email ?? "",
      avatar: session?.user?.image ?? "",
    },
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/dashboard">
                <Image
                  src="/orbit-logo.svg"
                  alt="Orbit"
                  className="!size-5"
                  width={100}
                  height={100}
                />
                <span className="text-base font-semibold">Orbit</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="mt-2">
        <NavMain />
        <NavAnalyses />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
