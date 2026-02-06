"use client";

import { AnalysisFaq } from "./components/analysis-faq";
import { XHandlesInput } from "./components/x-handles-input";
import { XUsageInfo } from "./components/x-usage-info";

export default function Page() {
  return (
    <div className="flex flex-col gap-4 pt-[15vh] md:gap-6 flex-1">
      <div className="max-w-md self-center flex flex-col gap-2">
        <XHandlesInput />
        <XUsageInfo />
      </div>
      <div className="max-w-lg self-center w-full mt-16">
        <AnalysisFaq />
      </div>
    </div>
  );
}
