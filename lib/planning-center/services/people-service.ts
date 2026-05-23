import type { PCResource } from "@/lib/types";
import { PlanningCenterCoreClient } from "@/lib/planning-center/core-client";
import { PlanningCenterReadCache, stableParams } from "@/lib/planning-center/services/read-cache";

const ASSIGNMENTS_CACHE_TTL_MS = 5 * 60 * 1000;
const PERSON_READ_CACHE_TTL_MS = 60 * 1000;
const PLAN_TEAM_MEMBERS_CACHE_TTL_MS = 30 * 1000;
const PLAN_TIMES_CACHE_TTL_MS = 5 * 60 * 1000;

export class PlanningCenterPeopleService {
  private readonly cache = new PlanningCenterReadCache();

  constructor(private readonly core: PlanningCenterCoreClient) {}

  async getPeopleFromTeam(teamId: string): Promise<PCResource[]> {
    return this.core.fetchAll<PCResource>(`/services/v2/teams/${teamId}/people?include=person`);
  }

  async getPerson(personId: string): Promise<PCResource> {
    return this.cache.get(
      this.buildCacheKey("person", personId),
      PERSON_READ_CACHE_TTL_MS,
      async () => {
        const response = await this.core.fetch<PCResource>(`/services/v2/people/${personId}`);
        return response.data;
      }
    );
  }

  async getPersonTeamPositions(personId: string): Promise<PCResource[]> {
    return this.core.fetchAll<PCResource>(
      `/services/v2/people/${personId}/person_team_position_assignments?include=team_position`
    );
  }

