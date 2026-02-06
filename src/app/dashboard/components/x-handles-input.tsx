"use client";

import { Button } from "@/components/ui/button";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { TagsInput } from "@/components/ui/tags-input";
import { trpc } from "@/lib/trpc";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function XHandlesInput() {
  const router = useRouter();
  const [tags, setTags] = useState<string[]>([]);

  const runAnalysis = useMutation(
    trpc.xAnalysis.run.mutationOptions({
      onSuccess: (data) => {
        if (data) {
          router.push(`/dashboard/a/${data}`);
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  return (
    <>
      <label htmlFor="tags-input" className="block text-sm font-medium">
        X handles
      </label>
      <TagsInput
        id="tags-input"
        value={tags}
        onChange={setTags}
        placeholder="Start typing..."
        maxTags={10}
      />
      <p className="text-xs text-muted-foreground">
        <KbdGroup>
          <Kbd>Enter</Kbd>, <Kbd>Tab</Kbd>, <Kbd>Comma</Kbd>
        </KbdGroup>{" "}
        to add and <Kbd>Delete</Kbd> to remove.
      </p>
      <Button
        size="sm"
        variant="outline"
        className="mt-2"
        disabled={tags.length === 0}
        onClick={() => runAnalysis.mutate({ xUsernames: tags })}
      >
        Run analysis
      </Button>
    </>
  );
}
