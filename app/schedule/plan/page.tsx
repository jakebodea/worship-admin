import { Suspense } from "react";
import { DashboardPage } from "@/components/dashboard-page";
import { SchedulePlanWorkspaceFallback } from "@/components/schedule/schedule-page-fallbacks";

export default function SchedulePlanPage() {
  return (
    <Suspense fallback={<SchedulePlanWorkspaceFallback />}>
      <DashboardPage />
    </Suspense>
  );
}
