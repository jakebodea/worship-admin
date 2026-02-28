"use client";

import { CalendarDays } from "lucide-react";
import type { SlotRef } from "@/components/schedule/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import type { FilledPositionPerson, TeamPosition, TeamPositionGroup } from "@/lib/types";
import { cn } from "@/lib/utils";

interface LineupTabProps {
  groups: TeamPositionGroup[];
  isLoading: boolean;
  onSelectPosition: (slot: SlotRef) => void;
}

export function LineupTab({
  groups,
  isLoading,
  onSelectPosition,
}: LineupTabProps) {
  if (isLoading) {
    return (
      <ScrollArea className="max-h-[70vh] w-full xl:h-full xl:max-h-none">
        <div className="flex min-w-max items-start gap-6 pb-3 pr-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-80 w-[420px]" />
          ))}
        </div>
      </ScrollArea>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="rounded-md border border-dashed px-4 py-10 text-center text-sm text-muted-foreground">
        No teams with needed slots for this plan.
      </div>
    );
  }

  return (
    <ScrollArea className="max-h-[70vh] w-full xl:h-full xl:max-h-none">
      <div className="flex min-w-max items-start gap-6 pb-3 pr-4">
        {groups.map((group) => (
          <TeamColumn key={group.teamId} group={group} onSelectPosition={onSelectPosition} />
        ))}
      </div>
    </ScrollArea>
  );
}

function TeamColumn({
  group,
  onSelectPosition,
}: {
  group: TeamPositionGroup;
  onSelectPosition: (slot: SlotRef) => void;
}) {
  const totalScheduled = group.positions.reduce(
    (sum, position) => sum + (position.filledConfirmedCount ?? 0) + (position.filledPendingCount ?? 0),
    0
  );
  const totalNeeded = group.positions.reduce((sum, position) => sum + (position.neededCount ?? 0), 0);

  return (
    <section className="w-[420px] shrink-0">
      <header className="mb-2 flex items-baseline justify-between gap-2">
        <h3 className="truncate text-lg font-semibold">{group.teamName}</h3>
        <p className="text-xs text-muted-foreground tabular-nums">
          {totalNeeded > 0 ? `${totalScheduled}/${totalNeeded}` : `${totalScheduled}`}
        </p>
      </header>

      <Accordion
        type="multiple"
        defaultValue={group.positions.map((position) => position.id)}
        className="w-full rounded-md border border-border/40 bg-background/60 px-2"
      >
        {group.positions.map((position) => (
          <PositionAccordionItem
            key={position.id}
            teamId={group.teamId}
            teamName={group.teamName}
            position={position}
            onSelectPosition={onSelectPosition}
          />
        ))}
      </Accordion>
    </section>
  );
}

function PositionAccordionItem({
  teamId,
  teamName,
  position,
  onSelectPosition,
}: {
  teamId: string;
  teamName: string;
  position: TeamPosition;
  onSelectPosition: (slot: SlotRef) => void;
}) {
  const confirmed = position.filledConfirmedCount ?? 0;
  const pending = position.filledPendingCount ?? 0;
  const scheduledCount = confirmed + pending;
  const needed = position.neededCount ?? 0;
  const people = position.filledPeople ?? [];

  return (
    <AccordionItem value={position.id} className="border-border/40">
      <AccordionTrigger className="gap-1 py-2 hover:no-underline">
        <div className="flex w-full min-w-0 items-center gap-2">
          <span className="truncate text-sm font-medium">{position.name}</span>
          <span className="text-xs text-muted-foreground tabular-nums">
            {needed > 0 ? `${scheduledCount}/${needed}` : `${scheduledCount}`}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto size-7 shrink-0"
            aria-label={`Open ${position.name} in scheduler`}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onSelectPosition({
                teamId,
                teamName,
                positionId: position.id,
                positionName: position.name,
              });
            }}
          >
            <CalendarDays className="size-4" />
          </Button>
        </div>
      </AccordionTrigger>

      <AccordionContent className="pb-2 pt-0">
        {people.length === 0 ? (
          <p className="pl-1 text-xs text-muted-foreground">No one</p>
        ) : (
          <ul className="space-y-1.5 pl-1">
            {people.map((person) => (
              <PersonRow key={`${position.id}-${person.id}-${person.rawStatus}`} person={person} />
            ))}
          </ul>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}

function PersonRow({ person }: { person: FilledPositionPerson }) {
  return (
    <li className="flex items-center gap-2 text-sm">
      <Avatar className="h-6 w-6">
        <AvatarImage src={person.photoThumbnailUrl || undefined} alt={person.name} />
        <AvatarFallback className="text-[10px]">{getInitials(person.name)}</AvatarFallback>
      </Avatar>

      <span className="truncate">{person.name}</span>
      <span
        className={cn(
          "ml-auto size-2 shrink-0 rounded-full",
          person.status === "confirmed" ? "bg-green-500" : "bg-amber-500"
        )}
        title={person.status === "confirmed" ? "Confirmed" : "Pending"}
      />
    </li>
  );
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]?.slice(0, 2).toUpperCase() || "?";
  return `${parts[0]?.[0] || ""}${parts[1]?.[0] || ""}`.toUpperCase();
}
