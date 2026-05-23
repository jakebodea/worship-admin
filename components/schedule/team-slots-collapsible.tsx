"use client";

import { ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SlotBadgeCluster } from "@/components/schedule/slot-badge-cluster";
import type { SlotRef } from "@/components/schedule/types";
import type { TeamPosition, TeamPositionGroup } from "@/lib/types";
import { cn } from "@/lib/utils";

export function TeamSlotsCollapsible({
  group,
  isCollapsed,
  selectedTeam,
  selectedPosition,
  onToggle,
  onSelect,
  onPreview,
}: {
  group: TeamPositionGroup;
  isCollapsed: boolean;
  selectedTeam: string | null;
  selectedPosition: string | null;
  onToggle: (teamId: string) => void;
  onSelect: (slot: SlotRef) => void;
  onPreview?: (slot: SlotRef) => void;
}) {
  const openNeededCount = group.positions.reduce(
    (sum, position) => sum + (position.neededCount ?? 1),
    0
  );
  const selectedPositionInGroup =
    group.teamId === selectedTeam
      ? group.positions.find((position) => position.id === selectedPosition) ?? null
      : null;
  const isOpen = !isCollapsed;

  const renderPositionRow = (position: TeamPosition) => {
    const active = group.teamId === selectedTeam && position.id === selectedPosition;
    const slot = {
      teamId: group.teamId,
      teamName: group.teamName,
      positionId: position.id,
      positionName: position.name,
    };
    return (
      <SidebarMenuItem key={position.id}>
        <SidebarMenuButton
          isActive={active}
          onClick={() => onSelect(slot)}
          onMouseEnter={() => onPreview?.(slot)}
          onFocus={() => onPreview?.(slot)}
          className="h-8 rounded-none pl-5 pr-2 transition-none"
        >
          <span className="flex-1 truncate">{position.name}</span>
          <SlotBadgeCluster
            position={position}
            teamName={group.teamName}
            positionName={position.name}
          />
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Collapsible open={isOpen} onOpenChange={() => onToggle(group.teamId)} asChild>
      <SidebarGroup className="border-t border-sidebar-border/40 px-0 py-0 first:border-0">
        <CollapsibleTrigger asChild>
          <SidebarGroupLabel
            asChild
            className="group/team-label h-9 w-full cursor-pointer justify-start gap-2 rounded-none px-2.5 text-left hover:bg-sidebar-accent/50"
          >
            <button type="button">
              <span className="flex-1 truncate text-left text-sm font-semibold">
                {group.teamName}
              </span>
              {openNeededCount > 0 ? (
                <span className="text-[11px] font-medium tabular-nums text-red-600 dark:text-red-400">
                  {openNeededCount}
                </span>
              ) : (
                <span className="size-1.5 rounded-full bg-emerald-500/70" aria-label="All set" />
              )}
              <ChevronDown
                className={cn(
                  "size-3.5 shrink-0 text-muted-foreground transition-transform duration-200 ease-out",
                  isCollapsed && "-rotate-90"
                )}
                aria-hidden
              />
            </button>
          </SidebarGroupLabel>
        </CollapsibleTrigger>

        {!isOpen && selectedPositionInGroup ? (
          <SidebarGroupContent>
            <SidebarMenu className="gap-0">{renderPositionRow(selectedPositionInGroup)}</SidebarMenu>
          </SidebarGroupContent>
        ) : null}

        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0">{group.positions.map(renderPositionRow)}</SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}
