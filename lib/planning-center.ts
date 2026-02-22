// Planning Center API Client
import { logger } from "./logger";
import type { PCApiResponse, PCResource } from "./types";

const PC_BASE_URL = "https://api.planningcenteronline.com";
const log = logger.for("planning-center");

class PlanningCenterClient {
  private serviceTypesCache: { expiresAt: number; data: PCResource[] } | null =
    null;

  private getClientId(): string {
    const id = process.env.PLANNING_CENTER_CLIENT;
    if (!id) {
      throw new Error(
        "Missing PLANNING_CENTER_CLIENT environment variable"
      );
    }
    return id;
  }

  private getPat(): string {
    const pat = process.env.PLANNING_CENTER_PAT;
    if (!pat) {
      throw new Error(
        "Missing PLANNING_CENTER_PAT environment variable"
      );
    }
    return pat;
  }

  private getAuthHeader(): string {
    const credentials = Buffer.from(
      `${this.getClientId()}:${this.getPat()}`
    ).toString("base64");
    return `Basic ${credentials}`;
  }

  private async fetch<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<PCApiResponse<T>> {
    const url = endpoint.startsWith("http")
      ? endpoint
      : `${PC_BASE_URL}${endpoint}`;

    const authHeader = this.getAuthHeader();

    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: authHeader,
        Accept: "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Planning Center API error: ${response.status}`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage += ` - ${JSON.stringify(errorJson)}`;
      } catch {
        errorMessage += ` - ${errorText}`;
      }
      log.error(
        { status: response.status, url, errorText: errorText.slice(0, 500) },
        "Planning Center API error"
      );
      throw new Error(errorMessage);
    }

    return response.json();
  }

  // Fetch all pages of a paginated endpoint
  async fetchAll<T>(
    endpoint: string,
    params: Record<string, string> = {},
    maxPages: number = 10
  ): Promise<T[]> {
    const allData: T[] = [];
    let url = this.buildUrl(endpoint, { ...params, per_page: "100" });
    let hasMore = true;
    let pageCount = 0;

    while (hasMore && pageCount < maxPages) {
      pageCount++;
      const response = await this.fetch<T[] | T>(url);
      const data = Array.isArray(response.data)
        ? response.data
        : [response.data];
      allData.push(...data);

      // Check for next page
      const nextUrl = response.links?.next;
      if (nextUrl && nextUrl !== url) {
        url = nextUrl;
      } else {
        hasMore = false;
      }
    }

    return allData;
  }

  // Fetch all pages of a paginated endpoint including included resources
  async fetchAllWithIncluded<T>(
    endpoint: string,
    params: Record<string, string> = {},
    maxPages: number = 5
  ): Promise<{ data: T[]; included: PCResource[] }> {
    const allData: T[] = [];
    const allIncluded: PCResource[] = [];
    const seenIncluded = new Set<string>();
    let url = this.buildUrl(endpoint, { ...params, per_page: "100" });
    let hasMore = true;
    let pageCount = 0;

    while (hasMore && pageCount < maxPages) {
      pageCount++;
      const response = await this.fetch<T[] | T>(url);
      const data = Array.isArray(response.data)
        ? response.data
        : [response.data];
      allData.push(...data);

      for (const resource of response.included || []) {
        const key = `${resource.type}:${resource.id}`;
        if (!seenIncluded.has(key)) {
          seenIncluded.add(key);
          allIncluded.push(resource);
        }
      }

      const nextUrl = response.links?.next;
      if (nextUrl && nextUrl !== url) {
        url = nextUrl;
      } else {
        hasMore = false;
      }
    }

    return { data: allData, included: allIncluded };
  }

  private buildUrl(
    endpoint: string,
    params: Record<string, string> = {}
  ): string {
    const url = new URL(endpoint, PC_BASE_URL);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    return url.toString();
  }

  // People endpoints - get people through teams
  async getPeopleFromTeam(teamId: string): Promise<PCResource[]> {
    return this.fetchAll<PCResource>(
      `/services/v2/teams/${teamId}/people?include=person`
    );
  }

  async getPersonTeamPositions(personId: string): Promise<PCResource[]> {
    return this.fetchAll<PCResource>(
      `/services/v2/people/${personId}/person_team_position_assignments?include=team_position`
    );
  }

  // Get all people across all teams - optimized to reduce API calls
  async getAllPeopleFromTeams(): Promise<{ people: PCResource[]; included: PCResource[] }> {
    const teams = await this.getTeams({ "filter[archived]": "false" });
    const allPeople: PCResource[] = [];
    const allIncluded: PCResource[] = [];
    const seenIds = new Set<string>();

    // Get people from each team (limit to avoid rate limits)
    const teamBatch = teams.slice(0, 10); // Process max 10 teams at a time
    
    for (const team of teamBatch) {
      try {
        const response = await this.fetch<PCResource[]>(
          `/services/v2/teams/${team.id}/people?include=person`
        );
        
        const people = Array.isArray(response.data) ? response.data : [response.data];
        const included = response.included || [];
        
        for (const person of people) {
          // Extract person from included or relationships
          let personResource: PCResource | null = null;
          
          if (person.type === "Person") {
            personResource = person;
          } else if (person.relationships?.person?.data) {
            const personData = person.relationships.person.data;
            const personId = Array.isArray(personData) 
              ? personData[0]?.id 
              : personData?.id;
            
            if (personId) {
              personResource = included.find(
                (p) => p.type === "Person" && p.id === personId
              ) || null;
            }
          }
          
          if (personResource && !seenIds.has(personResource.id)) {
            seenIds.add(personResource.id);
            allPeople.push(personResource);
          }
        }
        
        // Collect all included resources
        allIncluded.push(...included);
      } catch {
        // Skip teams that don't have people endpoint or have errors
      }
    }

    return { people: allPeople, included: allIncluded };
  }

  async getPersonBlockouts(
    personId: string,
    params: Record<string, string> = {}
  ): Promise<PCResource[]> {
    return this.fetchAll<PCResource>(
      `/services/v2/people/${personId}/blockouts`,
      params
    );
  }

  async getPersonPlanPeople(
    personId: string,
    params: Record<string, string> = {}
  ): Promise<PCResource[]> {
    return this.fetchAll<PCResource>(
      `/services/v2/people/${personId}/plan_people`,
      params
    );
  }

  // Get plan people with plan details included (for service history)
  async getPersonPlanPeopleWithPlans(
    personId: string,
    params: Record<string, string> = {},
    maxPages: number = 2
  ): Promise<{ data: PCResource[]; included: PCResource[] }> {
    const response = await this.fetchAllWithIncluded<PCResource>(
      `/services/v2/people/${personId}/plan_people`,
      { ...params, include: "plan,team" },
      maxPages
    );

    return {
      data: response.data,
      included: response.included || [],
    };
  }

  // Get person assignments for a specific position using documented resource path
  async getPeopleForTeamPosition(
    serviceTypeId: string,
    positionId: string
  ): Promise<{ data: PCResource[]; included: PCResource[] }> {
    const response = await this.fetch<PCResource[]>(
      `/services/v2/service_types/${serviceTypeId}/team_positions/${positionId}/person_team_position_assignments?include=person,team_position`
    );

    return {
      data: Array.isArray(response.data) ? response.data : [response.data],
      included: response.included || [],
    };
  }

  // Get team positions for a person
  async getPersonTeamPositionAssignments(
    personId: string
  ): Promise<{ data: PCResource[]; included: PCResource[] }> {
    const response = await this.fetch<PCResource[]>(
      `/services/v2/people/${personId}/person_team_position_assignments?include=team_position,team_position.team`
    );
    
    return {
      data: Array.isArray(response.data) ? response.data : [response.data],
      included: response.included || [],
    };
  }

  // Teams endpoints
  async getTeams(params: Record<string, string> = {}): Promise<PCResource[]> {
    return this.fetchAll<PCResource>("/services/v2/teams", params);
  }

  async getTeam(teamId: string): Promise<PCResource> {
    const response = await this.fetch<PCResource>(
      `/services/v2/teams/${teamId}`
    );
    return response.data;
  }

  // Service Types endpoints
  async getServiceTypes(
    params: Record<string, string> = {}
  ): Promise<PCResource[]> {
    return this.fetchAll<PCResource>("/services/v2/service_types", params);
  }

  async getServiceTypesCached(
    ttlMs: number = 5 * 60 * 1000
  ): Promise<PCResource[]> {
    const now = Date.now();
    if (this.serviceTypesCache && this.serviceTypesCache.expiresAt > now) {
      log.debug({ count: this.serviceTypesCache.data.length }, "Service types cache hit");
      return this.serviceTypesCache.data;
    }

    log.info("Fetching service types (cache miss)");
    const data = await this.getServiceTypes();
    this.serviceTypesCache = {
      expiresAt: now + ttlMs,
      data,
    };
    log.info({ count: data.length }, "Service types cached");
    return data;
  }

  async getServiceTypeTeamPositions(
    serviceTypeId: string
  ): Promise<PCResource[]> {
    return this.fetchAll<PCResource>(
      `/services/v2/service_types/${serviceTypeId}/team_positions?include=team`
    );
  }

  // Get team positions for a service type with included team data
  async getServiceTypeTeamPositionsWithTeams(
    serviceTypeId: string
  ): Promise<{ data: PCResource[]; included: PCResource[] }> {
    const response = await this.fetch<PCResource[]>(
      `/services/v2/service_types/${serviceTypeId}/team_positions?include=team`
    );
    
    return {
      data: Array.isArray(response.data) ? response.data : [response.data],
      included: response.included || [],
    };
  }

  // Plans endpoints
  async getPlans(
    serviceTypeId: string,
    params: Record<string, string> = {}
  ): Promise<PCResource[]> {
    return this.fetchAll<PCResource>(
      `/services/v2/service_types/${serviceTypeId}/plans`,
      { ...params, order: "-sort_date" },
      3
    );
  }

  // Fetch plans near a reference date with adaptive paging.
  // Stops early once we have enough past and future plans.
  async getPlansNearDate(
    serviceTypeId: string,
    referenceDate: Date,
    pastTarget: number = 5,
    futureTarget: number = 5,
    maxPages: number = 3
  ): Promise<PCResource[]> {
    const allPlans: PCResource[] = [];
    let url = this.buildUrl(`/services/v2/service_types/${serviceTypeId}/plans`, {
      order: "-sort_date",
      per_page: "100",
    });
    let pageCount = 0;
    let hasMore = true;

    const todayStart = new Date(referenceDate);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(referenceDate);
    todayEnd.setHours(23, 59, 59, 999);

    while (hasMore && pageCount < maxPages) {
      pageCount++;
      const response = await this.fetch<PCResource[] | PCResource>(url);
      const pageData = Array.isArray(response.data)
        ? response.data
        : [response.data];
      allPlans.push(...pageData);

      let pastCount = 0;
      let futureCount = 0;
      for (const plan of allPlans) {
        const sortDateRaw = plan.attributes.sort_date as string | undefined;
        if (!sortDateRaw) continue;
        const sortDate = new Date(sortDateRaw);
        if (isNaN(sortDate.getTime())) continue;

        if (sortDate < todayStart) pastCount++;
        else if (sortDate > todayEnd) futureCount++;
      }

      if (pastCount >= pastTarget && futureCount >= futureTarget) {
        break;
      }

      const nextUrl = response.links?.next;
      if (nextUrl && nextUrl !== url) {
        url = nextUrl;
      } else {
        hasMore = false;
      }
    }

    return allPlans;
  }

  async getPlan(planId: string): Promise<PCResource> {
    const response = await this.fetch<PCResource>(
      `/services/v2/plans/${planId}`
    );
    return response.data;
  }
}

// Export a singleton instance
export const pcClient = new PlanningCenterClient();

// Export utility functions for transforming raw API data
export function findIncluded(
  included: PCResource[] | undefined,
  type: string,
  id: string
): PCResource | undefined {
  return included?.find((item) => item.type === type && item.id === id);
}

export function findAllIncluded(
  included: PCResource[] | undefined,
  type: string
): PCResource[] {
  return included?.filter((item) => item.type === type) || [];
}
