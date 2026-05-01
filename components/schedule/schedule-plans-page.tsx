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
    <main className="min-h-[calc(100svh-3.5rem)] bg-background">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 md:py-8">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Schedule</h1>
          <p className="text-muted-foreground">Choose a service plan to open the planner.</p>
        </header>

        <ServicePlanTableSelector
          selectedServiceTypeId={null}
          selectedPlanId={null}
          onSelect={handleServicePlanSelect}
        />
      </div>
    </main>
  );
}
