"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Search } from "lucide-react";
import { ScheduleCandidateTile } from "@/components/schedule/schedule-candidate-tile";
import { PositionPickerList } from "@/components/schedule/position-picker-list";
import { SectionLabel } from "@/components/schedule/section-label";
import { SelectedPositionHeader } from "@/components/schedule/selected-position-header";
import { UnselectedPositionEmpty } from "@/components/schedule/unselected-position-empty";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { partitionPeopleForRecommendationStrip } from "@/lib/use-cases/planning-center/people/recommendation-strip-order";
import type { SlotRef } from "@/components/schedule/types";
import type { PersonWithAvailability, TeamPositionGroup } from "@/lib/types";

interface ScheduleViewTabProps {
  teamPositionsLoading: boolean;
  teamPositionGroups: TeamPositionGroup[] | undefined;
  collapsedTeams: Record<string, boolean>;
  selectedTeam: string | null;
  selectedPosition: string | null;
  people: PersonWithAvailability[] | undefined;
  peopleLoading: boolean;
  selectedServiceTypeId: string | null;
  selectedPlanId: string | null;
  onToggleTeam: (teamId: string) => void;
  onSelectSlot: (slot: SlotRef) => void;
  onScheduleSuccess: () => void;
  onScheduleError: (message: string) => void;
}

