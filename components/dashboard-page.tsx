"use client";

import { startTransition, useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { LineupTab } from "@/components/schedule/lineup-tab";
import { PlanTab } from "@/components/schedule/plan-tab";
import { ScheduleViewTab } from "@/components/schedule/schedule-view-tab";
import type { SlotRef } from "@/components/schedule/types";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePeople } from "@/hooks/use-people";
import { usePlans } from "@/hooks/use-plans";
import { useServiceTypes } from "@/hooks/use-service-types";
import { useTeamPositions } from "@/hooks/use-team-positions";
import { queryKeys } from "@/lib/query-keys";
import { cn } from "@/lib/utils";

interface RouteSelectionIds {
  serviceTypeId: string | null;
  planId: string | null;
  teamId: string | null;
  positionId: string | null;
  view: DashboardView;
}

type DashboardView = "schedule" | "lineup" | "plan";
const COLLAPSED_TEAMS_STORAGE_KEY_PREFIX = "schedule-collapsed-teams:";
const COLLAPSED_TEAMS_STORAGE_MAP_KEY = `${COLLAPSED_TEAMS_STORAGE_KEY_PREFIX}by-plan`;
type SearchParamReader = Pick<URLSearchParams, "get">;

function parseDashboardView(value: string | null): DashboardView {
  if (value === "plan") return "plan";
  if (value === "lineup") return "lineup";
  return "schedule";
}

function parseSearchSelection(searchParams: SearchParamReader): RouteSelectionIds {
  const serviceTypeId = searchParams.get("serviceTypeId");
  const planId = searchParams.get("planId");
  const teamId = searchParams.get("teamId");
  const positionId = searchParams.get("positionId");
  const view = parseDashboardView(searchParams.get("view"));

  return {
    serviceTypeId: serviceTypeId ?? null,
    planId: planId ?? null,
    teamId: teamId ?? null,
    positionId: positionId ?? null,
    view,
  };
}

function buildScheduleUrl({
  serviceTypeId,
  planId,
  teamId,
  positionId,
  view,
}: RouteSelectionIds): string {
  const searchParams = new URLSearchParams();
  if (serviceTypeId) searchParams.set("serviceTypeId", serviceTypeId);
  if (planId) searchParams.set("planId", planId);
  if (teamId) searchParams.set("teamId", teamId);
  if (positionId) searchParams.set("positionId", positionId);
  if (view !== "schedule") searchParams.set("view", view);

  const query = searchParams.toString();
  return query ? `/schedule/plan?${query}` : "/schedule/plan";
}

function formatPlanDate(date: Date | string | undefined) {
  if (!date) return "No date";
  const dateObj = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(dateObj.getTime())) return "Invalid date";

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(dateObj);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildPlanSubtitle(
  serviceTypeName: string,
  planTitle: string | undefined,
  seriesTitle: string | undefined
): string | null {
  const rawSubtitle = (seriesTitle ?? planTitle ?? "").trim();
  if (!rawSubtitle) return null;

  const normalizedServiceTypeName = serviceTypeName.trim();
  if (!normalizedServiceTypeName) return rawSubtitle;

  if (rawSubtitle.localeCompare(normalizedServiceTypeName, undefined, { sensitivity: "accent" }) === 0) {
    return null;
  }

  const serviceTypePrefixPattern = new RegExp(
    `^${escapeRegExp(normalizedServiceTypeName)}\\s*[-:|]\\s*`,
    "i"
  );

  const withoutServiceTypePrefix = rawSubtitle.replace(serviceTypePrefixPattern, "").trim();
  if (!withoutServiceTypePrefix) return null;

  if (
    withoutServiceTypePrefix.localeCompare(normalizedServiceTypeName, undefined, {
      sensitivity: "accent",
    }) === 0
  ) {
    return null;
  }

  return withoutServiceTypePrefix;
}

