"use client";

import { useState, useMemo } from "react";
import { PersonCard } from "@/components/person-card";
import { TeamFilter } from "@/components/team-filter";
import { DateRangePicker } from "@/components/date-range-picker";
import { Skeleton } from "@/components/ui/skeleton";
import { usePeople } from "@/hooks/use-people";
import { useTeams } from "@/hooks/use-teams";

export default function DashboardPage() {
  const [selectedTeam, setSelectedTeam] = useState("all");
  const [checkDate, setCheckDate] = useState(new Date());

  const { data: people, isLoading: peopleLoading } = usePeople();
  const { data: teams, isLoading: teamsLoading } = useTeams();

  const filteredPeople = useMemo(() => {
    if (!people) return [];
    
    if (selectedTeam === "all") {
      return people;
    }

    return people.filter((person) =>
      person.positions.some((pos) => pos.teamId === selectedTeam)
    );
  }, [people, selectedTeam]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Worship Team Scheduler
          </h1>
          <p className="text-muted-foreground">
            View team member availability and scheduling frequency
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            {teamsLoading ? (
              <Skeleton className="h-10 w-[200px]" />
            ) : (
              <TeamFilter
                teams={teams || []}
                selectedTeam={selectedTeam}
                onTeamChange={setSelectedTeam}
              />
            )}
          </div>
          <DateRangePicker date={checkDate} onDateChange={setCheckDate} />
        </div>

        {peopleLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        ) : filteredPeople.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No team members found. Make sure your Planning Center credentials
              are configured correctly.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-muted-foreground">
              Showing {filteredPeople.length}{" "}
              {filteredPeople.length === 1 ? "person" : "people"}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredPeople.map((person) => (
                <PersonCard
                  key={person.id}
                  person={person}
                  checkDate={checkDate}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
