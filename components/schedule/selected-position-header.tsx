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
  return (
    <div className="flex shrink-0 flex-col gap-3 px-1">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="min-w-0 flex-1 truncate text-2xl font-semibold leading-tight tracking-tight">
          {info?.positionName}
        </p>
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
