"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ChevronDown, MousePointerClick, PanelLeft, Search, X } from "lucide-react";
import { ScheduleCandidateTile } from "@/components/schedule/schedule-candidate-tile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { partitionPeopleForRecommendationStrip } from "@/lib/use-cases/planning-center/people/recommendation-strip-order";
import type { SlotRef } from "@/components/schedule/types";
import type { FilledPositionPerson, PersonWithAvailability, TeamPosition, TeamPositionGroup } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ScheduleViewTabProps {
  teamPositionsLoading: boolean;
  teamPositionGroups: TeamPositionGroup[] | undefined;
  collapsedTeams: Record<string, boolean>;
  selectedTeam: string | null;
  selectedPosition: string | null;
  people: PersonWithAvailability[] | undefined;
  peopleLoading: boolean;
  selectedServiceTypeId: string | null;
  selectedPlanId: string | null;
  onToggleTeam: (teamId: string) => void;
  onSelectSlot: (slot: SlotRef) => void;
  onScheduleSuccess: () => void;
  onScheduleError: (message: string) => void;
}

export function ScheduleViewTab({
  teamPositionsLoading,
  teamPositionGroups,
  collapsedTeams,
  selectedTeam,
  selectedPosition,
  people,
  peopleLoading,
  selectedServiceTypeId,
  selectedPlanId,
  onToggleTeam,
  onSelectSlot,
  onScheduleSuccess,
  onScheduleError,
}: ScheduleViewTabProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [filter, setFilter] = useState("");
  /** Tailwind `lg` — sidebar visible; sheet only below this width. */
  const [isWidePickerLayout, setIsWidePickerLayout] = useState(false);

  useEffect(() => {
    setFilter("");
  }, [selectedTeam, selectedPosition]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => {
      const wide = mq.matches;
      setIsWidePickerLayout(wide);
      if (wide) setPickerOpen(false);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const selectedSlotInfo = useMemo(() => {
    if (!selectedTeam || !selectedPosition || !teamPositionGroups) {
      return null;
    }
    for (const group of teamPositionGroups) {
      if (group.teamId !== selectedTeam) continue;
      const position = group.positions.find((p) => p.id === selectedPosition);
      if (position) {
        return { teamName: group.teamName, positionName: position.name, position };
      }
    }
    return null;
  }, [selectedTeam, selectedPosition, teamPositionGroups]);

  const hasSlots = !!teamPositionGroups && teamPositionGroups.length > 0;

  const handleSelectSlot = (slot: SlotRef) => {
    onSelectSlot(slot);
    if (!isWidePickerLayout) setPickerOpen(false);
  };

  const { actionable, exceptions } = useMemo(
    () => partitionPeopleForRecommendationStrip(people ?? []),
    [people]
  );

  const normalizedFilter = filter.trim().toLowerCase();
  const filteredActionable = useMemo(
    () =>
      normalizedFilter
        ? actionable.filter((person) => person.fullName.toLowerCase().includes(normalizedFilter))
        : actionable,
    [actionable, normalizedFilter]
  );
  const filteredExceptions = useMemo(
    () =>
      normalizedFilter
        ? exceptions.filter((person) => person.fullName.toLowerCase().includes(normalizedFilter))
        : exceptions,
    [exceptions, normalizedFilter]
  );
  const totalShown = filteredActionable.length + filteredExceptions.length;

  const personTileKey = (person: PersonWithAvailability) =>
    [
      person.id,
      selectedServiceTypeId ?? "no-st",
      selectedPlanId ?? "no-plan",
      selectedTeam ?? "no-team",
      selectedPosition ?? "no-position",
    ].join(":");

  const positionPickerList = (
    <PositionPickerList
      teamPositionsLoading={teamPositionsLoading}
      teamPositionGroups={teamPositionGroups}
      collapsedTeams={collapsedTeams}
      selectedTeam={selectedTeam}
      selectedPosition={selectedPosition}
      onToggleTeam={onToggleTeam}
      onSelect={handleSelectSlot}
    />
  );

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col gap-4 lg:h-full lg:flex-row">
      <aside
        className="hidden min-h-0 w-[min(20rem,30vw)] shrink-0 flex-col overflow-hidden rounded-2xl border border-sidebar-border/60 bg-sidebar text-sidebar-foreground shadow-sm lg:flex lg:h-full"
        aria-label="Positions"
      >
        <div className="shrink-0 px-5 py-4">
          <h2 className="text-sm font-semibold tracking-tight">Positions</h2>
          <p className="mt-1 text-xs text-muted-foreground">Choose a team slot for this plan.</p>
        </div>
        {positionPickerList}
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-4 lg:h-full">
        {selectedPosition ? (
          <>
            <SelectedPositionHeader
              info={selectedSlotInfo}
              onOpenPicker={() => setPickerOpen(true)}
              hasSlots={hasSlots}
              teamPositionsLoading={teamPositionsLoading}
              filter={filter}
              onFilterChange={setFilter}
              totalShown={totalShown}
              totalAvailable={(actionable.length + exceptions.length)}
            />

            <ScrollArea className="min-h-0 w-full flex-1 lg:h-full">
              {peopleLoading ? (
                <div className="overflow-hidden rounded-2xl border border-border/40 bg-card/30 divide-y divide-border/25 shadow-sm">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 px-3 py-3">
                      <Skeleton className="size-10 shrink-0 rounded-full" />
                      <div className="flex flex-1 flex-col gap-1.5">
                        <Skeleton className="h-3.5 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                      <Skeleton className="hidden h-6 w-24 sm:block" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                  ))}
                </div>
              ) : !people || people.length === 0 ? (
                <Empty className="mx-2 py-10">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <CalendarDays />
                    </EmptyMedia>
                    <EmptyTitle>No people found</EmptyTitle>
                    <EmptyDescription>
                      Make sure this position has team members assigned in Planning Center.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : totalShown === 0 ? (
                <Empty className="mx-2 py-10">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <Search />
                    </EmptyMedia>
                    <EmptyTitle>No matches</EmptyTitle>
                    <EmptyDescription>
                      No one named &ldquo;{filter}&rdquo; in this position.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                <div className="flex min-h-0 flex-col gap-5 pb-4 pr-2">
                  {filteredActionable.length > 0 ? (
                    <section className="flex flex-col gap-2">
                      <SectionLabel
                        title="Suggested"
                        count={filteredActionable.length}
                        hint="Ranked by fit for this slot"
                      />
                      <div className="overflow-hidden rounded-2xl border border-border/40 bg-card/30 divide-y divide-border/25 shadow-sm">
                        {filteredActionable.map((person) => (
                          <ScheduleCandidateTile
                            key={personTileKey(person)}
                            person={person}
                            serviceTypeId={selectedServiceTypeId}
                            planId={selectedPlanId}
                            teamId={selectedTeam}
                            positionId={selectedPosition}
                            onScheduleSuccess={onScheduleSuccess}
                            onScheduleError={onScheduleError}
                          />
                        ))}
                      </div>
                    </section>
                  ) : null}

                  {filteredExceptions.length > 0 ? (
                    <section className="flex flex-col gap-2">
                      <SectionLabel
                        title="Unavailable"
                        count={filteredExceptions.length}
                        hint="Blocked, declined, or already serving"
                      />
                      <div className="overflow-hidden rounded-2xl border border-border/30 bg-card/20 opacity-80 divide-y divide-border/20">
                        {filteredExceptions.map((person) => (
                          <ScheduleCandidateTile
                            key={personTileKey(person)}
                            person={person}
                            serviceTypeId={selectedServiceTypeId}
                            planId={selectedPlanId}
                            teamId={selectedTeam}
                            positionId={selectedPosition}
                            onScheduleSuccess={onScheduleSuccess}
                            onScheduleError={onScheduleError}
                          />
                        ))}
                      </div>
                    </section>
                  ) : null}
                </div>
              )}
            </ScrollArea>
          </>
        ) : (
          <UnselectedPositionEmpty
            teamPositionGroups={teamPositionGroups}
            hasSlots={hasSlots}
            teamPositionsLoading={teamPositionsLoading}
            onOpenPicker={() => setPickerOpen(true)}
            onSelect={handleSelectSlot}
          />
        )}
      </div>

      <div className="lg:hidden">
        <Sheet open={pickerOpen} onOpenChange={setPickerOpen}>
          <SheetContent
            side="left"
            showCloseButton
            className="flex w-[min(100vw,20rem)] flex-col gap-0 overflow-hidden border-r bg-sidebar p-0 text-sidebar-foreground sm:max-w-[20rem]"
          >
            <SheetHeader className="shrink-0 border-b border-sidebar-border p-4 pr-12">
              <SheetTitle className="text-sm">Positions</SheetTitle>
            </SheetHeader>
            {positionPickerList}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

function PositionPickerList({
  teamPositionsLoading,
  teamPositionGroups,
  collapsedTeams,
  selectedTeam,
  selectedPosition,
  onToggleTeam,
  onSelect,
}: {
  teamPositionsLoading: boolean;
  teamPositionGroups: TeamPositionGroup[] | undefined;
  collapsedTeams: Record<string, boolean>;
  selectedTeam: string | null;
  selectedPosition: string | null;
  onToggleTeam: (teamId: string) => void;
  onSelect: (slot: SlotRef) => void;
}) {
  return (
    <ScrollArea className="min-h-0 flex-1">
      <div className="flex flex-col gap-2 px-3 pb-4 pt-1">
        {teamPositionsLoading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <SidebarMenuSkeleton key={index} />
          ))
        ) : !teamPositionGroups || teamPositionGroups.length === 0 ? (
          <Empty className="py-6">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CalendarDays />
              </EmptyMedia>
              <EmptyTitle>No slots found</EmptyTitle>
              <EmptyDescription>This plan has no team positions yet.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          teamPositionGroups.map((group) => (
            <TeamSlotsCollapsible
              key={group.teamId}
              group={group}
              isCollapsed={!!collapsedTeams[group.teamId]}
              selectedTeam={selectedTeam}
              selectedPosition={selectedPosition}
              onToggle={onToggleTeam}
              onSelect={onSelect}
            />
          ))
        )}
      </div>
    </ScrollArea>
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
  const hasSelectedPositionInGroup =
    group.teamId === selectedTeam &&
    group.positions.some((position) => position.id === selectedPosition);
  const isOpen = hasSelectedPositionInGroup || !isCollapsed;

  return (
    <Collapsible open={isOpen} onOpenChange={() => onToggle(group.teamId)} asChild>
      <SidebarGroup className="px-0 py-0">
        <CollapsibleTrigger asChild>
          <SidebarGroupLabel
            asChild
            className="group/team-label h-8 w-full cursor-pointer justify-start gap-1.5 pr-1 text-left hover:bg-sidebar-accent/60"
          >
            <button type="button">
              <ChevronDown
                className={cn(
                  "size-3.5 shrink-0 text-muted-foreground transition-transform duration-200 ease-out",
                  isCollapsed && "-rotate-90"
                )}
                aria-hidden
              />
              <span className="flex-1 truncate text-left text-xs font-semibold uppercase tracking-wider">
                {group.teamName}
              </span>
              {openNeededCount > 0 ? (
                <span className="ml-1 rounded-full bg-red-500/15 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-red-600 dark:text-red-300">
                  {openNeededCount}
                </span>
              ) : (
                <span className="ml-1 size-1.5 rounded-full bg-emerald-500/80" aria-label="All set" />
              )}
            </button>
          </SidebarGroupLabel>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {group.positions.map((position) => {
                const active = group.teamId === selectedTeam && position.id === selectedPosition;
                return (
                  <SidebarMenuItem key={position.id}>
                    <SidebarMenuButton
                      isActive={active}
                      onClick={() =>
                        onSelect({
                          teamId: group.teamId,
                          teamName: group.teamName,
                          positionId: position.id,
                          positionName: position.name,
                        })
                      }
                      className="pr-2"
                    >
                      <span className="flex-1 truncate">{position.name}</span>
                      <SlotBadgeCluster
                        position={position}
                        teamName={group.teamName}
                        positionName={position.name}
                      />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
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
  const needed = position.neededCount ?? 0;
  const filled = confirmed + pending;
  const total = filled + needed;
  const confirmedPeople = (position.filledPeople ?? []).filter((person) => person.status === "confirmed");
  const pendingPeople = (position.filledPeople ?? []).filter((person) => person.status === "pending");
  const allFilled = needed === 0 && filled > 0;

  return (
    <div className="flex items-center gap-1.5">
      {filled > 0 ? (
        <HoverCard openDelay={120} closeDelay={120}>
          <HoverCardTrigger asChild>
            <button
              type="button"
              onClick={(event) => event.stopPropagation()}
              className={cn(
                "flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums transition-colors",
                allFilled
                  ? "bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 dark:text-emerald-300"
                  : "bg-muted/60 text-foreground/80 hover:bg-muted"
              )}
              aria-label={`${filled} of ${total} filled`}
            >
              <span
                aria-hidden
                className={cn(
                  "size-1.5 rounded-full",
                  allFilled ? "bg-emerald-500" : pending > 0 ? "bg-amber-500" : "bg-emerald-500"
                )}
              />
              {filled}/{total}
            </button>
          </HoverCardTrigger>
          <HoverCardContent align="end" side="right" className="w-80 space-y-3">
            {confirmedPeople.length > 0 ? (
              <SlotStatusPopoverContent
                teamName={teamName}
                positionName={positionName}
                label="Confirmed"
                tone="confirmed"
                people={confirmedPeople}
              />
            ) : null}
            {pendingPeople.length > 0 ? (
              <SlotStatusPopoverContent
                teamName={teamName}
                positionName={positionName}
                label="Pending"
                tone="pending"
                people={pendingPeople}
              />
            ) : null}
          </HoverCardContent>
        </HoverCard>
      ) : null}
      {needed > 0 ? (
        <span
          className="shrink-0 rounded-full bg-red-500/15 px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-red-600 dark:text-red-300"
          title={`${needed} still needed`}
        >
          +{needed}
        </span>
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
            ? "border-emerald-400/70 bg-emerald-600/45 font-semibold text-emerald-50 shadow-sm dark:bg-emerald-600/50"
            : "border-amber-400/70 bg-amber-600/45 font-semibold text-amber-50 shadow-sm dark:bg-amber-600/50"
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
                  ? "border-emerald-400/55 bg-emerald-600/28 dark:bg-emerald-950/50"
                  : "border-amber-400/55 bg-amber-600/28 dark:bg-amber-950/50"
              )}
            >
              <Avatar className="h-7 w-7">
                <AvatarImage src={person.photoThumbnailUrl || undefined} alt={person.name} />
                <AvatarFallback className="text-[10px]">{getInitials(person.name)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{person.name}</p>
                <p
                  className={cn(
                    "text-[11px] font-medium",
                    person.status === "confirmed" ? "text-emerald-700 dark:text-emerald-100" : "text-amber-800 dark:text-amber-100"
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

function SelectedPositionHeader({
  info,
  onOpenPicker,
  hasSlots,
  teamPositionsLoading,
  filter,
  onFilterChange,
  totalShown,
  totalAvailable,
}: {
  info: { teamName: string; positionName: string; position: TeamPosition } | null;
  onOpenPicker: () => void;
  hasSlots: boolean;
  teamPositionsLoading: boolean;
  filter: string;
  onFilterChange: (next: string) => void;
  totalShown: number;
  totalAvailable: number;
}) {
  const position = info?.position;
  const confirmed = position?.filledConfirmedCount ?? 0;
  const pending = position?.filledPendingCount ?? 0;
  const needed = position?.neededCount ?? 0;
  const filled = confirmed + pending;
  const total = filled + needed;
  const filledPeople = position?.filledPeople ?? [];
  const isComplete = needed === 0 && filled > 0;

  return (
    <div className="flex shrink-0 flex-col gap-3 px-1 pb-1 pt-1">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-lg font-semibold leading-tight tracking-tight">
              {info?.positionName}
            </p>
            {position ? (
              isComplete ? (
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                  All set
                </span>
              ) : needed > 0 ? (
                <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-red-600 dark:text-red-300">
                  {needed} needed
                </span>
              ) : null
            ) : null}
          </div>
          <p className="mt-0.5 truncate text-sm text-muted-foreground">
            {info?.teamName}
            {position ? (
              <>
                <span className="mx-1.5 opacity-50">·</span>
                <span className="tabular-nums">
                  {filled}/{total} filled
                </span>
                {pending > 0 ? (
                  <>
                    <span className="mx-1.5 opacity-50">·</span>
                    <span className="text-amber-700 tabular-nums dark:text-amber-400">
                      {pending} pending
                    </span>
                  </>
                ) : null}
              </>
            ) : null}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0 gap-1.5 lg:hidden"
          onClick={onOpenPicker}
          disabled={!hasSlots || teamPositionsLoading}
        >
          <PanelLeft className="size-4 opacity-70" aria-hidden />
          Change position
        </Button>
      </div>

      {filledPeople.length > 0 ? (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            On slot
          </span>
          {filledPeople.map((p) => (
            <span
              key={`${p.id}-${p.rawStatus}`}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs",
                p.status === "confirmed"
                  ? "border-emerald-400/50 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200"
                  : "border-amber-400/50 bg-amber-500/10 text-amber-800 dark:text-amber-200"
              )}
            >
              <Avatar className="size-4">
                <AvatarImage src={p.photoThumbnailUrl || undefined} alt={p.name} />
                <AvatarFallback className="text-[8px]">{getInitials(p.name)}</AvatarFallback>
              </Avatar>
              {p.name}
            </span>
          ))}
        </div>
      ) : null}

      <div className="flex items-center gap-2">
        <div className="relative max-w-xs flex-1">
          <Search
            className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground/70"
            aria-hidden
          />
          <Input
            value={filter}
            onChange={(event) => onFilterChange(event.target.value)}
            placeholder="Filter people…"
            className="h-8 pl-8 pr-8 text-sm"
            aria-label="Filter people"
          />
          {filter ? (
            <button
              type="button"
              onClick={() => onFilterChange("")}
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              aria-label="Clear filter"
            >
              <X className="size-3.5" />
            </button>
          ) : null}
        </div>
        {totalAvailable > 0 ? (
          <span className="shrink-0 text-xs tabular-nums text-muted-foreground/80">
            {filter ? `${totalShown} of ${totalAvailable}` : `${totalAvailable} people`}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function UnselectedPositionEmpty({
  teamPositionGroups,
  hasSlots,
  teamPositionsLoading,
  onOpenPicker,
  onSelect,
}: {
  teamPositionGroups: TeamPositionGroup[] | undefined;
  hasSlots: boolean;
  teamPositionsLoading: boolean;
  onOpenPicker: () => void;
  onSelect: (slot: SlotRef) => void;
}) {
  const stats = useMemo(() => {
    if (!teamPositionGroups) return { totalNeeded: 0, openPositions: 0, firstOpen: null as SlotRef | null };
    let totalNeeded = 0;
    let openPositions = 0;
    let firstOpen: SlotRef | null = null;
    for (const group of teamPositionGroups) {
      for (const position of group.positions) {
        const need = position.neededCount ?? 0;
        if (need > 0) {
          totalNeeded += need;
          openPositions += 1;
          if (!firstOpen) {
            firstOpen = {
              teamId: group.teamId,
              teamName: group.teamName,
              positionId: position.id,
              positionName: position.name,
            };
          }
        }
      }
    }
    return { totalNeeded, openPositions, firstOpen };
  }, [teamPositionGroups]);

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-5 p-6 text-center lg:h-full">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted/40 text-muted-foreground">
        <MousePointerClick className="size-5" />
      </div>
      <div className="space-y-1">
        <p className="text-base font-semibold tracking-tight">Pick a position to start scheduling</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          {stats.totalNeeded > 0
            ? `${stats.totalNeeded} ${stats.totalNeeded === 1 ? "spot" : "spots"} still need someone across ${stats.openPositions} ${stats.openPositions === 1 ? "position" : "positions"}.`
            : hasSlots
              ? "Every position is filled. Pick one to review who's serving."
              : "This plan has no team positions yet."}
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {stats.firstOpen ? (
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => onSelect(stats.firstOpen!)}
            disabled={teamPositionsLoading}
          >
            Jump to {stats.firstOpen.positionName}
          </Button>
        ) : null}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="lg:hidden"
          onClick={onOpenPicker}
          disabled={!hasSlots || teamPositionsLoading}
        >
          <PanelLeft className="size-4 opacity-70" aria-hidden />
          Open positions
        </Button>
      </div>
    </div>
  );
}

function SectionLabel({
  title,
  count,
  hint,
}: {
  title: string;
  count: number;
  hint?: string;
}) {
  return (
    <div className="sticky top-0 z-10 -mx-1 flex items-baseline gap-2 bg-background/95 px-1 pb-1 pt-0.5 backdrop-blur">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      <span className="text-xs tabular-nums text-muted-foreground/70">{count}</span>
      {hint ? (
        <span className="ml-auto truncate text-[11px] text-muted-foreground/60">{hint}</span>
      ) : null}
    </div>
  );
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]?.slice(0, 2).toUpperCase() || "?";
  return `${parts[0]?.[0] || ""}${parts[1]?.[0] || ""}`.toUpperCase();
}
