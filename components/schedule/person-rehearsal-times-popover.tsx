"use client";

import { useMemo } from "react";
import { Check, Clock3 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { formatPlanTimeRangeLabel } from "@/components/schedule/plan-time-display";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "@/components/ui/sonner";
import { useDraftPopover } from "@/hooks/use-persist-on-close-popover";
import { useOrganizationTimeZone } from "@/hooks/use-organization-timezone";
import { patchJson } from "@/lib/http/client";
import { formatWallTimeInTimeZone } from "@/lib/planning-center/org-calendar";
import { queryKeys } from "@/lib/query-keys";
import type { FilledPositionPerson, PlanTime } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PersonRehearsalTimesPopoverProps {
  person: FilledPositionPerson;
  planTimes: PlanTime[];
  serviceTypeId: string | null;
  planId: string | null;
}

function formatPlanTimeScheduleLabel(planTime: PlanTime, timeZone: string): string {
  const starts = formatWallTimeInTimeZone(planTime.startsAt, timeZone);
  const ends = planTime.endsAt ? formatWallTimeInTimeZone(planTime.endsAt, timeZone) : null;

  return formatPlanTimeRangeLabel({
    startDate: starts.dateKey,
    startTime: starts.timeValue,
    endDate: ends?.dateKey ?? starts.dateKey,
    endTime: ends?.timeValue ?? "",
  });
}

function haveSameIds(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const aSet = new Set(a);
  return b.every((id) => aSet.has(id));
}

function toggleId(ids: string[], id: string): string[] {
  return ids.includes(id) ? ids.filter((value) => value !== id) : [...ids, id];
}

export function PersonRehearsalTimesPopover({
  person,
  planTimes,
  serviceTypeId,
  planId,
}: PersonRehearsalTimesPopoverProps) {
  const queryClient = useQueryClient();
  const timeZone = useOrganizationTimeZone();
  const assignedTimeIds = person.assignedTimeIds ?? [];
  const rehearsalTimes = useMemo(
    () => planTimes.filter((planTime) => planTime.timeType === "rehearsal"),
    [planTimes]
  );
  const rehearsalIds = useMemo(() => rehearsalTimes.map((planTime) => planTime.id), [rehearsalTimes]);
  const canEdit = !!serviceTypeId && !!planId && !!person.personId && rehearsalTimes.length > 0;

  const persist = async (timeIds: string[]) => {
    if (!serviceTypeId || !planId || !person.personId) return;
    if (haveSameIds(assignedTimeIds, timeIds)) return;

    try {
      await patchJson(`/api/plan-people/${encodeURIComponent(person.planPersonId)}/times`, {
        service_type_id: serviceTypeId,
        plan_id: planId,
        person_id: person.personId,
        plan_time_ids: timeIds,
      });
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.teamPositions(serviceTypeId, planId, null),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.planTimes(serviceTypeId, planId),
        }),
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "people" && query.queryKey.includes(planId),
        }),
        queryClient.invalidateQueries({
          predicate: (query) =>
            query.queryKey[0] === "people-history-warmup" &&
            query.queryKey[1] === serviceTypeId,
        }),
      ]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update rehearsals");
    }
  };

  const { open, draft, setDraft, handleOpenChange } = useDraftPopover({
    value: assignedTimeIds,
    equals: haveSameIds,
    onPersist: persist,
  });
  const displayTimeIds = open ? draft : assignedTimeIds;
  const selectedRehearsalCount = rehearsalIds.filter((id) => displayTimeIds.includes(id)).length;

  if (rehearsalTimes.length === 0) return null;

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 max-w-full px-2 text-xs text-muted-foreground hover:text-foreground"
          disabled={!canEdit}
          aria-label={`Edit rehearsals for ${person.name}`}
        >
          <Clock3 data-icon="inline-start" />
          {selectedRehearsalCount}/{rehearsalTimes.length}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={8} className="w-96 p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {rehearsalTimes.map((planTime) => {
                const selected = draft.includes(planTime.id);

                return (
                  <CommandItem
                    key={planTime.id}
                    value={`${planTime.name} ${planTime.id}`}
                    onSelect={() => setDraft((current) => toggleId(current, planTime.id))}
                  >
                    <Check className={cn(selected ? "opacity-100" : "opacity-0")} />
                    <span className="min-w-0 flex-1 truncate">{planTime.name}</span>
                    <Badge variant="outline" className="max-w-[14rem] truncate font-normal">
                      {formatPlanTimeScheduleLabel(planTime, timeZone)}
                    </Badge>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
