import { planningCenterCatalogService } from "@/lib/planning-center/services/catalog-service";
import type { Team, RawTeam } from "@/lib/types";

export async function getTeams(): Promise<Team[]> {
  const rawTeams = await planningCenterCatalogService.getTeams();
  const teams: Team[] = rawTeams
    .filter((rawTeam) => !(rawTeam.attributes.archived_at as string | null))
    .map((rawTeam) => {
      const team = rawTeam as unknown as RawTeam;
      return {
        id: team.id,
        name: team.attributes.name,
        sequence: team.attributes.sequence,
        rehearsalTeam: team.attributes.rehearsal_team,
      };
    });

  teams.sort((a, b) => a.sequence - b.sequence);
  return teams;
}
