"use client";

import { useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useTeamPositions } from "@/hooks/use-team-positions";

interface PositionSelectorProps {
  serviceTypeId: string | null;
  selectedTeam: string | null;
  selectedPosition: string | null;
  onTeamChange: (teamId: string) => void;
  onPositionChange: (positionId: string) => void;
}

export function PositionSelector({
  serviceTypeId,
  selectedTeam,
  selectedPosition,
  onTeamChange,
  onPositionChange,
}: PositionSelectorProps) {
  const { data: teamPositionGroups, isLoading } =
    useTeamPositions(serviceTypeId);

  const availablePositions = useMemo(() => {
    if (!teamPositionGroups || !selectedTeam) return [];
    const group = teamPositionGroups.find((g) => g.teamId === selectedTeam);
    return group?.positions || [];
  }, [teamPositionGroups, selectedTeam]);

  // Reset position when team changes
  const handleTeamChange = (teamId: string) => {
    onTeamChange(teamId);
    onPositionChange(""); // Reset position selection
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
          <label className="text-sm font-medium mb-2 block">Team</label>
          <Select value={selectedTeam || ""} onValueChange={handleTeamChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a team" />
            </SelectTrigger>
            <SelectContent>
              {teamPositionGroups.map((group) => (
                <SelectItem key={group.teamId} value={group.teamId}>
                  {group.teamName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">Position</label>
          <Select
            value={selectedPosition || ""}
            onValueChange={onPositionChange}
            disabled={!selectedTeam || availablePositions.length === 0}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a position" />
            </SelectTrigger>
            <SelectContent>
              {availablePositions.map((position) => (
                <SelectItem key={position.id} value={position.id}>
                  {position.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
