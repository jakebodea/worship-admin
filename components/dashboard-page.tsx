"use client";

import { startTransition, useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { AccountMenu } from "@/components/account-menu";
import { LineupTab } from "@/components/schedule/lineup-tab";
import { ScheduleViewTab } from "@/components/schedule/schedule-view-tab";
import type { SlotRef } from "@/components/schedule/types";
import { ServicePlanTableSelector } from "@/components/service-plan-table-selector";
import { Button } from "@/components/ui/button";
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

type DashboardView = "schedule" | "lineup";
const COLLAPSED_TEAMS_STORAGE_KEY_PREFIX = "schedule-collapsed-teams:";
const COLLAPSED_TEAMS_STORAGE_MAP_KEY = `${COLLAPSED_TEAMS_STORAGE_KEY_PREFIX}by-plan`;
type SearchParamReader = Pick<URLSearchParams, "get">;

function parseDashboardView(value: string | null): DashboardView {
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
  if (view === "lineup") searchParams.set("view", "lineup");

  const query = searchParams.toString();
  return query ? `/schedule?${query}` : "/schedule";
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
  const activeView: DashboardView = hasSelectedPlan ? routeIds.view : "schedule";

  const { data: people, isLoading: peopleLoading } = usePeople(
    selectedServiceType?.id ?? null,
    selectedTeam,
    selectedPosition,
    selectedPlan?.id ?? null,
    selectedPlan?.sortDate ?? null
  );

  const lineupTeamGroups = useMemo(() => {
    if (!teamPositionGroups) return [];
    return teamPositionGroups
      .map((group) => ({
        ...group,
        positions: group.positions.filter((position) => (position.neededCount ?? 0) > 0),
      }))
      .filter((group) => group.positions.length > 0);
  }, [teamPositionGroups]);

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
    const dateKey = selectedPlan?.sortDate ? new Date(selectedPlan.sortDate).toISOString() : null;

    queryClient.invalidateQueries({
      queryKey: queryKeys.people(
        selectedServiceType?.id ?? null,
        selectedTeam,
        selectedPosition,
        selectedPlan?.id ?? null,
        dateKey
      ),
    });

    queryClient.invalidateQueries({
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

  const handleServicePlanSelect = ({
    serviceTypeId,
    planId,
  }: {
    serviceTypeId: string;
    planId: string;
  }) => {
    navigateTo({
      serviceTypeId,
      planId,
      teamId: null,
      positionId: null,
      view: "schedule",
    });
  };

  const handleBack = () => {
    navigateTo({
      serviceTypeId: null,
      planId: null,
      teamId: null,
      positionId: null,
      view: "schedule",
    });
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

  const planSubtitle = selectedPlan?.seriesTitle || selectedPlan?.title || null;

  return (
    <div
      className={cn(
        "bg-background min-h-screen",
        hasSelectedPlan && "xl:h-screen xl:overflow-hidden"
      )}
    >
      <div
        className={cn(
          "container mx-auto px-4",
          hasSelectedPlan ? "py-4 md:py-5 xl:flex xl:h-full xl:flex-col" : "py-6 md:py-8"
        )}
      >
        <div
          className={cn(
            "flex flex-wrap items-start justify-between gap-3",
            hasSelectedPlan ? "mb-4 xl:shrink-0" : "mb-6"
          )}
        >
          <div>
            {hasSelectedPlan && selectedServiceType && selectedPlan ? (
              <>
                <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  {selectedServiceType.name}
                </h1>
                <p className="text-sm text-muted-foreground">{formatPlanDate(selectedPlan.sortDate)}</p>
                {planSubtitle && <p className="mt-1 text-sm text-muted-foreground">{planSubtitle}</p>}
              </>
            ) : (
              <>
                <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Schedule</h1>
                <p className="text-muted-foreground">Choose a service plan, then fill the open slots.</p>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {hasSelectedPlan && (
              <Button variant="ghost" onClick={handleBack}>
                <ArrowLeft className="size-4" />
                Change Plan
              </Button>
            )}
            <AccountMenu />
          </div>
        </div>

        {!hasSelectedPlan && (
          <ServicePlanTableSelector
            selectedServiceTypeId={selectedServiceType?.id ?? null}
            selectedPlanId={selectedPlan?.id ?? null}
            onSelect={handleServicePlanSelect}
          />
        )}

        {hasSelectedPlan && (
          <Tabs
            value={activeView}
            onValueChange={handleViewChange}
            className="xl:min-h-0 xl:flex-1"
          >
            <TabsList className="w-full justify-start sm:w-fit">
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="lineup">Lineup</TabsTrigger>
            </TabsList>

            <TabsContent value="schedule" className="mt-0 xl:min-h-0 xl:flex-1">
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

            <TabsContent value="lineup" className="mt-0 xl:min-h-0 xl:flex-1">
              <LineupTab
                groups={lineupTeamGroups}
                isLoading={teamPositionsLoading}
                onSelectPosition={handleSlotSelect}
              />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
