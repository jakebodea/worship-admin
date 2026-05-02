"use client";

import { CalendarDays } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarMenuSkeleton } from "@/components/ui/sidebar";
import { TeamSlotsCollapsible } from "@/components/schedule/team-slots-collapsible";
import type { SlotRef } from "@/components/schedule/types";
import type { TeamPositionGroup } from "@/lib/types";

export function PositionPickerList({
  teamPositionsLoading,
  teamPositionGroups,
  collapsedTeams,
  selectedTeam,
  selectedPosition,
  onToggleTeam,
  onSelect,
}: {
  teamPositionsLoading: boolean;
  teamPositionGroups: TeamPositionGroup[] | undefined;
  collapsedTeams: Record<string, boolean>;
  selectedTeam: string | null;
  selectedPosition: string | null;
  onToggleTeam: (teamId: string) => void;
  onSelect: (slot: SlotRef) => void;
}) {
  return (
    <ScrollArea className="min-h-0 flex-1">
      <div className="flex flex-col">
        {teamPositionsLoading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <SidebarMenuSkeleton key={index} />
          ))
        ) : !teamPositionGroups || teamPositionGroups.length === 0 ? (
          <Empty className="py-6">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CalendarDays />
              </EmptyMedia>
              <EmptyTitle>No slots found</EmptyTitle>
              <EmptyDescription>This plan has no team positions yet.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          teamPositionGroups.map((group) => (
            <TeamSlotsCollapsible
              key={group.teamId}
              group={group}
              isCollapsed={!!collapsedTeams[group.teamId]}
              selectedTeam={selectedTeam}
              selectedPosition={selectedPosition}
              onToggle={onToggleTeam}
              onSelect={onSelect}
            />
          ))
        )}
      </div>
    </ScrollArea>
  );
}
