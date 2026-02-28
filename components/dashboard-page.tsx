"use client";

import { startTransition, useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { PersonCard } from "@/components/person-card";
import { ServicePlanTableSelector } from "@/components/service-plan-table-selector";
import { AccountMenu } from "@/components/account-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { usePeople } from "@/hooks/use-people";
import { usePlans } from "@/hooks/use-plans";
import { useServiceTypes } from "@/hooks/use-service-types";
import { useTeamPositions } from "@/hooks/use-team-positions";
import { queryKeys } from "@/lib/query-keys";
import type { FilledPositionPerson, TeamPosition, TeamPositionGroup } from "@/lib/types";
import { cn } from "@/lib/utils";

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
    });
  };

  const handleBack = () => {
    navigateTo({ serviceTypeId: null, planId: null, teamId: null, positionId: null });
  };

  const handleSlotSelect = (slot: SlotRef) => {
    navigateTo({
      serviceTypeId: selectedServiceType?.id ?? null,
      planId: selectedPlan?.id ?? null,
      teamId: slot.teamId,
      positionId: slot.positionId,
    });
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
                {planSubtitle && (
                  <p className="mt-1 text-sm text-muted-foreground">{planSubtitle}</p>
                )}
              </>
            ) : (
              <>
                <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Schedule</h1>
                <p className="text-muted-foreground">
                  Choose a service plan, then fill the open slots.
                </p>
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
          <div className="grid gap-4 xl:min-h-0 xl:flex-1 xl:grid-cols-[320px_minmax(0,1fr)]">
              <Card className="shrink-0 gap-0 border-0 py-0 shadow-none">
                <div className="space-y-3 px-3 pb-3">
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
                        <TeamSlotsCollapsible
                          key={group.teamId}
                          group={group}
                          isCollapsed={!!collapsedTeams[group.teamId]}
                          selectedTeam={selectedTeam}
                          selectedPosition={selectedPosition}
                          onToggle={toggleTeamCollapsed}
                          onSelect={handleSlotSelect}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </Card>

              <ScrollArea className="xl:min-h-0 xl:h-full">
                {!selectedPosition ? (
                  <Card>
                    <CardContent className="px-4 py-10 text-center text-sm text-muted-foreground">
                      Select a position to schedule a person.
                    </CardContent>
                  </Card>
                ) : peopleLoading ? (
                  <div className="grid grid-cols-1 gap-3 pb-2 md:grid-cols-2 2xl:grid-cols-3">
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
                  <div className="grid grid-cols-1 gap-3 pb-2 md:grid-cols-2 2xl:grid-cols-3">
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
              </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
}

function TeamSlotsCollapsible({
  group,
  isCollapsed,
  selectedTeam,
  selectedPosition,
  onToggle,
  onSelect,
}: {
  group: TeamPositionGroup;
  isCollapsed: boolean;
  selectedTeam: string | null;
  selectedPosition: string | null;
  onToggle: (teamId: string) => void;
  onSelect: (slot: SlotRef) => void;
}) {
  const openNeededCount = group.positions.reduce(
    (sum, position) => sum + (position.neededCount ?? 1),
    0
  );

  return (
    <Collapsible
      open={!isCollapsed}
      onOpenChange={() => onToggle(group.teamId)}
      className="overflow-hidden rounded-md border border-border/50 bg-background/90"
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto w-full justify-between gap-3 rounded-none px-3 py-2 text-left hover:bg-muted/25"
        >
          <div className="flex min-w-0 items-center gap-2">
            <ChevronDown
              className={cn(
                "size-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out",
                isCollapsed && "-rotate-90"
              )}
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{group.teamName}</p>
              <p className="text-[11px] text-muted-foreground">
                {group.positions.length} positions
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="shrink-0">
            {openNeededCount}
          </Badge>
        </Button>
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
        <div className="min-h-0 bg-muted/10">
          {group.positions.map((position, index) => {
            const active =
              group.teamId === selectedTeam && position.id === selectedPosition;

            return (
              <div
                key={position.id}
                className={cn(
                  "flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left text-sm transition-colors",
                  index > 0 && "border-t border-border/40",
                  active ? "bg-background/90" : "hover:bg-muted/20"
                )}
              >
                <Button
                  variant="ghost"
                  onClick={() =>
                    onSelect({
                      teamId: group.teamId,
                      teamName: group.teamName,
                      positionId: position.id,
                      positionName: position.name,
                    })
                  }
                  className="h-auto min-w-0 flex-1 justify-start px-0 py-1 text-left hover:bg-transparent"
                  aria-pressed={active}
                >
                  <span className={cn("block truncate pr-2", active && "font-medium")}>
                    {position.name}
                  </span>
                </Button>
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
            <Button
              variant="ghost"
              size="sm"
              className="h-auto px-0 py-0 hover:bg-transparent"
              onClick={(event) => event.stopPropagation()}
            >
              <Badge
                variant="outline"
                className="shrink-0 cursor-pointer border-green-500/40 bg-green-500/10 text-green-700 hover:bg-green-500/15"
              >
                {confirmed}
              </Badge>
            </Button>
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
            <Button
              variant="ghost"
              size="sm"
              className="h-auto px-0 py-0 hover:bg-transparent"
              onClick={(event) => event.stopPropagation()}
            >
              <Badge
                variant="outline"
                className="shrink-0 cursor-pointer border-amber-500/40 bg-amber-500/10 text-amber-700 hover:bg-amber-500/15"
              >
                {pending}
              </Badge>
            </Button>
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
