// Planning Center API Client
import type { PCApiResponse, PCResource } from "./types";

const PC_BASE_URL = "https://api.planningcenteronline.com";

class PlanningCenterClient {
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
    params: Record<string, string> = {}
  ): Promise<{ data: PCResource[]; included: PCResource[] }> {
    // Build URL with include parameter
    const url = this.buildUrl(
      `/services/v2/people/${personId}/plan_people`,
      { ...params, include: "plan,plan.service_type" }
    );
    
    const response = await this.fetch<PCResource[]>(url);
    
    return {
      data: Array.isArray(response.data) ? response.data : [response.data],
      included: response.included || [],
    };
  }

  // Get people for a specific team position
  async getPeopleForPosition(
    teamId: string,
    positionId: string
  ): Promise<{ data: PCResource[]; included: PCResource[] }> {
    // Try with include parameter - the endpoint returns PersonTeamPositionAssignment resources
    // and we want to include the related Person resources
    const response = await this.fetch<PCResource[]>(
      `/services/v2/teams/${teamId}/team_positions/${positionId}/people?include=person`
    );
    
    return {
      data: Array.isArray(response.data) ? response.data : [response.data],
      included: response.included || [],
    };
  }
  
  // Alternative: Get people for a team position by fetching assignments and then persons
  async getPeopleForTeamPositionWithPersons(
    teamId: string,
    positionId: string
  ): Promise<{ assignments: PCResource[]; persons: PCResource[] }> {
    // First get the assignments
    const assignmentsResponse = await this.fetch<PCResource[]>(
      `/services/v2/teams/${teamId}/team_positions/${positionId}/people`
    );
    
    const assignments = Array.isArray(assignmentsResponse.data) 
      ? assignmentsResponse.data 
      : [assignmentsResponse.data];
    
    // Extract person IDs from assignments
    const personIds = new Set<string>();
    assignments.forEach((assignment) => {
      const personRel = assignment.relationships?.person?.data;
      if (personRel) {
        const personId = Array.isArray(personRel) ? personRel[0]?.id : personRel.id;
        if (personId) {
          personIds.add(personId);
        }
      }
    });
    
    // Fetch person data for each ID (batch if possible, or individual)
    // For now, we'll return assignments and let the caller handle person fetching
    // Or we could fetch persons here, but that adds API calls
    
    return {
      assignments,
      persons: assignmentsResponse.included?.filter(item => item.type === "Person") || [],
    };
  }

  // Alias for consistency (same as getPeopleForPosition)
  async getPeopleForTeamPosition(
    teamId: string,
    positionId: string
  ): Promise<{ data: PCResource[]; included: PCResource[] }> {
    return this.getPeopleForPosition(teamId, positionId);
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
    // Build URL with order parameter and merge with other params
    const url = this.buildUrl(
      `/services/v2/service_types/${serviceTypeId}/plans`,
      { ...params, order: "-sort_date", per_page: "25" }
    );
    
    const response = await this.fetch<PCResource[]>(url);
    const data = Array.isArray(response.data) ? response.data : [response.data];
    
    return data;
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
