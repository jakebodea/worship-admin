"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock3, Save } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { DateTimeEditor } from "@/components/date-time-editor";
import {
  TimeAssignmentSelector,
  type TimeAssignmentValue,
} from "@/components/time-assignment-selector";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/sonner";
import { useOrganizationTimeZone } from "@/hooks/use-organization-timezone";
import { usePlanTimes } from "@/hooks/use-plan-times";
import { useTeamPositions } from "@/hooks/use-team-positions";
import { patchJson } from "@/lib/http/client";
import { formatWallTimeInTimeZone, zonedWallTimeToUtcIso } from "@/lib/planning-center/org-calendar";
import { type SerializedPlanTime } from "@/lib/plan-time-client";
import { queryKeys } from "@/lib/query-keys";
import type { PlanTime, PlanTimeType, TeamPositionGroup } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TimesTabProps {
  serviceTypeId: string | null;
  planId: string | null;
  seriesId: string | null;
}

interface EditablePlanTime {
  name: string;
  timeType: PlanTimeType;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  assignedTeamIds: string[];
  assignedPositionIds: string[];
  assignedNeededPositionIds: string[];
  assignedPlanPersonIds: string[];
}

const timeTypeLabels: Record<PlanTimeType, string> = {
  service: "Service",
  rehearsal: "Rehearsal",
  other: "Other",
};
const emptyPlanTimes: PlanTime[] = [];

function buildEditablePlanTime(
  planTime: PlanTime,
  timeZone: string,
  teamPositionGroups: TeamPositionGroup[] | undefined
): EditablePlanTime {
  const starts = formatWallTimeInTimeZone(planTime.startsAt, timeZone);
  const ends = planTime.endsAt ? formatWallTimeInTimeZone(planTime.endsAt, timeZone) : null;

  return {
    name: planTime.name,
    timeType: planTime.timeType,
    startDate: starts.dateKey,
    startTime: starts.timeValue,
    endDate: ends?.dateKey ?? starts.dateKey,
    endTime: ends?.timeValue ?? "",
    assignedTeamIds: planTime.assignedTeamIds,
    assignedPositionIds: planTime.assignedPositionIds,
    assignedNeededPositionIds: getNeededPositionIdsForTime(teamPositionGroups, planTime.id),
    assignedPlanPersonIds: getPlanPersonIdsForTime(teamPositionGroups, planTime.id),
  };
}

function buildInitialEdits(
  planTimes: PlanTime[],
  timeZone: string,
  teamPositionGroups: TeamPositionGroup[] | undefined
): Record<string, EditablePlanTime> {
  return Object.fromEntries(
    planTimes.map((planTime) => [
      planTime.id,
      buildEditablePlanTime(planTime, timeZone, teamPositionGroups),
    ])
  );
}

function hasChanges(
  planTime: PlanTime,
  edit: EditablePlanTime,
  timeZone: string,
  teamPositionGroups: TeamPositionGroup[] | undefined
): boolean {
  const original = buildEditablePlanTime(planTime, timeZone, teamPositionGroups);
  return (
    original.name !== edit.name ||
    original.timeType !== edit.timeType ||
    original.startDate !== edit.startDate ||
    original.startTime !== edit.startTime ||
    original.endDate !== edit.endDate ||
    original.endTime !== edit.endTime ||
    !haveSameIds(original.assignedTeamIds, edit.assignedTeamIds) ||
    !haveSameIds(original.assignedPositionIds, edit.assignedPositionIds) ||
    !haveSameIds(original.assignedNeededPositionIds, edit.assignedNeededPositionIds) ||
    !haveSameIds(original.assignedPlanPersonIds, edit.assignedPlanPersonIds)
  );
}

function haveSameIds(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const aSet = new Set(a);
  return b.every((id) => aSet.has(id));
}

function isValidEdit(edit: EditablePlanTime): boolean {
  if (!edit.name.trim()) return false;
  if (!edit.startDate || !edit.startTime) return false;
  if (!edit.endTime) return true;

  const start = Date.parse(`${edit.startDate}T${edit.startTime}:00`);
  const end = Date.parse(`${edit.endDate}T${edit.endTime}:00`);
  return Number.isFinite(start) && Number.isFinite(end) && end >= start;
}

