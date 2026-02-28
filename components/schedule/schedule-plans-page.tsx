"use client";

import { startTransition, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AccountMenu } from "@/components/account-menu";
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

  const selectedServiceTypeId = searchParams.get("serviceTypeId");
  const selectedPlanId = searchParams.get("planId");

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
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Schedule</h1>
            <p className="text-muted-foreground">Choose a service plan to open the planner.</p>
          </div>

          <AccountMenu />
        </div>

        <ServicePlanTableSelector
          selectedServiceTypeId={selectedServiceTypeId}
          selectedPlanId={selectedPlanId}
          onSelect={handleServicePlanSelect}
        />
      </div>
    </div>
  );
}
