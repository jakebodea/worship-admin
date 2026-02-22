import type { PCResource } from "@/lib/types";
import { PlanningCenterCoreClient } from "@/lib/planning-center/core-client";

export class PlanningCenterPeopleService {
  constructor(private readonly core: PlanningCenterCoreClient) {}

  async getPeopleFromTeam(teamId: string): Promise<PCResource[]> {
    return this.core.fetchAll<PCResource>(`/services/v2/teams/${teamId}/people?include=person`);
  }

  async getPersonTeamPositions(personId: string): Promise<PCResource[]> {
    return this.core.fetchAll<PCResource>(
      `/services/v2/people/${personId}/person_team_position_assignments?include=team_position`
    );
  }

  async getAllPeopleFromTeams(): Promise<{ people: PCResource[]; included: PCResource[] }> {
    const teams = await this.core.fetchAll<PCResource>("/services/v2/teams");
    const activeTeams = teams.filter(
      (team) => !(team.attributes.archived_at as string | null | undefined)
    );

    const allPeople: PCResource[] = [];
    const allIncluded: PCResource[] = [];
    const seenIds = new Set<string>();
    const teamBatch = activeTeams.slice(0, 10);

    for (const team of teamBatch) {
      try {
        const response = await this.core.fetch<PCResource[]>(
          `/services/v2/teams/${team.id}/people?include=person`
        );

        const people = Array.isArray(response.data) ? response.data : [response.data];
        const included = response.included || [];

        for (const person of people) {
          let personResource: PCResource | null = null;

          if (person.type === "Person") {
            personResource = person;
          } else if (person.relationships?.person?.data) {
            const personData = person.relationships.person.data;
            const personId = Array.isArray(personData)
              ? personData[0]?.id
              : personData?.id;

            if (personId) {
              personResource =
                included.find((p) => p.type === "Person" && p.id === personId) || null;
            }
          }

          if (personResource && !seenIds.has(personResource.id)) {
            seenIds.add(personResource.id);
            allPeople.push(personResource);
          }
        }

        allIncluded.push(...included);
      } catch {
        // Skip teams with partial-access or transient API failures.
      }
    }

    return { people: allPeople, included: allIncluded };
  }

  async getPersonBlockouts(
    personId: string,
    params: Record<string, string> = {}
  ): Promise<PCResource[]> {
    return this.core.fetchAll<PCResource>(
      `/services/v2/people/${personId}/blockouts`,
      params
    );
  }

  async getPersonPlanPeople(
    personId: string,
    params: Record<string, string> = {}
  ): Promise<PCResource[]> {
    return this.core.fetchAll<PCResource>(
      `/services/v2/people/${personId}/plan_people`,
      params
    );
  }

  async getPersonPlanPeopleWithPlans(
    personId: string,
    params: Record<string, string> = {},
    maxPages: number = 2
  ): Promise<{ data: PCResource[]; included: PCResource[] }> {
    const response = await this.core.fetchAllWithIncluded<PCResource>(
      `/services/v2/people/${personId}/plan_people`,
      { ...params, include: "plan,team" },
      maxPages
    );

    return {
      data: response.data,
      included: response.included || [],
    };
  }

  async getPeopleForTeamPosition(
    serviceTypeId: string,
    positionId: string
  ): Promise<{ data: PCResource[]; included: PCResource[] }> {
    const response = await this.core.fetch<PCResource[]>(
      `/services/v2/service_types/${serviceTypeId}/team_positions/${positionId}/person_team_position_assignments?include=person,team_position`
    );

    return {
      data: Array.isArray(response.data) ? response.data : [response.data],
      included: response.included || [],
    };
  }

  async getPersonTeamPositionAssignments(
    personId: string
  ): Promise<{ data: PCResource[]; included: PCResource[] }> {
    const response = await this.core.fetch<PCResource[]>(
      `/services/v2/people/${personId}/person_team_position_assignments?include=team_position,team_position.team`
    );

    return {
      data: Array.isArray(response.data) ? response.data : [response.data],
      included: response.included || [],
    };
  }
}

export const planningCenterPeopleService = new PlanningCenterPeopleService(
  new PlanningCenterCoreClient()
);
