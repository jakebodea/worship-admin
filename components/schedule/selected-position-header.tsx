"use client";

import { PanelLeft, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TeamPosition } from "@/lib/types";

export function SelectedPositionHeader({
  info,
  onOpenPicker,
  hasSlots,
  teamPositionsLoading,
  filter,
  onFilterChange,
}: {
  info: { teamName: string; positionName: string; position: TeamPosition } | null;
  onOpenPicker: () => void;
  hasSlots: boolean;
  teamPositionsLoading: boolean;
  filter: string;
  onFilterChange: (next: string) => void;
}) {
  const position = info?.position;
  const confirmed = position?.filledConfirmedCount ?? 0;
  const pending = position?.filledPendingCount ?? 0;
  const needed = position?.neededCount ?? 0;
  const filled = confirmed + pending;
  const total = filled + needed;

  return (
    <div className="flex shrink-0 flex-col gap-3 px-1 pt-1">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-baseline gap-3">
          <p className="truncate text-xl font-semibold leading-tight tracking-tight">
            {info?.positionName}
          </p>
          {position ? (
            <p className="truncate text-sm text-muted-foreground">
              {info?.teamName}
              <span className="mx-1.5 opacity-50">·</span>
              <span className="tabular-nums">
                {filled}/{total}
              </span>
              {needed > 0 ? (
                <span className="ml-1.5 font-medium tabular-nums text-red-600 dark:text-red-400">
                  +{needed}
                </span>
              ) : pending > 0 ? (
                <span
                  aria-label={`${pending} pending`}
                  className="ml-1.5 inline-block size-1.5 rounded-full bg-amber-500 align-middle"
                />
              ) : filled > 0 ? (
                <span
                  aria-label="All confirmed"
                  className="ml-1.5 inline-block size-1.5 rounded-full bg-emerald-500 align-middle"
                />
              ) : null}
            </p>
          ) : null}
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

      <div className="flex items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70"
            aria-hidden
          />
          <Input
            value={filter}
            onChange={(event) => onFilterChange(event.target.value)}
            placeholder="Filter"
            className="h-9 pl-9 pr-9 text-sm"
            aria-label="Filter people"
          />
          {filter ? (
            <button
              type="button"
              onClick={() => onFilterChange("")}
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              aria-label="Clear filter"
            >
              <X className="size-4" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
