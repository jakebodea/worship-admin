"use client";

import { startTransition, useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, ChevronDown, ListChecks } from "lucide-react";
import { PersonCard } from "@/components/person-card";
import { PlanDateSelector } from "@/components/plan-date-selector";
import { ServiceTypeSelector } from "@/components/service-type-selector";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePeople } from "@/hooks/use-people";
import { usePlans } from "@/hooks/use-plans";
import { useServiceTypes } from "@/hooks/use-service-types";
import { useTeamPositions } from "@/hooks/use-team-positions";
import { queryKeys } from "@/lib/query-keys";
import type { FilledPositionPerson, Plan, ServiceType, TeamPosition, TeamPositionGroup } from "@/lib/types";
import { cn } from "@/lib/utils";

type Step = 1 | 2 | 3;

interface RouteSelectionIds {
  serviceTypeId: string | null;
  planId: string | null;
  teamId: string | null;
  positionId: string | null;
}

interface SlotRef {
  teamId: string;
  teamName: string;
  positionId: string;
  positionName: string;
}

const COLLAPSED_TEAMS_STORAGE_KEY_PREFIX = "schedule-collapsed-teams:";
const COLLAPSED_TEAMS_STORAGE_MAP_KEY = `${COLLAPSED_TEAMS_STORAGE_KEY_PREFIX}by-plan`;
type SearchParamReader = Pick<URLSearchParams, "get">;

function parseSearchSelection(searchParams: SearchParamReader): RouteSelectionIds {
  const serviceTypeId = searchParams.get("serviceTypeId");
  const planId = searchParams.get("planId");
  const teamId = searchParams.get("teamId");
  const positionId = searchParams.get("positionId");
  return {
    serviceTypeId: serviceTypeId ?? null,
    planId: planId ?? null,
    teamId: teamId ?? null,
    positionId: positionId ?? null,
  };
}

function buildScheduleUrl({ serviceTypeId, planId, teamId, positionId }: RouteSelectionIds): string {
  const searchParams = new URLSearchParams();
  if (serviceTypeId) searchParams.set("serviceTypeId", serviceTypeId);
  if (planId) searchParams.set("planId", planId);
  if (teamId) searchParams.set("teamId", teamId);
  if (positionId) searchParams.set("positionId", positionId);

  const query = searchParams.toString();
  return query ? `/schedule?${query}` : "/schedule";
}

