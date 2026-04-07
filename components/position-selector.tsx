"use client";

import { useMemo } from "react";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Skeleton } from "@/components/ui/skeleton";
import { useTeamPositions } from "@/hooks/use-team-positions";

interface PositionSelectorProps {
  serviceTypeId: string | null;
  planId: string | null;
  seriesId: string | null;
  selectedTeam: string | null;
  selectedPosition: string | null;
  onTeamChange: (teamId: string) => void;
  onPositionChange: (positionId: string) => void;
}

export function PositionSelector({
  serviceTypeId,
  planId,
  seriesId,
  selectedTeam,
  selectedPosition,
  onTeamChange,
  onPositionChange,
}: PositionSelectorProps) {
  const { data: teamPositionGroups, isLoading } =
    useTeamPositions(serviceTypeId, planId, seriesId);

  const availablePositions = useMemo(() => {
    if (!teamPositionGroups || !selectedTeam) return [];
    const group = teamPositionGroups.find((g) => g.teamId === selectedTeam);
    return group?.positions || [];
  }, [teamPositionGroups, selectedTeam]);

  // Reset position when team changes
  const handleTeamChange = (teamId: string) => {
    onTeamChange(teamId);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (!teamPositionGroups || teamPositionGroups.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No team positions found for this service type.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold mb-2">
          Select Team and Position
        </h2>
        <p className="text-muted-foreground">
          Choose a team and position to see available people
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="position-selector-team" className="text-sm font-medium mb-2 block">
            Team
          </label>
          <NativeSelect
            id="position-selector-team"
            wrapperClassName="w-full"
            value={selectedTeam || ""}
            onChange={(event) => handleTeamChange(event.target.value)}
          >
            <NativeSelectOption value="" disabled>
              Select a team
            </NativeSelectOption>
            {teamPositionGroups.map((group) => (
              <NativeSelectOption key={group.teamId} value={group.teamId}>
                {group.teamName}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
        <div className="flex-1">
          <label htmlFor="position-selector-position" className="text-sm font-medium mb-2 block">
            Position
          </label>
          <NativeSelect
            id="position-selector-position"
            wrapperClassName="w-full"
            value={selectedPosition || ""}
            onChange={(event) => onPositionChange(event.target.value)}
            disabled={!selectedTeam || availablePositions.length === 0}
          >
            <NativeSelectOption value="" disabled>
              Select a position
            </NativeSelectOption>
            {availablePositions.map((position) => (
              <NativeSelectOption key={position.id} value={position.id}>
                {position.name}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
      </div>
    </div>
  );
}
