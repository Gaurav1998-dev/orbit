"use client";

import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { TagsInput } from "@/components/ui/tags-input";
import { useState } from "react";

export default function Page() {
  const [tags, setTags] = useState<string[]>();

  return (
    <div className="flex flex-col gap-4 pt-[35vh] md:gap-6 flex-1">
      <div className="max-w-md space-y-2 self-center">
        <label htmlFor="tags-input" className="block text-sm font-medium mb-2">
          X handles
        </label>
        <TagsInput
          id="tags-input"
          value={tags}
          onChange={setTags}
          placeholder="Type X handles..."
          maxTags={10}
        />
        <p className="text-xs text-muted-foreground">
          <KbdGroup>
            <Kbd>Enter</Kbd>, <Kbd>Tab</Kbd>, <Kbd>Comma</Kbd>
          </KbdGroup>{" "}
          to add and <Kbd>Delete</Kbd> to remove.
        </p>
      </div>
    </div>
  );
}
