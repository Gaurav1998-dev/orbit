"use client";

import { PromptEditorDialog } from "@/components/prompt-editor-dialog";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { IconPrompt } from "@tabler/icons-react";
import { useState } from "react";

export function NavPromptSettings() {
  const [promptDialogOpen, setPromptDialogOpen] = useState(false);

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton onClick={() => setPromptDialogOpen(true)}>
            <IconPrompt />
            <span>Analysis Prompt</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      <PromptEditorDialog
        open={promptDialogOpen}
        onOpenChange={setPromptDialogOpen}
      />
    </>
  );
}