function buildPlanTimePatch(
  planTime: PlanTime,
  edit: EditablePlanTime,
  timeZone: string,
  teamPositionGroups: TeamPositionGroup[] | undefined
) {
  const originalNeededPositionIds = getNeededPositionIdsForTime(teamPositionGroups, planTime.id);
  const originalPlanPersonIds = getPlanPersonIdsForTime(teamPositionGroups, planTime.id);
  const newlyAssignedNeededPositionIds = edit.assignedNeededPositionIds.filter(
    (id) => !originalNeededPositionIds.includes(id)
  );
  const newlyAssignedPlanPersonIds = edit.assignedPlanPersonIds.filter(
    (id) => !originalPlanPersonIds.includes(id)
  );
  return {
    name: edit.name.trim(),
    time_type: edit.timeType,
    starts_at: zonedWallTimeToUtcIso(edit.startDate, edit.startTime, timeZone),
    ends_at: edit.endTime
      ? zonedWallTimeToUtcIso(edit.endDate || edit.startDate, edit.endTime, timeZone)
      : null,
    assigned_team_ids: edit.assignedTeamIds,
    assigned_position_ids: edit.assignedPositionIds,
    assigned_needed_position_ids: newlyAssignedNeededPositionIds,
    cleared_needed_position_ids: originalNeededPositionIds.filter(
      (id) => !edit.assignedNeededPositionIds.includes(id)
    ),
    assigned_plan_person_ids: newlyAssignedPlanPersonIds,
    cleared_plan_person_ids: originalPlanPersonIds.filter(
      (id) => !edit.assignedPlanPersonIds.includes(id)
    ),
  };
}

function summarizeTimeRange(edit: EditablePlanTime): string {
  if (!edit.startTime) return "No start time";
  if (!edit.endTime) return edit.startTime;
  return `${edit.startTime} to ${edit.endTime}`;
}

function getNeededPositionIdsForTime(
  groups: TeamPositionGroup[] | undefined,
  planTimeId: string
): string[] {
  return (groups ?? []).flatMap((group) =>
    group.positions
      .filter((position) => position.neededPositionId && position.timeId === planTimeId)
      .map((position) => position.neededPositionId!)
  );
}

function getPlanPersonIdsForTime(
  groups: TeamPositionGroup[] | undefined,
  planTimeId: string
): string[] {
  return (groups ?? []).flatMap((group) =>
    group.positions.flatMap((position) =>
      (position.filledPeople ?? [])
        .filter((person) => person.assignedTimeIds?.includes(planTimeId))
        .map((person) => person.planPersonId)
    )
  );
}

function getAssignmentValue(edit: EditablePlanTime): TimeAssignmentValue {
  return {
    teamIds: edit.assignedTeamIds,
    positionIds: edit.assignedPositionIds,
    neededPositionIds: edit.assignedNeededPositionIds,
    planPersonIds: edit.assignedPlanPersonIds,
  };
}

function getSecondaryScopeLabels(planTime: PlanTime): string[] {
  const labels: string[] = [];
  if (planTime.assignedPositionIds.length > 0) {
    labels.push(`${planTime.assignedPositionIds.length} positions`);
  }
  if (planTime.splitTeamRehearsalAssignmentIds.length > 0) {
    labels.push(`${planTime.splitTeamRehearsalAssignmentIds.length} split rules`);
  }
  return labels;
}

