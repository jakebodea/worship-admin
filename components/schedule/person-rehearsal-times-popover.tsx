"use client";

import { useMemo, useState } from "react";
import { Check, Clock3, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "@/components/ui/sonner";
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

function formatTimeRange(planTime: PlanTime, timeZone: string): string {
  const start = formatWallTimeInTimeZone(planTime.startsAt, timeZone).timeValue;
  const end = planTime.endsAt ? formatWallTimeInTimeZone(planTime.endsAt, timeZone).timeValue : null;
  return end ? `${start}-${end}` : start;
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
  const [open, setOpen] = useState(false);
  const [draftTimeIds, setDraftTimeIds] = useState<string[]>(person.assignedTimeIds ?? []);
  const [saving, setSaving] = useState(false);
  const rehearsalTimes = useMemo(
    () => planTimes.filter((planTime) => planTime.timeType === "rehearsal"),
    [planTimes]
  );
  const rehearsalIds = useMemo(() => rehearsalTimes.map((planTime) => planTime.id), [rehearsalTimes]);
  const selectedRehearsalCount = rehearsalIds.filter((id) => draftTimeIds.includes(id)).length;
  const originalTimeIds = person.assignedTimeIds ?? [];
  const canEdit = !!serviceTypeId && !!planId && !!person.personId && rehearsalTimes.length > 0;
  const changed = !haveSameIds(originalTimeIds, draftTimeIds);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) setDraftTimeIds(person.assignedTimeIds ?? []);
  };

  const save = async () => {
    if (!serviceTypeId || !planId || !person.personId || !changed) return;

    setSaving(true);
    try {
      await patchJson(`/api/plan-people/${encodeURIComponent(person.planPersonId)}/times`, {
        service_type_id: serviceTypeId,
        plan_id: planId,
        person_id: person.personId,
        plan_time_ids: draftTimeIds,
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
      toast.success("Rehearsals updated");
      setOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update rehearsals");
    } finally {
      setSaving(false);
    }
  };

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
      <PopoverContent align="end" sideOffset={8} className="w-[320px] p-0">
        <div className="border-b px-3 py-2">
          <p className="truncate text-sm font-medium">{person.name}</p>
          <p className="text-xs text-muted-foreground">Rehearsal attendance</p>
        </div>

        <div className="flex flex-col py-1">
          {rehearsalTimes.map((planTime) => {
            const selected = draftTimeIds.includes(planTime.id);

            return (
              <button
                key={planTime.id}
                type="button"
                className="flex min-w-0 items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted/60 focus-visible:bg-muted focus-visible:outline-none"
                onClick={() => setDraftTimeIds((current) => toggleId(current, planTime.id))}
              >
                <Check className={cn(selected ? "opacity-100" : "opacity-0")} />
                <span className="min-w-0 flex-1 truncate">{planTime.name}</span>
                <Badge variant="outline" className="font-normal tabular-nums">
                  {formatTimeRange(planTime, timeZone)}
                </Badge>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-end gap-2 border-t px-3 py-2">
          <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="button" size="sm" disabled={!changed || saving} onClick={() => void save()}>
            {saving ? <Loader2 data-icon="inline-start" className="animate-spin" /> : null}
            Save
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
