import type { PersonWithAvailability, RawPlanPerson, RawSchedule } from "@/lib/types";
import type { SelectedPlanMatchContext } from "@/lib/use-cases/planning-center/people/types";

type SchedulableRecord = RawSchedule | RawPlanPerson;

export function findMatchingScheduleForSelectedPosition<T extends SchedulableRecord>(
  schedules: T[],
  context: SelectedPlanMatchContext
): T | undefined {
  const { planId, teamId, selectedPositionName, selectedTeamName } = context;
  if (!planId || !selectedPositionName) return undefined;

  return schedules.find((schedule) => {
    const planRel = schedule.relationships?.plan?.data;
    const schedulePlanId = Array.isArray(planRel) ? planRel[0]?.id : planRel?.id;
    if (schedulePlanId !== planId) return false;

    if (teamId) {
      const teamRel = schedule.relationships?.team?.data;
      const scheduleTeamId = Array.isArray(teamRel) ? teamRel[0]?.id : teamRel?.id;
      if (scheduleTeamId && scheduleTeamId !== teamId) return false;
    }

    const teamPositionName =
      (schedule.attributes.team_position_name as string | undefined) || "";

    if (teamPositionName.includes(" - ")) {
      const parts = teamPositionName.split(" - ");
      const scheduleTeamName = parts[0];
      const schedulePositionName = parts.slice(1).join(" - ");
      if (selectedTeamName && scheduleTeamName !== selectedTeamName) return false;
      return schedulePositionName === selectedPositionName;
    }

    return teamPositionName === selectedPositionName;
  });
}

export function applySelectedPlanStatus(
  person: PersonWithAvailability,
  matchedSchedule?: SchedulableRecord
) {
  if (!matchedSchedule) return;

  person.isScheduledForSelectedPlanPosition = true;
  const status = (matchedSchedule.attributes.status as string | undefined) || "";
  const normalizedStatus = status.toLowerCase();
  person.isConfirmedForSelectedPlanPosition =
    status === "C" || normalizedStatus === "confirmed";
  person.isDeclinedForSelectedPlanPosition =
    status === "D" || normalizedStatus === "declined";

  const planPersonRel = (matchedSchedule.relationships as { plan_person?: { data?: { id: string } | { id: string }[] | null } } | undefined)
    ?.plan_person?.data;
  const planPersonId = Array.isArray(planPersonRel)
    ? planPersonRel[0]?.id
    : planPersonRel?.id;
  person.scheduledPlanPersonId = planPersonId || matchedSchedule.id;
}
