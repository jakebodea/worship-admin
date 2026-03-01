"use client";

import { ChevronDown } from "lucide-react";
import { PersonCard } from "@/components/person-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
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
  return (
    <div className="grid gap-4 xl:h-full xl:min-h-0 xl:flex-1 xl:grid-cols-[320px_minmax(0,1fr)]">
      <Card className="shrink-0 gap-0 border-0 py-0 shadow-none xl:h-full xl:min-h-0">
        <ScrollArea className="h-[60vh] xl:h-full">
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
                    onToggle={onToggleTeam}
                    onSelect={onSelectSlot}
                  />
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </Card>

      <ScrollArea className="xl:min-h-0 xl:h-full">
        {!selectedPosition ? (
          <div className="px-2 py-10 text-center text-sm text-muted-foreground">
            Select a position to schedule a person.
          </div>
        ) : peopleLoading ? (
          <div className="grid grid-cols-1 gap-3 pb-2 md:grid-cols-2 2xl:grid-cols-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        ) : !people || people.length === 0 ? (
          <div className="px-2 py-10 text-center text-sm text-muted-foreground">
            No people found for this position. Make sure the position has team members assigned.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 pb-2 md:grid-cols-2 2xl:grid-cols-3">
            {people.map((person) => (
              <PersonCard
                key={[
                  person.id,
                  selectedServiceTypeId ?? "no-st",
                  selectedPlanId ?? "no-plan",
                  selectedTeam ?? "no-team",
                  selectedPosition ?? "no-position",
                ].join(":")}
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
        )}
      </ScrollArea>
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
  const hasSelectedPositionInGroup =
    group.teamId === selectedTeam &&
    group.positions.some((position) => position.id === selectedPosition);
  const isOpen = hasSelectedPositionInGroup || !isCollapsed;

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={() => onToggle(group.teamId)}
      className="overflow-hidden rounded-md border border-border/50 bg-background/90"
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className={cn("h-auto w-full justify-between gap-3 rounded-none px-3 py-2 text-left hover:bg-muted/45")}
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
              <p className="text-[11px] text-muted-foreground">{group.positions.length} positions</p>
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
            const active = group.teamId === selectedTeam && position.id === selectedPosition;

            return (
              <div
                key={position.id}
                className={cn(
                  "flex w-full items-center justify-between gap-2 border-l-2 border-transparent px-3 py-1.5 text-left text-sm transition-colors",
                  index > 0 && "border-t border-border/40",
                  active ? "border-l-foreground/25 bg-muted/35" : "hover:bg-muted/45"
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
                  <div className="flex min-w-0 items-center gap-2 pr-2">
                    {active ? (
                      <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-foreground/60" />
                    ) : null}
                    <span className={cn("block truncate", active && "font-medium text-foreground")}>
                      {position.name}
                    </span>
                  </div>
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
          <HoverCardContent align="end" side="right" className="w-80">
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
          <HoverCardContent align="end" side="right" className="w-80">
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
                <AvatarFallback className="text-[10px]">{getInitials(person.name)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{person.name}</p>
                <p
                  className={cn(
                    "text-[11px]",
                    person.status === "confirmed" ? "text-green-700" : "text-amber-700"
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