export function ScheduleViewTab({
  teamPositionsLoading,
  teamPositionGroups,
  collapsedTeams,
  selectedTeam,
  selectedPosition,
  people,
  peopleLoading,
  selectedServiceTypeId,
  selectedPlanId,
  onToggleTeam,
  onSelectSlot,
  onScheduleSuccess,
  onScheduleError,
}: ScheduleViewTabProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [filter, setFilter] = useState("");
  /** Tailwind `lg` — sidebar visible; sheet only below this width. */
  const [isWidePickerLayout, setIsWidePickerLayout] = useState(false);

  useEffect(() => {
    setFilter("");
  }, [selectedTeam, selectedPosition]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => {
      const wide = mq.matches;
      setIsWidePickerLayout(wide);
      if (wide) setPickerOpen(false);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const selectedSlotInfo = useMemo(() => {
    if (!selectedTeam || !selectedPosition || !teamPositionGroups) {
      return null;
    }
    for (const group of teamPositionGroups) {
      if (group.teamId !== selectedTeam) continue;
      const position = group.positions.find((p) => p.id === selectedPosition);
      if (position) {
        return { teamName: group.teamName, positionName: position.name, position };
      }
    }
    return null;
  }, [selectedTeam, selectedPosition, teamPositionGroups]);

  const hasSlots = !!teamPositionGroups && teamPositionGroups.length > 0;

  const handleSelectSlot = (slot: SlotRef) => {
    onSelectSlot(slot);
    if (!isWidePickerLayout) setPickerOpen(false);
  };

  const { actionable, exceptions } = useMemo(
    () => partitionPeopleForRecommendationStrip(people ?? []),
    [people]
  );

  const normalizedFilter = filter.trim().toLowerCase();
  const filteredActionable = useMemo(
    () =>
      normalizedFilter
        ? actionable.filter((person) => person.fullName.toLowerCase().includes(normalizedFilter))
        : actionable,
    [actionable, normalizedFilter]
  );
  const filteredExceptions = useMemo(
    () =>
      normalizedFilter
        ? exceptions.filter((person) => person.fullName.toLowerCase().includes(normalizedFilter))
        : exceptions,
    [exceptions, normalizedFilter]
  );
  const totalShown = filteredActionable.length + filteredExceptions.length;

  const personTileKey = (person: PersonWithAvailability) =>
    [
      person.id,
      selectedServiceTypeId ?? "no-st",
      selectedPlanId ?? "no-plan",
      selectedTeam ?? "no-team",
      selectedPosition ?? "no-position",
    ].join(":");

  const positionPickerList = (
    <PositionPickerList
      teamPositionsLoading={teamPositionsLoading}
      teamPositionGroups={teamPositionGroups}
      collapsedTeams={collapsedTeams}
      selectedTeam={selectedTeam}
      selectedPosition={selectedPosition}
      onToggleTeam={onToggleTeam}
      onSelect={handleSelectSlot}
    />
  );

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col gap-4 lg:h-full lg:flex-row">
      <aside
        className="hidden min-h-0 w-[min(18rem,28vw)] shrink-0 flex-col overflow-hidden rounded-xl border border-sidebar-border/40 bg-sidebar/60 text-sidebar-foreground lg:flex lg:max-h-full lg:self-start"
        aria-label="Positions"
      >
        {positionPickerList}
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-4 lg:h-full">
        {selectedPosition ? (
          <>
            <SelectedPositionHeader
              info={selectedSlotInfo}
              onOpenPicker={() => setPickerOpen(true)}
              hasSlots={hasSlots}
              teamPositionsLoading={teamPositionsLoading}
              filter={filter}
              onFilterChange={setFilter}
            />

            <ScrollArea className="min-h-0 w-full flex-1 lg:h-full">
              {peopleLoading ? (
                <div className="overflow-hidden rounded-2xl border border-border/40 bg-card/30 divide-y divide-border/25 shadow-sm">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 px-3 py-3">
                      <Skeleton className="size-10 shrink-0 rounded-full" />
                      <div className="flex flex-1 flex-col gap-1.5">
                        <Skeleton className="h-3.5 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                      <Skeleton className="hidden h-6 w-24 sm:block" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                  ))}
                </div>
              ) : !people || people.length === 0 ? (
                <Empty className="mx-2 py-10">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <CalendarDays />
                    </EmptyMedia>
                    <EmptyTitle>No one assigned</EmptyTitle>
                  </EmptyHeader>
                </Empty>
              ) : totalShown === 0 ? (
                <Empty className="mx-2 py-10">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <Search />
                    </EmptyMedia>
                    <EmptyTitle>No matches</EmptyTitle>
                  </EmptyHeader>
                </Empty>
              ) : (
                <div className="flex min-h-0 flex-col gap-5 pb-4 pr-2">
                  {filteredActionable.length > 0 ? (
                    <section className="flex flex-col gap-2">
                      <div className="overflow-hidden rounded-xl border border-border/40 bg-card/30 divide-y divide-border/25">
                        {filteredActionable.map((person) => (
                          <ScheduleCandidateTile
                            key={personTileKey(person)}
                            person={person}
                            serviceTypeId={selectedServiceTypeId}
                            planId={selectedPlanId}
                            teamId={selectedTeam}
                            positionId={selectedPosition}
                            onScheduleSuccess={onScheduleSuccess}
                            onScheduleError={onScheduleError}
                          />
                        ))}
                      </div>
                    </section>
                  ) : null}

                  {filteredExceptions.length > 0 ? (
                    <section className="flex flex-col gap-2">
                      <SectionLabel title="Unavailable" count={filteredExceptions.length} />
                      <div className="overflow-hidden rounded-xl border border-border/30 bg-card/20 opacity-80 divide-y divide-border/20">
                        {filteredExceptions.map((person) => (
                          <ScheduleCandidateTile
                            key={personTileKey(person)}
                            person={person}
                            serviceTypeId={selectedServiceTypeId}
                            planId={selectedPlanId}
                            teamId={selectedTeam}
                            positionId={selectedPosition}
                            onScheduleSuccess={onScheduleSuccess}
                            onScheduleError={onScheduleError}
                          />
                        ))}
                      </div>
                    </section>
                  ) : null}
                </div>
              )}
            </ScrollArea>
          </>
        ) : (
          <UnselectedPositionEmpty
            teamPositionGroups={teamPositionGroups}
            hasSlots={hasSlots}
            teamPositionsLoading={teamPositionsLoading}
            onOpenPicker={() => setPickerOpen(true)}
            onSelect={handleSelectSlot}
          />
        )}
      </div>

      <div className="lg:hidden">
        <Sheet open={pickerOpen} onOpenChange={setPickerOpen}>
          <SheetContent
            side="left"
            showCloseButton
            className="flex w-[min(100vw,20rem)] flex-col gap-0 overflow-hidden border-r bg-sidebar p-0 text-sidebar-foreground sm:max-w-[20rem]"
          >
            <SheetHeader className="shrink-0 border-b border-sidebar-border p-4 pr-12">
              <SheetTitle className="text-sm">Positions</SheetTitle>
            </SheetHeader>
            {positionPickerList}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
