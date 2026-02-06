"use client";

import { XHandlesInput } from "./components/x-handles-input";
import { XUsageInfo } from "./components/x-usage-info";

export default function Page() {
  return (
    <div className="flex flex-col gap-4 pt-[35vh] md:gap-6 flex-1">
      <div className="max-w-md self-center flex flex-col gap-2">
        <XHandlesInput />
        <XUsageInfo />
      </div>
    </div>
  );
}