function flattenSlots(teamPositionGroups: TeamPositionGroup[] | undefined): SlotRef[] {
  if (!teamPositionGroups) return [];

  const slots: SlotRef[] = [];
  for (const group of teamPositionGroups) {
    for (const position of group.positions) {
      slots.push({
        teamId: group.teamId,
        teamName: group.teamName,
        positionId: position.id,
        positionName: position.name,
      });
    }
  }

  return slots;
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

  const step: Step = selectedPlan ? 3 : selectedServiceType ? 2 : 1;

  const { data: people, isLoading: peopleLoading } = usePeople(
    selectedServiceType?.id ?? null,
    selectedTeam,
    selectedPosition,
    selectedPlan?.id ?? null,
    selectedPlan?.sortDate ?? null
  );

  const slotList = useMemo(() => flattenSlots(teamPositionGroups), [teamPositionGroups]);
  const selectedSlotIndex = useMemo(
    () => slotList.findIndex((slot) => slot.teamId === selectedTeam && slot.positionId === selectedPosition),
    [slotList, selectedTeam, selectedPosition]
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
    router,
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

  const handleServiceTypeSelect = (serviceType: ServiceType) => {
    navigateTo({ serviceTypeId: serviceType.id, planId: null, teamId: null, positionId: null });
  };

  const handlePlanSelect = (plan: Plan) => {
    navigateTo({
      serviceTypeId: selectedServiceType?.id ?? null,
      planId: plan.id,
      teamId: null,
      positionId: null,
    });
  };

  const handleBack = () => {
    if (step === 2) {
      navigateTo({ serviceTypeId: null, planId: null, teamId: null, positionId: null });
      return;
    }

    if (step === 3) {
      navigateTo({
        serviceTypeId: selectedServiceType?.id ?? null,
        planId: null,
        teamId: null,
        positionId: null,
      });
    }
  };

  const handleSlotSelect = (slot: SlotRef) => {
    navigateTo({
      serviceTypeId: selectedServiceType?.id ?? null,
      planId: selectedPlan?.id ?? null,
      teamId: slot.teamId,
      positionId: slot.positionId,
    });
  };

  const moveToRelativeSlot = (direction: 1 | -1) => {
    if (selectedSlotIndex < 0) return;
    const next = slotList[selectedSlotIndex + direction];
    if (!next) return;
    handleSlotSelect(next);
  };

  const planSubtitle = selectedPlan?.seriesTitle || selectedPlan?.title || null;

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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            {step === 3 && selectedServiceType && selectedPlan ? (
              <>
                <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  {selectedServiceType.name}
                </h1>
                <p className="text-sm text-muted-foreground">{formatPlanDate(selectedPlan.sortDate)}</p>
                {planSubtitle && (
                  <p className="mt-1 text-sm text-muted-foreground">{planSubtitle}</p>
                )}
              </>
            ) : (
              <>
                <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Schedule</h1>
                <p className="text-muted-foreground">
                  Pick a slot, then schedule from the candidate cards.
                </p>
              </>
            )}
          </div>
          {step > 1 && (
            <Button variant="ghost" onClick={handleBack}>
              <ArrowLeft className="size-4" />
              {step === 2 ? "Back" : "Change Plan"}
            </Button>
          )}
        </div>

        {step === 1 && (
          <ServiceTypeSelector
            selectedServiceType={selectedServiceType?.id ?? null}
            onSelect={handleServiceTypeSelect}
          />
        )}

        {step === 2 && (
          <PlanDateSelector
            serviceTypeId={selectedServiceType?.id ?? null}
            selectedPlan={selectedPlan}
            onSelect={handlePlanSelect}
          />
        )}

        {step === 3 && (
          <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
              <aside className="overflow-hidden rounded-xl border bg-card/60 xl:sticky xl:top-6 xl:h-[calc(100vh-6rem)]">
                <div className="border-b px-4 py-4">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <ListChecks className="size-4 text-muted-foreground" />
                    <span>Slots</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">Choose team and position.</p>
                </div>
                <div className="border-b px-4 py-3">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => moveToRelativeSlot(-1)}
                      disabled={selectedSlotIndex <= 0}
                    >
                      <ArrowLeft className="size-4" />
                      Prev
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => moveToRelativeSlot(1)}
                      disabled={selectedSlotIndex < 0 || selectedSlotIndex >= slotList.length - 1}
                    >
                      Next
                      <ArrowRight className="size-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-4 px-4 py-4 xl:max-h-[calc(100vh-15rem)] xl:overflow-y-auto">
                  {teamPositionsLoading ? (
                    <div className="space-y-2">
                      {Array.from({ length: 8 }).map((_, index) => (
                        <Skeleton key={index} className="h-9 w-full" />
                      ))}
                    </div>
                  ) : !teamPositionGroups || teamPositionGroups.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No slots found for this plan.</p>
                  ) : (
                    <div className="space-y-4">
                      {teamPositionGroups.map((group) => (
                        <Collapsible
                          key={group.teamId}
                          open={!collapsedTeams[group.teamId]}
                          onOpenChange={() => toggleTeamCollapsed(group.teamId)}
                          className="space-y-2"
                        >
                          <CollapsibleTrigger asChild>
                            <button
                              type="button"
                              className="flex w-full items-center justify-between rounded-md px-1 py-1 text-left hover:bg-muted"
                            >
                              <div className="flex min-w-0 items-center gap-2">
                                <ChevronDown
                                  className={cn(
                                    "size-4 text-muted-foreground transition-transform duration-200 ease-out",
                                    collapsedTeams[group.teamId] && "-rotate-90"
                                  )}
                                />
                                <p className="truncate text-sm font-medium">{group.teamName}</p>
                              </div>
                              <Badge variant="secondary">
                                {group.positions.reduce(
                                  (sum, position) => sum + (position.neededCount ?? 1),
                                  0
                                )}
                              </Badge>
                            </button>
                          </CollapsibleTrigger>

                          <CollapsibleContent
                            className={cn(
                              "grid overflow-hidden transition-all",
                              "data-[state=open]:grid-rows-[1fr] data-[state=closed]:grid-rows-[0fr]",
                              "data-[state=open]:opacity-100 data-[state=closed]:opacity-0",
                              "data-[state=open]:duration-200 data-[state=closed]:duration-150",
                              "data-[state=open]:ease-out data-[state=closed]:ease-in"
                            )}
                          >
                            <div className="min-h-0 space-y-1 pt-1">
                            {group.positions.map((position) => {
                              const active =
                                group.teamId === selectedTeam && position.id === selectedPosition;

                              return (
                                <div
                                  key={position.id}
                                  className={cn(
                                    "flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm transition-colors",
                                    active ? "border-primary bg-primary/5" : "hover:bg-muted"
                                  )}
                                >
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleSlotSelect({
                                        teamId: group.teamId,
                                        teamName: group.teamName,
                                        positionId: position.id,
                                        positionName: position.name,
                                      })
                                    }
                                    className="min-w-0 flex-1 text-left"
                                    aria-pressed={active}
                                  >
                                    <span className="truncate pr-2">{position.name}</span>
                                  </button>
                                  <SlotBadgeCluster
                                    position={position}
                                    teamName={group.teamName}
                                    positionName={position.name}
                                  />
                                </div>
                              );
                            })}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      ))}
                    </div>
                  )}
                </div>
              </aside>

              <div className="space-y-4">
                {!selectedPosition ? (
                  <Card>
                    <CardContent className="px-4 py-10 text-center text-sm text-muted-foreground">
                      Select a position to schedule a person.
                    </CardContent>
                  </Card>
                ) : peopleLoading ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <Skeleton key={i} className="h-64 w-full" />
                    ))}
                  </div>
                ) : !people || people.length === 0 ? (
                  <Card>
                    <CardContent className="px-4 py-10 text-center text-sm text-muted-foreground">
                      No people found for this position. Make sure the position has team members assigned.
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
                    {people.map((person) => (
                      <PersonCard
                        key={[
                          person.id,
                          selectedServiceType?.id ?? "no-st",
                          selectedPlan?.id ?? "no-plan",
                          selectedTeam ?? "no-team",
                          selectedPosition ?? "no-position",
                        ].join(":")}
                        person={person}
                        serviceTypeId={selectedServiceType?.id ?? null}
                        planId={selectedPlan?.id ?? null}
                        teamId={selectedTeam}
                        positionId={selectedPosition}
                        onScheduleSuccess={handleScheduleSuccess}
                        onScheduleError={handleScheduleError}
                      />
                    ))}
                  </div>
                )}
              </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SlotBadgeCluster({
  position,
  teamName,
  positionName,
}: {
  position: TeamPosition;
  teamName: string;
  positionName: string;
}) {
  const confirmed = position.filledConfirmedCount ?? 0;
  const pending = position.filledPendingCount ?? 0;
  const confirmedPeople = (position.filledPeople ?? []).filter((person) => person.status === "confirmed");
  const pendingPeople = (position.filledPeople ?? []).filter((person) => person.status === "pending");

  return (
    <div className="flex items-center gap-1">
      {confirmed > 0 && (
        <HoverCard openDelay={120} closeDelay={120}>
          <HoverCardTrigger asChild>
            <button
              type="button"
              onClick={(event) => event.stopPropagation()}
            >
              <Badge
                variant="outline"
                className="shrink-0 cursor-pointer border-green-500/40 bg-green-500/10 text-green-700 hover:bg-green-500/15"
              >
                {confirmed}
              </Badge>
            </button>
          </HoverCardTrigger>
          <HoverCardContent
            align="end"
            side="right"
            className="w-80"
          >
            <SlotStatusPopoverContent
              teamName={teamName}
              positionName={positionName}
              label="Confirmed"
              tone="confirmed"
              people={confirmedPeople}
            />
          </HoverCardContent>
        </HoverCard>
      )}
      {pending > 0 && (
        <HoverCard openDelay={120} closeDelay={120}>
          <HoverCardTrigger asChild>
            <button
              type="button"
              onClick={(event) => event.stopPropagation()}
            >
              <Badge
                variant="outline"
                className="shrink-0 cursor-pointer border-amber-500/40 bg-amber-500/10 text-amber-700 hover:bg-amber-500/15"
              >
                {pending}
              </Badge>
            </button>
          </HoverCardTrigger>
          <HoverCardContent
            align="end"
            side="right"
            className="w-80"
          >
            <SlotStatusPopoverContent
              teamName={teamName}
              positionName={positionName}
              label="Pending"
              tone="pending"
              people={pendingPeople}
            />
          </HoverCardContent>
        </HoverCard>
      )}
      {(position.neededCount ?? 0) > 0 ? (
        <Badge variant="destructive" className="shrink-0">
          {position.neededCount}
        </Badge>
      ) : null}
    </div>
  );
}

