"use client";

import { CalendarDays } from "lucide-react";
import type { SlotRef } from "@/components/schedule/types";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { getInitials } from "@/lib/format/initials";
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
        No slots found for this plan.
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
    <section className="w-[380px] shrink-0">
      <div className="overflow-hidden rounded-lg border border-border/40 bg-card/50">
        <header className="flex items-baseline justify-between gap-2 border-b border-border/40 px-3 py-2">
          <h3 className="truncate text-sm font-semibold tracking-tight">{group.teamName}</h3>
          <p className="text-xs text-muted-foreground tabular-nums">
            {totalNeeded > 0 ? `${totalScheduled}/${totalNeeded}` : `${totalScheduled}`}
          </p>
        </header>

        <Accordion
          type="multiple"
          defaultValue={group.positions.map((position) => position.id)}
          className="w-full px-2 py-0.5"
        >
          {group.positions.map((position, index) => (
            <div key={position.id}>
              <PositionAccordionItem
                teamId={group.teamId}
                teamName={group.teamName}
                position={position}
                onSelectPosition={onSelectPosition}
              />
              {index < group.positions.length - 1 ? <Separator className="opacity-30" /> : null}
            </div>
          ))}
        </Accordion>
      </div>
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
  const total = scheduledCount + needed;
  const people = position.filledPeople ?? [];

  return (
    <AccordionItem value={position.id} className="rounded-sm border-b-0 transition-colors hover:bg-muted/40">
      <AccordionHeader className="rounded-none px-1 py-0">
        <AccordionTrigger className="min-w-0 flex-1 gap-1 rounded-none py-2 hover:no-underline">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <span className="truncate text-sm font-medium">{position.name}</span>
            <span className="text-[11px] text-muted-foreground tabular-nums">
              {needed > 0 ? `${scheduledCount}/${total}` : `${scheduledCount}`}
            </span>
            {needed > 0 ? (
              <span className="text-[11px] font-medium text-red-600 dark:text-red-400 tabular-nums">
                +{needed}
              </span>
            ) : null}
          </div>
        </AccordionTrigger>
        <button
          type="button"
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "size-7 shrink-0 text-muted-foreground hover:text-foreground"
          )}
          title={`Open ${position.name} in scheduler`}
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
          <CalendarDays className="size-3.5" />
        </button>
      </AccordionHeader>

      <AccordionContent
        className="cursor-pointer pb-3 pt-0"
        onClick={(event) => {
          const target = event.target as HTMLElement;
          if (target.closest("button, a, input, textarea, select, [role='button']")) return;

          const trigger = event.currentTarget
            .closest("[data-slot='accordion-item']")
            ?.querySelector<HTMLButtonElement>("[data-slot='accordion-trigger']");
          trigger?.click();
        }}
      >
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
