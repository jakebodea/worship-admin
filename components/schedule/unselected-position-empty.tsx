"use client";

import { useMemo } from "react";
import { MousePointerClick, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SlotRef } from "@/components/schedule/types";
import type { TeamPositionGroup } from "@/lib/types";

export function UnselectedPositionEmpty({
  teamPositionGroups,
  hasSlots,
  teamPositionsLoading,
  onOpenPicker,
  onSelect,
}: {
  teamPositionGroups: TeamPositionGroup[] | undefined;
  hasSlots: boolean;
  teamPositionsLoading: boolean;
  onOpenPicker: () => void;
  onSelect: (slot: SlotRef) => void;
}) {
  const stats = useMemo(() => {
    if (!teamPositionGroups) return { totalNeeded: 0, openPositions: 0, firstOpen: null as SlotRef | null };
    let totalNeeded = 0;
    let openPositions = 0;
    let firstOpen: SlotRef | null = null;
    for (const group of teamPositionGroups) {
      for (const position of group.positions) {
        const need = position.neededCount ?? 0;
        if (need > 0) {
          totalNeeded += need;
          openPositions += 1;
          if (!firstOpen) {
            firstOpen = {
              teamId: group.teamId,
              teamName: group.teamName,
              positionId: position.id,
              positionName: position.name,
            };
          }
        }
      }
    }
    return { totalNeeded, openPositions, firstOpen };
  }, [teamPositionGroups]);

  const summary =
    stats.totalNeeded > 0
      ? `${stats.totalNeeded} open · ${stats.openPositions} ${stats.openPositions === 1 ? "position" : "positions"}`
      : hasSlots
        ? "All filled"
        : "No positions";

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 p-6 text-center lg:h-full">
      <MousePointerClick className="size-5 text-muted-foreground/70" />
      <p className="text-sm text-muted-foreground">
        Pick a position
        <span className="mx-1.5 opacity-50">·</span>
        <span>{summary}</span>
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {stats.firstOpen ? (
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => onSelect(stats.firstOpen!)}
            disabled={teamPositionsLoading}
          >
            Jump to {stats.firstOpen.positionName}
          </Button>
        ) : null}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="lg:hidden"
          onClick={onOpenPicker}
          disabled={!hasSlots || teamPositionsLoading}
        >
          <PanelLeft className="size-4 opacity-70" aria-hidden />
          Open positions
        </Button>
      </div>
    </div>
  );
}
