"use client";

import { ChevronsUpDown, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TeamPosition } from "@/lib/types";
import { cn } from "@/lib/utils";

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
  const isTemporaryPosition = !!info?.position.source && info.position.source !== "team_position";

  return (
    <div className="flex shrink-0 flex-col gap-2 px-1 sm:gap-3">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <p className={cn(
            "min-w-0 truncate text-xl font-semibold leading-tight tracking-tight sm:text-2xl",
            isTemporaryPosition && "italic"
          )}>
            {info?.positionName ?? "Position"}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 shrink-0 gap-1 px-2.5 text-xs sm:px-3 sm:text-sm lg:hidden"
          onClick={onOpenPicker}
          disabled={!hasSlots || teamPositionsLoading}
          title="Change position"
          aria-label="Change position"
        >
          <span>Positions</span>
          <ChevronsUpDown className="size-3.5 opacity-60" aria-hidden />
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full flex-1 sm:max-w-sm">
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
