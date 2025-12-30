"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Team } from "@/lib/types";

interface TeamFilterProps {
  teams: Team[];
  selectedTeam: string;
  onTeamChange: (teamId: string) => void;
}

export function TeamFilter({
  teams,
  selectedTeam,
  onTeamChange,
}: TeamFilterProps) {
  return (
    <Select value={selectedTeam} onValueChange={onTeamChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Filter by team" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Teams</SelectItem>
        {teams.map((team) => (
          <SelectItem key={team.id} value={team.id}>
            {team.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
