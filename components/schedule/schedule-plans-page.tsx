"use client";

import { startTransition, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ServicePlanTableSelector } from "@/components/service-plan-table-selector";

function buildPlanWorkspaceUrl(serviceTypeId: string, planId: string): string {
  const searchParams = new URLSearchParams();
  searchParams.set("serviceTypeId", serviceTypeId);
  searchParams.set("planId", planId);
  return `/schedule/plan?${searchParams.toString()}`;
}

export function SchedulePlansPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.toString();

  useEffect(() => {
    if (!searchQuery) return;

    startTransition(() => {
      router.replace("/schedule");
    });
  }, [router, searchQuery]);

  const handleServicePlanSelect = useCallback(
    ({ serviceTypeId, planId }: { serviceTypeId: string; planId: string }) => {
      const nextUrl = buildPlanWorkspaceUrl(serviceTypeId, planId);

      startTransition(() => {
        router.push(nextUrl);
      });
    },
    [router]
  );

  return (
    <main className="flex h-full min-h-0 flex-col overflow-hidden bg-background">
      <div className="mx-auto flex w-full max-w-7xl min-h-0 flex-1 flex-col px-3 py-3 sm:px-4 sm:py-4">
        <ServicePlanTableSelector
          selectedServiceTypeId={null}
          selectedPlanId={null}
          onSelect={handleServicePlanSelect}
        />
      </div>
    </main>
  );
}
