"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import { TagsInput } from "@/components/ui/tags-input";
import { queryClient, trpc } from "@/lib/trpc";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const MIN_POSTS = 5;
const MAX_POSTS = 100;
const DEFAULT_POSTS = 100;

export function XHandlesInput() {
  const router = useRouter();
  const [tags, setTags] = useState<string[]>([]);
  const [maxPosts, setMaxPosts] = useState(DEFAULT_POSTS);

  const runAnalysis = useMutation(
    trpc.xAnalysis.run.mutationOptions({
      onSuccess: async (data) => {
        if (data) {
          await queryClient.refetchQueries({
            queryKey: trpc.xAnalysis.list.queryOptions().queryKey,
          });
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
      <div className="mt-3 space-y-2">
        <Label htmlFor="max-posts">Number of posts to fetch (per profile)</Label>
        <Input
          id="max-posts"
          type="number"
          min={MIN_POSTS}
          max={MAX_POSTS}
          value={maxPosts}
          onChange={(e) => {
            const v = e.target.valueAsNumber;
            if (!Number.isNaN(v)) {
              setMaxPosts(Math.min(MAX_POSTS, Math.max(MIN_POSTS, v)));
            }
          }}
          className="w-24"
        />
        <p className="text-xs text-muted-foreground">
          {MIN_POSTS}–{MAX_POSTS} posts
        </p>
      </div>
      <Button
        size="sm"
        variant="outline"
        className="mt-2"
        disabled={tags.length === 0 || runAnalysis.isPending}
        onClick={() =>
          runAnalysis.mutate({ xUsernames: tags, maxPosts })
        }
      >
        Run analysis
      </Button>
    </>
  );
}
