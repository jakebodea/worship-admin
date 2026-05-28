"use client";

import { useState } from "react";
import { ChevronDownIcon, Clock3, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { TimeAssignmentSelector, type TimeAssignmentValue } from "@/components/time-assignment-selector";
import {
  formatCalendarDay,
  formatPlanTimeRangeLabel,
  parseCalendarDay,
} from "@/components/schedule/plan-time-display";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { PlanTimeType, TeamPositionGroup } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PlanTimeEditState {
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

interface PlanTimeCardProps {
  planTimeId: string;
  edit: PlanTimeEditState;
  valid: boolean;
  saving: boolean;
  assignmentGroups: TeamPositionGroup[];
  assignmentsLoading: boolean;
  deleting: boolean;
  onEditChange: (patch: Partial<PlanTimeEditState>) => void;
  onCommitEdit: (patch: Partial<PlanTimeEditState>) => void;
  onPersist: () => void;
  onDelete: () => Promise<void>;
}

const timeTypeLabels: Record<PlanTimeType, string> = {
  service: "Service",
  rehearsal: "Rehearsal",
  other: "Other",
};

const timeInputClassName =
  "appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none";

export function PlanTimeCard({
  planTimeId,
  edit,
  valid,
  saving,
  assignmentGroups,
  assignmentsLoading,
  deleting,
  onEditChange,
  onCommitEdit,
  onPersist,
  onDelete,
}: PlanTimeCardProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const assignmentValue: TimeAssignmentValue = {
    teamIds: edit.assignedTeamIds,
    positionIds: edit.assignedPositionIds,
    neededPositionIds: edit.assignedNeededPositionIds,
    planPersonIds: edit.assignedPlanPersonIds,
  };

  return (
    <div
      className={cn(
        "group/plan-time rounded-lg border bg-card p-3.5 shadow-xs transition-colors hover:border-border/80",
        saving && "opacity-70"
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <input
            id={`plan-time-name-${planTimeId}`}
            value={edit.name}
            placeholder="Untitled time"
            aria-label="Time name"
            onChange={(event) => onEditChange({ name: event.target.value })}
            onBlur={(event) => onCommitEdit({ name: event.target.value })}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                event.currentTarget.blur();
              }
            }}
            className={cn(
              "min-w-0 flex-1 rounded-md border border-transparent bg-transparent px-1.5 py-0.5 -mx-1.5 text-base font-semibold shadow-none outline-none transition-[color,background-color,border-color,box-shadow]",
              "hover:border-border/60 hover:bg-muted/30",
              "focus-visible:border-ring focus-visible:bg-background focus-visible:ring-[3px] focus-visible:ring-ring/50",
              !edit.name.trim() && "text-muted-foreground"
            )}
          />
          <NativeSelect
            id={`plan-time-type-${planTimeId}`}
            size="sm"
            value={edit.timeType}
            wrapperClassName="shrink-0 opacity-80 transition-opacity hover:opacity-100"
            className="h-7 border-border/60 bg-muted/20 pr-8 pl-2.5 text-xs font-medium shadow-none"
            aria-label="Time type"
            onChange={(event) =>
              onCommitEdit({ timeType: event.target.value as PlanTimeType })
            }
          >
            <NativeSelectOption value="rehearsal">{timeTypeLabels.rehearsal}</NativeSelectOption>
            <NativeSelectOption value="service">{timeTypeLabels.service}</NativeSelectOption>
            <NativeSelectOption value="other">{timeTypeLabels.other}</NativeSelectOption>
          </NativeSelect>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="size-7 shrink-0 text-muted-foreground hover:text-destructive"
            aria-label={`Delete ${edit.name || "time"}`}
            disabled={saving || deleting}
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>

        <PlanTimeRangeEditor
          id={`plan-time-range-${planTimeId}`}
          startDate={edit.startDate}
          startTime={edit.startTime}
          endDate={edit.endDate}
          endTime={edit.endTime}
          invalid={!valid}
          onEditChange={onEditChange}
          onCommitEdit={onCommitEdit}
          onPersist={onPersist}
        />

        <TimeAssignmentSelector
          groups={assignmentGroups}
          value={assignmentValue}
          disabled={assignmentsLoading}
          onChange={(assignment) =>
            onCommitEdit({
              assignedTeamIds: assignment.teamIds,
              assignedPositionIds: assignment.positionIds,
              assignedNeededPositionIds: assignment.neededPositionIds,
              assignedPlanPersonIds: assignment.planPersonIds,
            })
          }
        />
      </div>
      <DeleteConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={async () => {
          await onDelete();
          setDeleteOpen(false);
        }}
        isPending={deleting}
        itemLabel={edit.name || "this time"}
        title="Delete time?"
        description="Remove this time from the plan? Any assignments tied to it will also lose this time."
        confirmLabel="Delete time"
      />
    </div>
  );
}

interface PlanTimeRangeEditorProps {
  id: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  invalid?: boolean;
  onEditChange: (patch: {
    startDate?: string;
    startTime?: string;
    endDate?: string;
    endTime?: string;
  }) => void;
  onCommitEdit: (patch: {
    startDate?: string;
    startTime?: string;
    endDate?: string;
    endTime?: string;
  }) => void;
  onPersist: () => void;
}

function PlanTimeRangeEditor({
  id,
  startDate,
  startTime,
  endDate,
  endTime,
  invalid = false,
  onEditChange,
  onCommitEdit,
  onPersist,
}: PlanTimeRangeEditorProps) {
  const [open, setOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const sameDay = !endDate || endDate === startDate;
  const displayLabel = formatPlanTimeRangeLabel({ startDate, startTime, endDate, endTime });

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      onPersist();
      setDateOpen(false);
      setEndDateOpen(false);
    }
    setOpen(nextOpen);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange} modal={false}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "group/time-range flex min-h-8 w-full cursor-pointer items-center gap-1.5 rounded-md py-1 pr-1 text-left text-sm text-muted-foreground transition-[color,background-color]",
            "hover:bg-muted/30 hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
            open && "bg-muted/30 text-foreground"
          )}
          data-invalid={invalid || undefined}
          aria-label={`Edit time, ${displayLabel}`}
          aria-expanded={open}
        >
          <Clock3 className="size-3.5 shrink-0" />
          <span className={cn("min-w-0 flex-1", invalid && "text-destructive")}>{displayLabel}</span>
          <Pencil
            className={cn(
              "size-3.5 shrink-0 transition-opacity",
              open ? "opacity-60" : "opacity-0 group-hover/time-range:opacity-60"
            )}
            aria-hidden="true"
          />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-80 p-4"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <FieldGroup className="gap-4" data-invalid={invalid || undefined}>
          <DatePickerField
            id={`${id}-date`}
            label="Date"
            value={startDate}
            invalid={invalid}
            open={dateOpen}
            onOpenChange={setDateOpen}
            onChange={(dateKey) =>
              onCommitEdit({
                startDate: dateKey,
                endDate: endDate || dateKey,
              })
            }
          />

          <div className="flex gap-3">
            <TimePickerField
              id={`${id}-start-time`}
              label="Start"
              value={startTime}
              invalid={invalid}
              onChange={(startTime) => onEditChange({ startTime })}
              onBlur={onPersist}
            />
            <TimePickerField
              id={`${id}-end-time`}
              label="End"
              value={endTime}
              invalid={invalid}
              onChange={(endTime) => onEditChange({ endTime })}
              onBlur={onPersist}
            />
          </div>

          {!sameDay ? (
            <DatePickerField
              id={`${id}-end-date`}
              label="End date"
              value={endDate || startDate}
              invalid={invalid}
              open={endDateOpen}
              onOpenChange={setEndDateOpen}
              onChange={(dateKey) => onCommitEdit({ endDate: dateKey })}
            />
          ) : null}
        </FieldGroup>

        <div className="mt-4 flex justify-end">
          <Button type="button" size="sm" onClick={() => handleOpenChange(false)}>
            Done
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface DatePickerFieldProps {
  id: string;
  label: string;
  value: string;
  invalid?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChange: (dateKey: string) => void;
}

function DatePickerField({
  id,
  label,
  value,
  invalid = false,
  open,
  onOpenChange,
  onChange,
}: DatePickerFieldProps) {
  const selectedDate = parseCalendarDay(value);

  return (
    <Field className="gap-1.5">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            id={id}
            className="w-full justify-between font-normal"
            aria-invalid={invalid || undefined}
          >
            <span className="truncate">
              {selectedDate ? format(selectedDate, "MMM d, yyyy") : "Select date"}
            </span>
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            captionLayout="dropdown"
            defaultMonth={selectedDate}
            onSelect={(date) => {
              if (!date) return;
              onChange(formatCalendarDay(date));
              onOpenChange(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}

interface TimePickerFieldProps {
  id: string;
  label: string;
  value: string;
  invalid?: boolean;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

function TimePickerField({
  id,
  label,
  value,
  invalid = false,
  onChange,
  onBlur,
}: TimePickerFieldProps) {
  return (
    <Field className="min-w-0 flex-1 gap-1.5">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        type="time"
        id={id}
        value={value}
        aria-invalid={invalid || undefined}
        className={timeInputClassName}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
      />
    </Field>
  );
}
