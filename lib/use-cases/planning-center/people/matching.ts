import type { PersonWithAvailability, RawPlanPerson } from "@/lib/types";
import type { SelectedPlanMatchContext } from "@/lib/use-cases/planning-center/people/types";

export function findMatchingPlanPersonForSelectedPosition(
  planPeople: RawPlanPerson[],
  context: SelectedPlanMatchContext
): RawPlanPerson | undefined {
  const { planId, teamId, selectedPositionName, selectedTeamName } = context;
  if (!planId || !selectedPositionName) return undefined;

  return planPeople.find((pp) => {
    const ppPlanRel = pp.relationships?.plan?.data;
    const ppPlanId = Array.isArray(ppPlanRel) ? ppPlanRel[0]?.id : ppPlanRel?.id;
    if (ppPlanId !== planId) return false;

    if (teamId) {
      const ppTeamRel = pp.relationships?.team?.data;
      const ppTeamId = Array.isArray(ppTeamRel) ? ppTeamRel[0]?.id : ppTeamRel?.id;
      if (ppTeamId && ppTeamId !== teamId) return false;
    }

    const teamPositionName = (pp.attributes.team_position_name as string) || "";
    if (teamPositionName.includes(" - ")) {
      const parts = teamPositionName.split(" - ");
      const ppTeamName = parts[0];
      const ppPositionName = parts.slice(1).join(" - ");
      if (selectedTeamName && ppTeamName !== selectedTeamName) return false;
      return ppPositionName === selectedPositionName;
    }

    return teamPositionName === selectedPositionName;
  });
}

export function applySelectedPlanStatus(
  person: PersonWithAvailability,
  matchedPlanPerson?: RawPlanPerson
) {
  if (!matchedPlanPerson) return;

  person.isScheduledForSelectedPlanPosition = true;
  const status = (matchedPlanPerson.attributes.status as string | undefined) || "";
  person.isConfirmedForSelectedPlanPosition =
    status === "C" || status.toLowerCase() === "confirmed";
  person.scheduledPlanPersonId = matchedPlanPerson.id;
}