export function DashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const [collapsedTeamsByPlan, setCollapsedTeamsByPlan] = useState<
    Record<string, Record<string, boolean>>
  >(() => {
    if (typeof window === "undefined") return {};
    try {
      const raw = window.localStorage.getItem(COLLAPSED_TEAMS_STORAGE_MAP_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};

      const normalized: Record<string, Record<string, boolean>> = {};
      for (const [planId, value] of Object.entries(parsed)) {
        if (!value || typeof value !== "object" || Array.isArray(value)) continue;
        normalized[planId] = Object.fromEntries(
          Object.entries(value).map(([teamId, isCollapsed]) => [teamId, Boolean(isCollapsed)])
        ) as Record<string, boolean>;
      }
      return normalized;
    } catch {
      return {};
    }
  });

  const routeIds = useMemo(() => parseSearchSelection(searchParams), [searchParams]);
  const currentUrl = useMemo(() => {
    const query = searchParams.toString();
    return query ? `${pathname}?${query}` : pathname;
  }, [pathname, searchParams]);

  const navigateTo = useCallback(
    (nextIds: RouteSelectionIds, method: "push" | "replace" = "push") => {
      const nextUrl = buildScheduleUrl(nextIds);
      if (nextUrl === currentUrl) return;

      startTransition(() => {
        if (method === "replace") {
          router.replace(nextUrl);
          return;
        }
        router.push(nextUrl);
      });
    },
    [currentUrl, router]
  );

  const { data: serviceTypes, isLoading: serviceTypesLoading } = useServiceTypes();
  const selectedServiceType =
    serviceTypes?.find((serviceType) => serviceType.id === routeIds.serviceTypeId) ?? null;

  const { data: plans, isLoading: plansLoading, isFetching: plansFetching } = usePlans(
    selectedServiceType?.id ?? null
  );
  const selectedPlan = plans?.find((plan) => plan.id === routeIds.planId) ?? null;

  const { data: teamPositionGroups, isLoading: teamPositionsLoading } = useTeamPositions(
    selectedServiceType?.id ?? null,
    selectedPlan?.id ?? null,
    selectedPlan?.seriesId ?? null
  );

  const selectedTeamGroup =
    teamPositionGroups?.find((group) => group.teamId === routeIds.teamId) ?? null;
  const selectedPositionObj =
    selectedTeamGroup?.positions.find((position) => position.id === routeIds.positionId) ?? null;

  const selectedTeam = selectedTeamGroup?.teamId ?? null;
  const selectedPosition = selectedPositionObj?.id ?? null;
  const selectedPlanId = selectedPlan?.id ?? null;
  const collapsedTeams = selectedPlanId ? (collapsedTeamsByPlan[selectedPlanId] ?? {}) : {};
  const hasSelectedPlan = Boolean(selectedServiceType && selectedPlan);
  const hasPlanUrlSelection = Boolean(routeIds.serviceTypeId && routeIds.planId);
  const isPlanMetadataLoading =
    hasPlanUrlSelection && (serviceTypesLoading || plansLoading || plansFetching);
  const activeView: DashboardView = hasSelectedPlan ? routeIds.view : "schedule";

  const { data: people, isLoading: peopleLoading } = usePeople(
    selectedServiceType?.id ?? null,
    selectedTeam,
    selectedPosition,
    selectedPlan?.id ?? null,
    selectedPlan?.sortDate ?? null
  );

  useEffect(() => {
    const hasServiceTypeInUrl = !!routeIds.serviceTypeId;
    const hasPlanInUrl = !!routeIds.planId;
    const hasTeamOrPositionInUrl = !!routeIds.teamId || !!routeIds.positionId;

    if (hasServiceTypeInUrl && serviceTypesLoading) return;
    if (hasPlanInUrl && (plansLoading || plansFetching)) return;
    if (hasTeamOrPositionInUrl && teamPositionsLoading) return;

    const canonicalUrl = buildScheduleUrl({
      serviceTypeId: selectedServiceType?.id ?? null,
      planId: selectedPlan?.id ?? null,
      teamId: selectedTeam,
      positionId: selectedPosition,
      view: activeView,
    });

    if (currentUrl !== canonicalUrl) {
      router.replace(canonicalUrl);
    }
  }, [
    currentUrl,
    plansFetching,
    plansLoading,
    routeIds.planId,
    routeIds.positionId,
    routeIds.serviceTypeId,
    routeIds.teamId,
    routeIds.view,
    router,
    activeView,
    selectedPlan?.id,
    selectedPosition,
    selectedServiceType?.id,
    selectedTeam,
    serviceTypesLoading,
    teamPositionsLoading,
  ]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        COLLAPSED_TEAMS_STORAGE_MAP_KEY,
        JSON.stringify(collapsedTeamsByPlan)
      );
    } catch {
      // Ignore storage write failures (private mode/quota).
    }
  }, [collapsedTeamsByPlan]);

  const handleScheduleSuccess = () => {
    void queryClient.invalidateQueries({
      queryKey: queryKeys.peopleForSlot(
        selectedServiceType?.id ?? null,
        selectedTeam,
        selectedPosition,
        selectedPlan?.id ?? null
      ),
    });

    void queryClient.invalidateQueries({
      queryKey: queryKeys.teamPositions(
        selectedServiceType?.id ?? null,
        selectedPlan?.id ?? null,
        selectedPlan?.seriesId ?? null
      ),
    });
  };

  const handleScheduleError = (message: string) => {
    console.error("Schedule error:", message);
  };

  const handleViewChange = (nextView: string) => {
    const parsedView = parseDashboardView(nextView);
    navigateTo({
      serviceTypeId: selectedServiceType?.id ?? null,
      planId: selectedPlan?.id ?? null,
      teamId: selectedTeam,
      positionId: selectedPosition,
      view: parsedView,
    });
  };

  const handleSlotSelect = (slot: SlotRef) => {
    if (selectedPlanId) {
      setCollapsedTeamsByPlan((prev) => {
        const currentForPlan = prev[selectedPlanId] ?? {};
        if (currentForPlan[slot.teamId] === false) return prev;

        return {
          ...prev,
          [selectedPlanId]: {
            ...currentForPlan,
            [slot.teamId]: false,
          },
        };
      });
    }

    navigateTo({
      serviceTypeId: selectedServiceType?.id ?? null,
      planId: selectedPlan?.id ?? null,
      teamId: slot.teamId,
      positionId: slot.positionId,
      view: "schedule",
    });
  };

  const toggleTeamCollapsed = (teamId: string) => {
    if (!selectedPlanId) return;
    setCollapsedTeamsByPlan((prev) => {
      const currentForPlan = prev[selectedPlanId] ?? {};
      return {
        ...prev,
        [selectedPlanId]: {
          ...currentForPlan,
          [teamId]: !currentForPlan[teamId],
        },
      };
    });
  };

  const planSubtitle =
    selectedServiceType && selectedPlan
      ? buildPlanSubtitle(selectedServiceType.name, selectedPlan.title, selectedPlan.seriesTitle)
      : null;

  return (
    <main
      className={cn(
        "min-h-[calc(100svh-3.5rem)] bg-background",
        hasSelectedPlan && "lg:h-[calc(100svh-3.5rem)] lg:overflow-hidden"
      )}
    >
      <div
        className={cn(
          "mx-auto w-full max-w-7xl px-4",
          hasSelectedPlan ? "py-4 md:py-5 lg:flex lg:h-full lg:flex-col" : "py-6 md:py-8"
        )}
      >
        <header className={cn(hasSelectedPlan ? "mb-4 lg:shrink-0" : "mb-6")}>
          {hasSelectedPlan && selectedServiceType && selectedPlan ? (
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  {selectedServiceType.name}
                  {planSubtitle && (
                    <span className="font-normal text-muted-foreground"> / {planSubtitle}</span>
                  )}
                </h1>
                <Tabs
                  value={activeView}
                  onValueChange={handleViewChange}
                  className="lg:min-h-0 lg:flex-1"
                >
                  <TabsList className="w-full justify-start rounded-full sm:w-fit">
                    <TabsTrigger value="schedule">Schedule</TabsTrigger>
                    <TabsTrigger value="lineup">Lineup</TabsTrigger>
                    <TabsTrigger value="plan">Plan</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <p className="text-sm text-muted-foreground">{formatPlanDate(selectedPlan.sortDate)}</p>
            </div>
          ) : hasPlanUrlSelection && isPlanMetadataLoading ? null : (
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Select a Plan
              </h1>
              <p className="text-muted-foreground">
                Open the schedule table to choose a plan before editing lineup details.
              </p>
            </div>
          )}
        </header>

        {!hasSelectedPlan && (
          isPlanMetadataLoading ? (
            <div className="flex min-h-[40vh] items-center justify-center">
              <div className="flex items-center gap-2">
                <LoaderCircle className="size-4 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Loading plan details...</p>
              </div>
            </div>
          ) : (
            <Empty className="rounded-2xl border border-dashed">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <LoaderCircle />
                </EmptyMedia>
                <EmptyTitle>No valid plan selected</EmptyTitle>
                <EmptyDescription>
                  Use the Schedule breadcrumb above to choose a plan from the schedule table.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )
        )}

        {hasSelectedPlan && (
          <Tabs value={activeView} onValueChange={handleViewChange} className="lg:min-h-0 lg:flex-1">
            <TabsContent
              value="schedule"
              className="mt-0 flex min-h-0 flex-1 flex-col lg:h-full lg:min-h-0"
            >
              <ScheduleViewTab
                teamPositionsLoading={teamPositionsLoading}
                teamPositionGroups={teamPositionGroups}
                collapsedTeams={collapsedTeams}
                selectedTeam={selectedTeam}
                selectedPosition={selectedPosition}
                people={people}
                peopleLoading={peopleLoading}
                selectedServiceTypeId={selectedServiceType?.id ?? null}
                selectedPlanId={selectedPlan?.id ?? null}
                onToggleTeam={toggleTeamCollapsed}
                onSelectSlot={handleSlotSelect}
                onScheduleSuccess={handleScheduleSuccess}
                onScheduleError={handleScheduleError}
              />
            </TabsContent>

            <TabsContent value="lineup" className="mt-0 lg:min-h-0 lg:flex-1">
              <LineupTab
                groups={teamPositionGroups ?? []}
                isLoading={teamPositionsLoading}
                onSelectPosition={handleSlotSelect}
              />
            </TabsContent>

            <TabsContent value="plan" className="mt-0 lg:min-h-0 lg:flex-1">
              <PlanTab
                serviceTypeId={selectedServiceType?.id ?? null}
                planId={selectedPlan?.id ?? null}
              />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </main>
  );
}
