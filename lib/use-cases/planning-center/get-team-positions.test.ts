import { beforeEach, describe, expect, it, vi } from "vitest";
import { getNeededTeamPositionsForPlan } from "@/lib/use-cases/planning-center/get-team-positions";
import type { PCResource } from "@/lib/types";

const mocks = vi.hoisted(() => ({
  getServiceTypeTeamPositionsWithTeams: vi.fn(),
  getPlanNeededPositionsWithTeams: vi.fn(),
  getServiceTypePlanNeededPositionsWithTeams: vi.fn(),
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

describe("getNeededTeamPositionsForPlan", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
});