function SlotStatusPopoverContent({
  teamName,
  positionName,
  label,
  tone,
  people,
}: {
  teamName: string;
  positionName: string;
  label: "Confirmed" | "Pending";
  tone: "confirmed" | "pending";
  people: FilledPositionPerson[];
}) {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-semibold">{positionName}</p>
        <p className="text-xs text-muted-foreground">{teamName}</p>
      </div>
      <FilledPeopleSection
        label={label}
        badgeClassName={
          tone === "confirmed"
            ? "border-green-500/40 bg-green-500/10 text-green-700"
            : "border-amber-500/40 bg-amber-500/10 text-amber-700"
        }
        people={people}
        emptyMessage={`No ${label.toLowerCase()} people here yet`}
      />
    </div>
  );
}

function FilledPeopleSection({
  label,
  badgeClassName,
  people,
  emptyMessage,
}: {
  label: string;
  badgeClassName: string;
  people: FilledPositionPerson[];
  emptyMessage: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Badge variant="outline" className={badgeClassName}>
          {label}
        </Badge>
        <span className="text-xs text-muted-foreground">{people.length}</span>
      </div>
      {people.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      ) : (
        <ul className="space-y-1.5">
          {people.map((person) => (
            <li
              key={`${person.id}-${person.rawStatus}`}
              className={cn(
                "flex items-center gap-2 rounded-md border px-2 py-1.5",
                person.status === "confirmed"
                  ? "border-green-500/25 bg-green-500/5"
                  : "border-amber-500/25 bg-amber-500/5"
              )}
            >
              <Avatar className="h-7 w-7">
                <AvatarImage src={person.photoThumbnailUrl || undefined} alt={person.name} />
                <AvatarFallback className="text-[10px]">
                  {getInitials(person.name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{person.name}</p>
                <p
                  className={cn(
                    "text-[11px]",
                    person.status === "confirmed"
                      ? "text-green-700"
                      : "text-amber-700"
                  )}
                >
                  {person.status === "confirmed" ? "Confirmed" : "Pending"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]?.slice(0, 2).toUpperCase() || "?";
  return `${parts[0]?.[0] || ""}${parts[1]?.[0] || ""}`.toUpperCase();
}
