import { beforeEach, describe, expect, it, vi } from "vitest";
import { getNeededTeamPositionsForPlan } from "@/lib/use-cases/planning-center/get-team-positions";
import type { PCResource } from "@/lib/types";

const mocks = vi.hoisted(() => ({
  getServiceTypeTeamPositionsWithTeams: vi.fn(),
  getPlanNeededPositionsWithTeams: vi.fn(),
  getServiceTypePlanNeededPositionsWithTeams: vi.fn(),
  getPlanTeamMembers: vi.fn(),
  getPlan: vi.fn(),
  getPlanForServiceTypeWithSeries: vi.fn(),
}));

vi.mock("@/lib/planning-center/services/catalog-service", () => ({
  planningCenterCatalogService: {
    getServiceTypeTeamPositionsWithTeams: mocks.getServiceTypeTeamPositionsWithTeams,
    getPlanNeededPositionsWithTeams: mocks.getPlanNeededPositionsWithTeams,
    getServiceTypePlanNeededPositionsWithTeams:
      mocks.getServiceTypePlanNeededPositionsWithTeams,
  },
}));

vi.mock("@/lib/planning-center/services/people-service", () => ({
  planningCenterPeopleService: {
    getPlanTeamMembers: mocks.getPlanTeamMembers,
  },
}));

vi.mock("@/lib/planning-center/services/plans-service", () => ({
  planningCenterPlansService: {
    getPlan: mocks.getPlan,
    getPlanForServiceTypeWithSeries: mocks.getPlanForServiceTypeWithSeries,
  },
}));

function team(id: string, name: string): PCResource {
  return {
    type: "Team",
    id,
    attributes: {
      name,
      sequence: 1,
      rehearsal_team: false,
      archived_at: null,
    },
  };
}

function teamPosition(id: string, teamId: string, name: string): PCResource {
  return {
    type: "TeamPosition",
    id,
    attributes: { name },
    relationships: {
      team: {
        data: { type: "Team", id: teamId },
      },
    },
  };
}

function neededPosition(
  id: string,
  teamId: string,
  teamPositionName: string,
  quantity: number
): PCResource {
  return {
    type: "NeededPosition",
    id,
    attributes: { team_position_name: teamPositionName, quantity },
    relationships: {
      team: {
        data: { type: "Team", id: teamId },
      },
    },
  };
}

function person(id: string, firstName: string, lastName: string): PCResource {
  return {
    type: "Person",
    id,
    attributes: {
      first_name: firstName,
      last_name: lastName,
      photo_url: null,
      photo_thumbnail_url: null,
      archived_at: null,
    },
  };
}

function planTeamMember(params: {
  id: string;
  teamId: string;
  teamPositionName: string;
  status: string;
  personId?: string;
}): PCResource {
  return {
    type: "PlanPerson",
    id: params.id,
    attributes: {
      status: params.status,
      created_at: "2026-01-01T00:00:00Z",
      team_position_name: params.teamPositionName,
    },
    relationships: {
      team: {
        data: { type: "Team", id: params.teamId },
      },
      ...(params.personId
        ? {
            person: {
              data: { type: "Person", id: params.personId },
            },
          }
        : {}),
    },
  };
}

