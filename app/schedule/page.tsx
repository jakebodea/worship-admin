import { Suspense } from "react";
import { DashboardPage } from "@/components/dashboard-page";

export default function SchedulePage() {
  return (
    <Suspense fallback={null}>
      <DashboardPage />
    </Suspense>
  );
}
