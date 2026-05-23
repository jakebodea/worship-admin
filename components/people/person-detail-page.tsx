"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, Sparkles } from "lucide-react";
import { usePeopleDashboardPerson } from "@/hooks/use-people-dashboard-person";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  buildCalendarCells,
  CommitmentEntryText,
  commitmentMarkerClass,
  engagementLabel,
  Metric,
  PersonAvatar,
  pickCalendarMarker,
} from "@/components/people/people-page";
import { cn } from "@/lib/utils";
import type { PeopleDashboardPerson } from "@/lib/use-cases/planning-center/people-dashboard-types";

export function PersonDetailPage({ personId }: { personId: string }) {
  const searchParams = useSearchParams();
  const month = searchParams.get("month");
  const { data, isError, isLoading, isPlaceholderData } = usePeopleDashboardPerson(personId, month);
  const person = data?.person ?? null;
  const monthLabel = data?.month.label ?? "Month";
  const calendarCells = data ? buildCalendarCells(data.month.startsOnWeekday, data.month.daysInMonth) : [];

  return (
    <main className="flex h-full min-h-0 flex-col overflow-hidden bg-background">
      <div className="mx-auto flex w-full max-w-7xl min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-3 py-3 sm:px-4 sm:py-4">
        <header className="flex shrink-0 flex-col gap-3">
          <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              {person ? (
                <>
                  <PersonAvatar person={person} />
                  <div className="min-w-0">
                    <h1 className="truncate text-xl font-semibold tracking-tight md:text-2xl">{person.name}</h1>
                    <p className="truncate text-sm text-muted-foreground">
                      {person.teams.join(", ")} · {person.roles}
                    </p>
                  </div>
                </>
              ) : (
                <div className="min-w-0">
                  <Skeleton className="h-7 w-44" />
                  <Skeleton className="mt-2 h-4 w-72" />
                </div>
              )}
            </div>

            {data ? (
              <div className="flex items-center gap-1">
                <Button asChild variant="outline" size="icon" className="size-8">
                  <Link href={`/people/${personId}?month=${data.previousMonth}`} aria-label="Previous month">
                    <ChevronLeft className="size-4" />
                  </Link>
                </Button>
                <div className="flex h-8 min-w-36 items-center justify-center rounded-md border border-border/40 px-3 text-sm font-medium">
                  {monthLabel}
                </div>
                <Button asChild variant="outline" size="icon" className="size-8">
                  <Link href={`/people/${personId}?month=${data.nextMonth}`} aria-label="Next month">
                    <ChevronRight className="size-4" />
                  </Link>
                </Button>
              </div>
            ) : null}
          </div>
        </header>

        {isError ? (
          <div className="rounded-lg border border-border/40 px-4 py-8 text-sm text-muted-foreground">
            Person details failed to load. Go back and try again.
          </div>
        ) : isLoading || !person || !data ? (
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <Skeleton className="h-[34rem] rounded-lg" />
            <Skeleton className="h-64 rounded-lg" />
          </div>
        ) : (
          <div className="grid gap-3 lg:min-h-0 lg:flex-1 lg:grid-cols-[minmax(0,1fr)_20rem]" aria-busy={isPlaceholderData}>
            <section className="flex flex-col gap-3">
              {isPlaceholderData ? (
                <div className="w-fit rounded-md border border-border/60 bg-background/95 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
                  Refreshing detail...
                </div>
              ) : null}
              <div className="grid gap-2 sm:grid-cols-3">
                <Metric label="Month" value={String(person.monthCount)} />
                <Metric label="30 days" value={String(person.thirtyDayCount)} />
                <Metric label="90 days" value={String(person.ninetyDayCount)} />
              </div>

              <Card className="gap-4 rounded-lg border-border/40 py-4 shadow-none">
                <CardHeader className="gap-1 px-4">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <CalendarDays className="size-4 text-muted-foreground" />
                    {monthLabel} calendar
                  </CardTitle>
                  <CardDescription>Hover a scheduled date to see service, rehearsal, position, and status.</CardDescription>
                </CardHeader>
                <CardContent className="px-4">
                  <PersonMonthCalendar person={person} monthLabel={monthLabel} calendarCells={calendarCells} />
                </CardContent>
              </Card>
            </section>

            <aside className="flex flex-col gap-2">
              <Card className="gap-4 rounded-lg border-border/40 py-4 shadow-none">
                <CardHeader className="gap-1 px-4">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Sparkles className="size-4 text-muted-foreground" />
                    Current signal
                  </CardTitle>
                  <CardAction>
                    <Badge variant="outline">{person.status}</Badge>
                  </CardAction>
                </CardHeader>
                <CardContent className="px-4 text-sm text-muted-foreground">
                  {person.highlight}
                </CardContent>
              </Card>

              <Card className="gap-3 rounded-lg border-border/40 py-3 shadow-none">
                <CardHeader className="gap-1 px-4">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Clock3 className="size-4 text-muted-foreground" />
                    Rotation notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-2 px-4 text-sm text-muted-foreground">
                  <p>
                    Last service: <span className="text-foreground">{person.lastServed}</span>
                  </p>
                  <p>
                    Next service: <span className="text-foreground">{person.nextScheduled}</span>
                  </p>
                  <p>
                    Next rehearsal: <span className="text-foreground">{person.nextRehearsal ?? "Not scheduled"}</span>
                  </p>
                  <p>
                    Upcoming services: <span className="text-foreground">{person.upcomingCount}</span>
                  </p>
                </CardContent>
              </Card>

              <Card className="gap-3 rounded-lg border-border/40 py-3 shadow-none">
                <CardHeader className="gap-1 px-4">
                  <CardTitle className="text-sm">Legend</CardTitle>
                  <CardDescription>Markers use live Planning Center schedule status.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-2 px-4 text-sm">
                  <LegendDot className="bg-emerald-500" label="Confirmed" />
                  <LegendDot className="bg-amber-500" label="Potential" />
                  <LegendDot className="bg-muted-foreground/70" label="Rehearsal" />
                </CardContent>
              </Card>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}

function PersonMonthCalendar({
  person,
  monthLabel,
  calendarCells,
}: {
  person: PeopleDashboardPerson;
  monthLabel: string;
  calendarCells: ReturnType<typeof buildCalendarCells>;
}) {
  return (
    <>
      <div className="grid grid-cols-7 gap-0.5 pb-1.5 text-center text-xs text-muted-foreground">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayName) => (
          <div key={dayName}>{dayName}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {calendarCells.map((cell) => {
          if (cell.day === null) {
            return <div key={cell.key} className="aspect-square min-h-7" />;
          }
          const day = cell.day;
          const entries = person.monthDays.filter((entry) => entry.day === day);
          const marker = pickCalendarMarker(entries);
          const button = (
            <button
              key={cell.key}
              type="button"
              className={cn(
                "relative flex aspect-square min-h-7 items-start justify-start rounded-sm border border-border/40 p-1 text-xs tabular-nums text-muted-foreground hover:bg-muted/60",
                marker && commitmentCellClass(marker.kind, marker.status)
              )}
            >
              {day}
            </button>
          );
          if (!marker) return button;
          return (
            <HoverCard key={cell.key} openDelay={120} closeDelay={120}>
              <HoverCardTrigger asChild>{button}</HoverCardTrigger>
              <HoverCardContent side="top" className="w-72 px-3 py-2">
                <p className="text-xs font-medium">{monthLabel.split(" ")[0]} {day}</p>
                <div className="mt-1 grid gap-1 text-xs text-muted-foreground">
                  {entries.map((entry) => (
                    <div
                      key={`${entry.day}:${entry.kind}:${entry.positionName ?? ""}:${entry.serviceTypeName ?? ""}:${entry.status ?? ""}`}
                      className="flex items-start gap-2"
                    >
                      <span
                        className={cn(
                          "mt-1.5 size-1.5 shrink-0 rounded-full",
                          commitmentMarkerClass(entry.kind, entry.status)
                        )}
                      />
                      <p>
                        <span className="font-medium text-foreground">
                          {engagementLabel(entry.kind, entry.status)}
                        </span>
                        {" · "}
                        <CommitmentEntryText entry={entry} />
                      </p>
                    </div>
                  ))}
                </div>
              </HoverCardContent>
            </HoverCard>
          );
        })}
      </div>
    </>
  );
}

function commitmentCellClass(kind: PeopleDashboardPerson["monthDays"][number]["kind"], status?: string) {
  if (kind === "service") {
    const confirmed = status === "C" || status?.toLowerCase() === "confirmed";
    return confirmed
      ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-950 dark:text-emerald-100"
      : "border-amber-500/35 bg-amber-500/15 text-amber-950 dark:text-amber-100";
  }
  if (kind === "rehearsal") {
    return "border-muted-foreground/20 bg-muted text-foreground";
  }
  return "bg-muted text-foreground";
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={cn("size-2 rounded-full", className)} />
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}
