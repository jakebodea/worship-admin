import { Suspense } from "react";
import { SchedulePlansPage } from "@/components/schedule/schedule-plans-page";

export default function SchedulePage() {
  return (
    <Suspense fallback={null}>
      <SchedulePlansPage />
    </Suspense>
  );
}