  async getAllPeopleFromTeams(): Promise<{
    people: PCResource[];
    included: PCResource[];
    teamNamesByPersonId: Map<string, Set<string>>;
  }> {
    const teams = await this.core.fetchAll<PCResource>("/services/v2/teams");
    const activeTeams = teams.filter(
      (team) => !(team.attributes.archived_at as string | null | undefined)
    );

    const allPeople: PCResource[] = [];
    const allIncluded: PCResource[] = [];
    const teamNamesByPersonId = new Map<string, Set<string>>();
    const seenIds = new Set<string>();

    for (const team of activeTeams) {
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

          if (personResource) {
            const teamName = team.attributes.name;
            if (typeof teamName === "string" && teamName.trim()) {
              if (!teamNamesByPersonId.has(personResource.id)) {
                teamNamesByPersonId.set(personResource.id, new Set());
              }
              teamNamesByPersonId.get(personResource.id)!.add(teamName);
            }
          }
        }

        allIncluded.push(...included);
      } catch {
        // Skip teams with partial-access or transient API failures.
      }
    }

    return { people: allPeople, included: allIncluded, teamNamesByPersonId };
  }

  async getPersonBlockouts(
    personId: string,
    params: Record<string, string> = {}
  ): Promise<PCResource[]> {
    return this.cache.get(
      this.buildCacheKey("person-blockouts", personId, stableParams(params)),
      PERSON_READ_CACHE_TTL_MS,
      () =>
        this.core.fetchAll<PCResource>(
          `/services/v2/people/${personId}/blockouts`,
          params
        )
    );
  }

  async getPersonSchedules(
    personId: string,
    params: Record<string, string> = {},
    maxPages: number = 2
  ): Promise<{ data: PCResource[]; included: PCResource[] }> {
    return this.cache.get(
      this.buildCacheKey("person-schedules", personId, stableParams(params), String(maxPages)),
      PERSON_READ_CACHE_TTL_MS,
      async () => {
        const response = await this.core.fetchAllWithIncluded<PCResource>(
          `/services/v2/people/${personId}/schedules`,
          { include: "plan_times", ...params },
          maxPages
        );

        const data = response.data;
        const included = response.included || [];
        const enrichedIncluded = await this.enrichSchedulesWithRehearsalTimes(data, included);

        return {
          data,
          included: enrichedIncluded,
        };
      }
    );
  }

  /**
   * `include=plan_times` only sideloads service-typed PlanTimes. Rehearsal PlanTime IDs are
   * listed in `schedule.relationships.times` but their resources aren't included. Fetch them
   * per-plan and merge into `included` so downstream history processing can classify them.
   */
  private async enrichSchedulesWithRehearsalTimes(
    schedules: PCResource[],
    included: PCResource[]
  ): Promise<PCResource[]> {
    const sideloadedPlanTimeIds = new Set(
      included.filter((r) => r.type === "PlanTime").map((r) => r.id)
    );

    const missingByPlan = new Map<string, Set<string>>();
    for (const schedule of schedules) {
      const planRel = schedule.relationships?.plan?.data as { id?: string } | undefined;
      const planId = planRel?.id;
      if (!planId) continue;
      const timesRel = (schedule.relationships?.times?.data ?? []) as { id?: string }[];
      for (const t of timesRel) {
        if (!t.id || sideloadedPlanTimeIds.has(t.id)) continue;
        if (!missingByPlan.has(planId)) missingByPlan.set(planId, new Set());
        missingByPlan.get(planId)!.add(t.id);
      }
    }

    if (missingByPlan.size === 0) return included;

    const fetched = await Promise.all(
      [...missingByPlan.entries()].map(async ([planId, idSet]) => {
        const planTimes = await this.getPlanPlanTimes(planId);
        return planTimes.filter((pt) => idSet.has(pt.id));
      })
    );

    return [...included, ...fetched.flat()];
  }

  /**
   * Cached fetch of all PlanTimes for a plan. Shared across candidates so a position page with
   * 30 candidates serving on the same Sunday plan triggers one fetch, not 30. PlanTimes rarely
   * change, so the TTL is longer than per-person caches.
   */
  async getPlanPlanTimes(planId: string): Promise<PCResource[]> {
    return this.cache.get(
      this.buildCacheKey("plan-plan-times", planId),
      PLAN_TIMES_CACHE_TTL_MS,
      async () => {
        try {
          return await this.core.fetchAll<PCResource>(
            `/services/v2/plans/${planId}/plan_times`,
            { per_page: "200" }
          );
        } catch {
          return [];
        }
      }
    );
  }

  async getPeopleForTeamPosition(
    serviceTypeId: string,
    positionId: string
  ): Promise<{ data: PCResource[]; included: PCResource[] }> {
    return this.cache.get(
      this.buildCacheKey("team-position-assignments", serviceTypeId, positionId),
      ASSIGNMENTS_CACHE_TTL_MS,
      async () => {
        const response = await this.core.fetchAllWithIncluded<PCResource>(
          `/services/v2/service_types/${serviceTypeId}/team_positions/${positionId}/person_team_position_assignments`,
          { include: "person,team_position" },
          10
        );

        return {
          data: response.data,
          included: response.included || [],
        };
      }
    );
  }

  async getPlanTeamMembers(
    serviceTypeId: string,
    planId: string
  ): Promise<{ data: PCResource[]; included: PCResource[] }> {
    return this.cache.get(
      this.buildCacheKey("plan-team-members", serviceTypeId, planId),
      PLAN_TEAM_MEMBERS_CACHE_TTL_MS,
      async () => {
        const response = await this.core.fetchAllWithIncluded<PCResource>(
          `/services/v2/service_types/${serviceTypeId}/plans/${planId}/team_members`,
          { include: "person,team,plan", per_page: "100" },
          25
        );

        return {
          data: response.data,
          included: response.included || [],
        };
      }
    );
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

  async updatePlanPersonStatus(
    planPersonId: string,
    status: "C" | "U" | "D"
  ): Promise<PCResource> {
    const response = await this.core.fetch<PCResource>(
      `/services/v2/plan_people/${planPersonId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            type: "PlanPerson",
            id: planPersonId,
            attributes: {
              status,
            },
          },
        }),
      }
    );
    return response.data;
  }

  async deletePlanPerson(
    planPersonId: string,
    context?: { personId?: string; serviceTypeId?: string; planId?: string }
  ): Promise<void> {
    const endpoint =
      context?.serviceTypeId && context.planId
        ? `/services/v2/service_types/${context.serviceTypeId}/plans/${context.planId}/team_members/${planPersonId}`
        : context?.personId
          ? `/services/v2/people/${context.personId}/plan_people/${planPersonId}`
          : `/services/v2/plan_people/${planPersonId}`;

    await this.core.request(endpoint, {
      method: "DELETE",
    });
    if (context?.serviceTypeId && context.planId) {
      this.invalidateScheduleCaches({
        personId: context.personId,
        serviceTypeId: context.serviceTypeId,
        planId: context.planId,
      });
    }
  }

  /**
   * Schedule a person to a plan for a team. Creates a PlanPerson in Planning Center Services.
   */
  async createPlanPerson(
    serviceTypeId: string,
    personId: string,
    planId: string,
    teamId: string,
    teamPositionName: string
  ): Promise<PCResource> {
    const response = await this.core.fetch<PCResource>(
      `/services/v2/service_types/${serviceTypeId}/plans/${planId}/team_members`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            type: "PlanPerson",
            attributes: {
              status: "U",
              person_id: personId,
              team_id: teamId,
              team_position_name: teamPositionName,
            },
          },
        }),
      }
    );
    this.invalidateScheduleCaches({ personId, serviceTypeId, planId });
    return response.data;
  }

  private buildCacheKey(namespace: string, ...parts: string[]): string {
    return [
      this.core.getCacheScope(),
      namespace,
      ...parts.map((part) => encodeURIComponent(part)),
    ].join(":");
  }

  getCacheScope(): string {
    return this.core.getCacheScope();
  }

  private invalidateScheduleCaches({
    personId,
    serviceTypeId,
    planId,
  }: {
    personId?: string;
    serviceTypeId: string;
    planId: string;
  }) {
    const scope = this.core.getCacheScope();
    const personSchedulesPrefix = personId
      ? [
          scope,
          "person-schedules",
          encodeURIComponent(personId),
          "",
        ].join(":")
      : null;
    const planTeamMembersKey = this.buildCacheKey(
      "plan-team-members",
      serviceTypeId,
      planId
    );

    this.cache.deleteWhere((key) => {
      return (
        (personSchedulesPrefix ? key.startsWith(personSchedulesPrefix) : false) ||
        key === planTeamMembersKey
      );
    });
  }
}

export const planningCenterPeopleService = new PlanningCenterPeopleService(
  new PlanningCenterCoreClient()
);
