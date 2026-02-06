"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function PromptEditorDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const [promptValue, setPromptValue] = useState("");

  const { data, isLoading } = useQuery(
    trpc.user.getAnalysisPrompt.queryOptions(),
  );

  const updateMutation = useMutation(
    trpc.user.updateAnalysisPrompt.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.user.getAnalysisPrompt.queryOptions().queryKey,
        });
        onOpenChange(false);
      },
    }),
  );

  const resetMutation = useMutation(
    trpc.user.resetAnalysisPrompt.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.user.getAnalysisPrompt.queryOptions().queryKey,
        });
        onOpenChange(false);
      },
    }),
  );

  useEffect(() => {
    if (data?.analysisPrompt) {
      setPromptValue(data.analysisPrompt);
    }
  }, [data?.analysisPrompt]);

  const isSaving = updateMutation.isPending || resetMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] flex-col sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Analysis Prompt</DialogTitle>
          <DialogDescription>
            Customize the prompt used to compare top 5 and bottom 5 posts. Use{" "}
            <code className="bg-muted rounded px-1 py-0.5 text-xs">
              {"{topPosts}"}
            </code>{" "}
            and{" "}
            <code className="bg-muted rounded px-1 py-0.5 text-xs">
              {"{bottomPosts}"}
            </code>{" "}
            as placeholders for the post data.
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto py-2">
          <Textarea
            value={promptValue}
            onChange={(e) => setPromptValue(e.target.value)}
            className="min-h-[300px] font-mono text-sm"
            placeholder={isLoading ? "Loading..." : "Enter your analysis prompt..."}
            disabled={isLoading || isSaving}
          />
        </div>
        <DialogFooter className="flex-row justify-between sm:justify-between">
          <Button
            variant="outline"
            onClick={() => resetMutation.mutate()}
            disabled={isSaving}
          >
            Reset to Default
          </Button>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={() =>
                updateMutation.mutate({ analysisPrompt: promptValue })
              }
              disabled={isSaving || !promptValue.trim()}
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