export function TimesTab({ serviceTypeId, planId, seriesId }: TimesTabProps) {
  const queryClient = useQueryClient();
  const timeZone = useOrganizationTimeZone();
  const planTimesQuery = usePlanTimes(serviceTypeId, planId);
  const teamPositionsQuery = useTeamPositions(serviceTypeId, planId, seriesId);
  const planTimes = planTimesQuery.data ?? emptyPlanTimes;
  const { isLoading, isPlaceholderData } = planTimesQuery;
  const [edits, setEdits] = useState<Record<string, EditablePlanTime>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const groupedPlanTimes = useMemo(() => {
    const groups: Record<PlanTimeType, PlanTime[]> = {
      rehearsal: [],
      service: [],
      other: [],
    };
    for (const planTime of planTimes) {
      groups[planTime.timeType].push(planTime);
    }
    return groups;
  }, [planTimes]);

  useEffect(() => {
    setEdits(buildInitialEdits(planTimes, timeZone, teamPositionsQuery.data));
  }, [planTimes, teamPositionsQuery.data, timeZone]);

  const updateEdit = (id: string, patch: Partial<EditablePlanTime>) => {
    setEdits((current) => ({
      ...current,
      [id]: {
        ...current[id],
        ...patch,
      },
    }));
  };

  const savePlanTime = async (planTime: PlanTime) => {
    if (!serviceTypeId || !planId) return;
    const edit = edits[planTime.id];
    if (!edit || !isValidEdit(edit)) return;

    setSavingId(planTime.id);
    try {
      await patchJson<SerializedPlanTime>(`/api/plan-times/${planTime.id}`, {
        service_type_id: serviceTypeId,
        plan_id: planId,
        ...buildPlanTimePatch(planTime, edit, timeZone, teamPositionsQuery.data),
      });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.planTimes(serviceTypeId, planId) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.plans(serviceTypeId) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.teamPositions(serviceTypeId, planId, seriesId) }),
        queryClient.invalidateQueries({
          predicate: (query) =>
            query.queryKey[0] === "people-history-warmup" &&
            query.queryKey[1] === serviceTypeId,
        }),
      ]);
      toast.success("Time updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update time");
    } finally {
      setSavingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-0 flex-1 flex-col gap-3">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (planTimes.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center text-sm text-muted-foreground">
        <span>No times found for this plan.</span>
      </div>
    );
  }

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col overflow-auto", isPlaceholderData && "opacity-70")}>
      <div className="flex flex-col gap-7 pb-6">
        {(["rehearsal", "service", "other"] as const).map((timeType) => {
          const group = groupedPlanTimes[timeType];
          if (group.length === 0) return null;

          return (
            <section key={timeType} className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-semibold">{timeTypeLabels[timeType]}</h2>
                <Badge variant="outline">{group.length}</Badge>
              </div>

              <div className="grid gap-3">
                {group.map((planTime) => {
                  const edit = edits[planTime.id];
                  if (!edit) return null;
                  const changed = hasChanges(planTime, edit, timeZone, teamPositionsQuery.data);
                  const valid = isValidEdit(edit);
                  const saving = savingId === planTime.id;
                  const secondaryScopeLabels = getSecondaryScopeLabels(planTime);

                  return (
                    <div key={planTime.id} className="rounded-md border bg-card p-4 shadow-xs">
                      <div className="grid gap-4 xl:grid-cols-[minmax(260px,0.9fr)_minmax(520px,1.7fr)_minmax(280px,1fr)_auto] xl:items-end">
                        <div className="flex min-w-0 flex-col gap-3">
                          <div className="flex min-w-0 items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-base font-medium">{edit.name || "Untitled time"}</p>
                              <p className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Clock3 data-icon="inline-start" />
                                {summarizeTimeRange(edit)}
                              </p>
                            </div>
                            {changed ? <Badge variant="secondary">Unsaved</Badge> : null}
                          </div>

                          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_140px]">
                            <Field className="gap-1.5">
                              <FieldLabel htmlFor={`plan-time-name-${planTime.id}`}>Name</FieldLabel>
                              <Input
                                id={`plan-time-name-${planTime.id}`}
                                value={edit.name}
                                onChange={(event) => updateEdit(planTime.id, { name: event.target.value })}
                              />
                            </Field>

                            <Field className="gap-1.5">
                              <FieldLabel htmlFor={`plan-time-type-${planTime.id}`}>Type</FieldLabel>
                              <NativeSelect
                                id={`plan-time-type-${planTime.id}`}
                                value={edit.timeType}
                                wrapperClassName="w-full"
                                onChange={(event) =>
                                  updateEdit(planTime.id, { timeType: event.target.value as PlanTimeType })
                                }
                              >
                                <NativeSelectOption value="rehearsal">Rehearsal</NativeSelectOption>
                                <NativeSelectOption value="service">Service</NativeSelectOption>
                                <NativeSelectOption value="other">Other</NativeSelectOption>
                              </NativeSelect>
                            </Field>
                          </div>
                        </div>

                        <div className="grid gap-3 lg:grid-cols-2">
                          <DateTimeEditor
                            id={`plan-time-start-${planTime.id}`}
                            label="Start"
                            dateValue={edit.startDate}
                            timeValue={edit.startTime}
                            invalid={!edit.startDate || !edit.startTime}
                            onDateChange={(startDate) =>
                              updateEdit(planTime.id, {
                                startDate,
                                endDate: edit.endDate || startDate,
                              })
                            }
                            onTimeChange={(startTime) => updateEdit(planTime.id, { startTime })}
                          />

                          <DateTimeEditor
                            id={`plan-time-end-${planTime.id}`}
                            label="End"
                            dateValue={edit.endDate}
                            timeValue={edit.endTime}
                            invalid={!valid}
                            onDateChange={(endDate) => updateEdit(planTime.id, { endDate })}
                            onTimeChange={(endTime) => updateEdit(planTime.id, { endTime })}
                          />
                        </div>

                        <Field className="gap-1.5">
                          <FieldLabel>Applies to</FieldLabel>
                          <TimeAssignmentSelector
                            groups={teamPositionsQuery.data ?? []}
                            value={getAssignmentValue(edit)}
                            onChange={(assignment) =>
                              updateEdit(planTime.id, {
                                assignedTeamIds: assignment.teamIds,
                                assignedPositionIds: assignment.positionIds,
                                assignedNeededPositionIds: assignment.neededPositionIds,
                                assignedPlanPersonIds: assignment.planPersonIds,
                              })
                            }
                            disabled={teamPositionsQuery.isLoading}
                          />
                          {secondaryScopeLabels.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {secondaryScopeLabels.map((label) => (
                                <Badge key={label} variant="outline" className="font-normal">
                                  {label}
                                </Badge>
                              ))}
                            </div>
                          ) : null}
                        </Field>

                        <Button
                          type="button"
                          size="sm"
                          className="xl:mb-px"
                          disabled={!changed || !valid || saving}
                          onClick={() => void savePlanTime(planTime)}
                        >
                          <Save data-icon="inline-start" />
                          {saving ? "Saving" : "Save"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