describe("getNeededTeamPositionsForPlan", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getPlanTeamMembers.mockResolvedValue({ data: [], included: [] });
  });

  it("falls back to service-type plan needed_positions for no-series plans and matches/dedupes", async () => {
    mocks.getPlan.mockResolvedValue({
      type: "Plan",
      id: "plan-1",
      attributes: { title: "Test", created_at: "2026-01-01T00:00:00Z" },
      relationships: { series: { data: null } },
    });
    mocks.getPlanForServiceTypeWithSeries.mockResolvedValue({
      data: {
        type: "Plan",
        id: "plan-1",
        attributes: { title: "Test", created_at: "2026-01-01T00:00:00Z" },
        relationships: {},
      },
      included: [],
    });

    mocks.getServiceTypeTeamPositionsWithTeams.mockResolvedValue({
      data: [
        teamPosition("tp-band-vocals", "team-band", "Vocals"),
        teamPosition("tp-band-guitar", "team-band", "Guitar"),
        teamPosition("tp-media-slides", "team-media", "Slides"),
      ],
      included: [team("team-band", "Band"), team("team-media", "Media")],
    });

    mocks.getServiceTypePlanNeededPositionsWithTeams.mockResolvedValue({
      data: [
        neededPosition("np-1", "team-band", "Vocals", 1),
        neededPosition("np-2", "team-band", " vocals ", 2), // duplicate after normalization
        neededPosition("np-3", "team-band", "Guitar", 0), // ignored
        neededPosition("np-4", "team-band", "Keys", 1), // unmatched
        neededPosition("np-5", "team-media", "Slides", 1),
      ],
      included: [team("team-band", "Band"), team("team-media", "Media")],
    });
    mocks.getPlanNeededPositionsWithTeams.mockResolvedValue({ data: [], included: [] });

    const result = await getNeededTeamPositionsForPlan("st-1", "plan-1");

    expect(mocks.getServiceTypePlanNeededPositionsWithTeams).toHaveBeenCalledWith(
      "st-1",
      "plan-1"
    );
    expect(mocks.getPlanNeededPositionsWithTeams).not.toHaveBeenCalled();
    expect(result).toEqual([
      {
        teamId: "team-band",
        teamName: "Band",
        positions: [
          {
            id: "tp-band-vocals",
            name: "Vocals",
            teamId: "team-band",
            teamName: "Band",
            neededCount: 3,
          },
        ],
      },
      {
        teamId: "team-media",
        teamName: "Media",
        positions: [
          {
            id: "tp-media-slides",
            name: "Slides",
            teamId: "team-media",
            teamName: "Media",
            neededCount: 1,
          },
        ],
      },
    ]);
  });

  it("uses provided seriesId and skips plan series resolution", async () => {
    mocks.getServiceTypeTeamPositionsWithTeams.mockResolvedValue({
      data: [teamPosition("tp-1", "team-1", "Drums")],
      included: [team("team-1", "Band")],
    });
    mocks.getPlanNeededPositionsWithTeams.mockResolvedValue({
      data: [neededPosition("np-1", "team-1", "Drums", 1)],
      included: [team("team-1", "Band")],
    });

    const result = await getNeededTeamPositionsForPlan("st-1", "plan-1", "series-123");

    expect(mocks.getPlan).not.toHaveBeenCalled();
    expect(mocks.getPlanForServiceTypeWithSeries).not.toHaveBeenCalled();
    expect(mocks.getPlanNeededPositionsWithTeams).toHaveBeenCalledWith(
      "series-123",
      "plan-1"
    );
    expect(result).toHaveLength(1);
    expect(result[0]?.positions[0]?.name).toBe("Drums");
  });

  it("adds confirmed and pending fill summaries with people names", async () => {
    mocks.getPlan.mockResolvedValue({
      type: "Plan",
      id: "plan-1",
      attributes: { title: "Test", created_at: "2026-01-01T00:00:00Z" },
      relationships: { series: { data: null } },
    });
    mocks.getPlanForServiceTypeWithSeries.mockResolvedValue({ data: { type: "Plan", id: "plan-1", attributes: { title: "Test", created_at: "2026-01-01T00:00:00Z" }, relationships: {} }, included: [] });
    mocks.getServiceTypeTeamPositionsWithTeams.mockResolvedValue({
      data: [
        teamPosition("tp-vocals", "team-band", "Vocals"),
        teamPosition("tp-guitar", "team-band", "Guitar"),
      ],
      included: [team("team-band", "Band")],
    });
    mocks.getServiceTypePlanNeededPositionsWithTeams.mockResolvedValue({
      data: [
        neededPosition("np-vocals", "team-band", "Vocals", 1),
        neededPosition("np-guitar", "team-band", "Guitar", 1),
      ],
      included: [team("team-band", "Band")],
    });
    mocks.getPlanTeamMembers.mockResolvedValue({
      data: [
        planTeamMember({
          id: "pp-confirmed",
          teamId: "team-band",
          teamPositionName: "Vocals",
          status: "C",
          personId: "person-1",
        }),
        planTeamMember({
          id: "pp-pending",
          teamId: "team-band",
          teamPositionName: "Vocals",
          status: "U",
          personId: "person-2",
        }),
        planTeamMember({
          id: "pp-declined",
          teamId: "team-band",
          teamPositionName: "Vocals",
          status: "declined",
          personId: "person-3",
        }),
      ],
      included: [
        team("team-band", "Band"),
        person("person-1", "Amy", "Leader"),
        person("person-2", "Ben", "Singer"),
        person("person-3", "Cara", "Nope"),
      ],
    });

    const result = await getNeededTeamPositionsForPlan("st-1", "plan-1");
    const vocals = result[0]?.positions.find((p) => p.name === "Vocals");

    expect(vocals?.filledConfirmedCount).toBe(1);
    expect(vocals?.filledPendingCount).toBe(1);
    expect(vocals?.filledPeople).toEqual([
      {
        id: "person-1",
        name: "Amy Leader",
        status: "confirmed",
        rawStatus: "C",
        photoThumbnailUrl: null,
      },
      {
        id: "person-2",
        name: "Ben Singer",
        status: "pending",
        rawStatus: "U",
        photoThumbnailUrl: null,
      },
    ]);
  });

  it("keeps needed count independent and falls back to unknown person when include is missing", async () => {
    mocks.getPlan.mockResolvedValue({
      type: "Plan",
      id: "plan-1",
      attributes: { title: "Test", created_at: "2026-01-01T00:00:00Z" },
      relationships: { series: { data: null } },
    });
    mocks.getPlanForServiceTypeWithSeries.mockResolvedValue({ data: { type: "Plan", id: "plan-1", attributes: { title: "Test", created_at: "2026-01-01T00:00:00Z" }, relationships: {} }, included: [] });
    mocks.getServiceTypeTeamPositionsWithTeams.mockResolvedValue({
      data: [teamPosition("tp-1", "team-1", "Drums")],
      included: [team("team-1", "Band")],
    });
    mocks.getServiceTypePlanNeededPositionsWithTeams.mockResolvedValue({
      data: [neededPosition("np-1", "team-1", "Drums", 1)],
      included: [team("team-1", "Band")],
    });
    mocks.getPlanTeamMembers.mockResolvedValue({
      data: [
        planTeamMember({ id: "pp-1", teamId: "team-1", teamPositionName: "Drums", status: "confirmed" }),
        planTeamMember({ id: "pp-2", teamId: "team-1", teamPositionName: "Drums", status: "U" }),
      ],
      included: [team("team-1", "Band")],
    });

    const result = await getNeededTeamPositionsForPlan("st-1", "plan-1");
    const drums = result[0]?.positions[0];

    expect(drums?.neededCount).toBe(1);
    expect(drums?.filledConfirmedCount).toBe(1);
    expect(drums?.filledPendingCount).toBe(1);
    expect(drums?.filledPeople?.[0]?.name).toBe("Unknown person");
  });
});
