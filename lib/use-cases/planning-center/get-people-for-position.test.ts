import { beforeEach, describe, expect, it, vi } from "vitest";
import { getPeopleForPosition } from "@/lib/use-cases/planning-center/get-people-for-position";
import type { PCResource } from "@/lib/types";

const mocks = vi.hoisted(() => ({
  getPeopleForTeamPosition: vi.fn(),
  getPersonBlockouts: vi.fn(),
  getPersonSchedules: vi.fn(),
  getPlanTeamMembers: vi.fn(),
  getCacheScope: vi.fn(),
}));

vi.mock("@/lib/planning-center/resolve-organization-timezone", () => ({
  resolveOrganizationTimeZone: vi.fn(() => Promise.resolve("UTC")),
}));

vi.mock("@/lib/planning-center/services/people-service", () => ({
  planningCenterPeopleService: {
    getPeopleForTeamPosition: mocks.getPeopleForTeamPosition,
    getPersonBlockouts: mocks.getPersonBlockouts,
    getPersonSchedules: mocks.getPersonSchedules,
    getPlanTeamMembers: mocks.getPlanTeamMembers,
    getCacheScope: mocks.getCacheScope,
  },
}));

function person(id: string, first: string, last: string): PCResource {
  return {
    type: "Person",
    id,
    attributes: {
      first_name: first,
      last_name: last,
      photo_url: null,
      photo_thumbnail_url: null,
      archived_at: null,
    },
  };
}

function assignment(id: string, personId: string): PCResource {
  return {
    type: "PersonTeamPositionAssignment",
    id,
    attributes: {},
    relationships: {
      person: {
        data: { type: "Person", id: personId },
      },
    },
  };
}

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

function teamPosition(id: string, name: string, teamId: string): PCResource {
  return {
    type: "TeamPosition",
    id,
    attributes: { name },
    relationships: {
      team: { data: { type: "Team", id: teamId } },
    },
  };
}

function scheduleEntry(params: {
  id: string;
  planId: string;
  teamId: string;
  status: string;
  teamName?: string;
  teamPositionName: string;
  sortDate?: string;
  timesIds?: string[];
}): PCResource {
  const relationships: PCResource["relationships"] = {
    plan: { data: { type: "Plan", id: params.planId } },
    team: { data: { type: "Team", id: params.teamId } },
    plan_person: { data: { type: "PlanPerson", id: params.id } },
  };
  if (params.timesIds) {
    relationships.plan_times = {
      data: params.timesIds.map((id) => ({ type: "PlanTime", id })),
    };
  }

  return {
    type: "Schedule",
    id: params.id,
    attributes: {
      status: params.status,
      sort_date: `${params.sortDate ?? "2026-02-22"}T00:00:00Z`,
      team_name: params.teamName ?? (
        params.teamPositionName.includes(" - ")
          ? params.teamPositionName.split(" - ")[0]
          : undefined
      ),
      team_position_name: params.teamPositionName,
    },
    relationships,
  };
}

function planMemberEntry(params: {
  id: string;
  personId: string;
  planId: string;
  teamId: string;
  status: string;
  teamPositionName: string;
}): PCResource {
  return {
    type: "PlanPerson",
    id: params.id,
    attributes: {
      status: params.status,
      created_at: "2026-02-22T00:00:00Z",
      team_position_name: params.teamPositionName,
    },
    relationships: {
      person: { data: { type: "Person", id: params.personId } },
      plan: { data: { type: "Plan", id: params.planId } },
      team: { data: { type: "Team", id: params.teamId } },
    },
  };
}

function blockout(id: string, startsAt: string, endsAt: string): PCResource {
  return {
    type: "Blockout",
    id,
    attributes: {
      reason: "Away",
      starts_at: startsAt,
      ends_at: endsAt,
      description: "",
      share: true,
    },
  };
}

/** Parent row from Services API for a recurring block — wide starts_at/ends_at; real days are on blockout_dates. */
function recurringWeeklyBlockout(id: string, startsAt: string, endsAt: string): PCResource {
  return {
    type: "Blockout",
    id,
    attributes: {
      reason: "Recurring",
      starts_at: startsAt,
      ends_at: endsAt,
      description: "",
      share: true,
      repeat_frequency: "every_1",
      repeat_period: "weekly",
    },
  };
}

describe("getPeopleForPosition", () => {
  let cacheScopeIndex = 0;

  beforeEach(() => {
    vi.clearAllMocks();
    cacheScopeIndex += 1;
    mocks.getCacheScope.mockImplementation(() => `test-scope-${cacheScopeIndex}`);
    mocks.getPersonSchedules.mockResolvedValue({ data: [], included: [] });
    mocks.getPlanTeamMembers.mockResolvedValue({ data: [], included: [] });
  });

  it("marks selected plan scheduled/confirmed flags and sorts confirmed/scheduled before available/blocked", async () => {
    const serviceTypeId = "st-1";
    const teamId = "team-1";
    const positionId = "pos-1";
    const planId = "plan-target";
    const date = "2026-02-22";

    mocks.getPeopleForTeamPosition.mockResolvedValue({
      data: [
        assignment("a1", "p-confirmed"),
        assignment("a2", "p-scheduled"),
        assignment("a3", "p-available"),
        assignment("a4", "p-blocked"),
      ],
      included: [
        person("p-confirmed", "Alice", "Confirmed"),
        person("p-scheduled", "Bob", "Scheduled"),
        person("p-available", "Cara", "Available"),
        person("p-blocked", "Dan", "Blocked"),
        teamPosition(positionId, "Vocals", teamId),
        team(teamId, "Band"),
      ],
    });

    mocks.getPersonSchedules.mockImplementation(async (personId: string) => {
      if (personId === "p-confirmed") {
        return {
          data: [
            scheduleEntry({
              id: "pp-confirmed",
              planId,
              teamId,
              status: "C",
              teamPositionName: "Band - Vocals",
            }),
          ],
          included: [],
        };
      }

      if (personId === "p-scheduled") {
        return {
          data: [
            scheduleEntry({
              id: "pp-scheduled",
              planId,
              teamId,
              status: "U",
              teamPositionName: "Band - Vocals",
            }),
          ],
          included: [],
        };
      }

      return {
        data: [],
        included: [],
      };
    });

    mocks.getPersonBlockouts.mockImplementation(async (personId: string) => {
      if (personId === "p-blocked") {
        return [
          blockout(
            "b1",
            "2026-02-22T00:00:00Z",
            "2026-02-22T23:59:59Z"
          ),
        ];
      }
      return [];
    });

    const result = await getPeopleForPosition({
      serviceTypeId,
      positionId,
      teamId,
      planId,
      date,
    });

    expect(result.map((p) => p.id)).toEqual([
      "p-confirmed",
      "p-scheduled",
      "p-available",
      "p-blocked",
    ]);

    const confirmed = result[0]!;
    const scheduled = result[1]!;
    const available = result[2]!;
    const blocked = result[3]!;

    expect(confirmed.isConfirmedForSelectedPlanPosition).toBe(true);
    expect(confirmed.isScheduledForSelectedPlanPosition).toBe(true);
    expect(confirmed.selectedPlanAssignmentLabels).toEqual(["Band - Vocals"]);
    expect(confirmed.scheduledPlanPersonId).toBe("pp-confirmed");

    expect(scheduled.isConfirmedForSelectedPlanPosition).toBe(false);
    expect(scheduled.isScheduledForSelectedPlanPosition).toBe(true);
    expect(scheduled.selectedPlanAssignmentLabels).toEqual(["Band - Vocals"]);
    expect(scheduled.scheduledPlanPersonId).toBe("pp-scheduled");

    expect(available.isScheduledForSelectedPlanPosition).toBe(false);
    expect(available.selectedPlanAssignmentLabels).toEqual([]);
    expect(blocked.isBlockedForDate).toBe(true);
  });

  it("includes same-plan assignments from other positions as labels without marking the selected slot scheduled", async () => {
    const serviceTypeId = "st-1";
    const teamId = "team-1";
    const positionId = "pos-guitar";
    const planId = "plan-target";

    mocks.getPeopleForTeamPosition.mockResolvedValue({
      data: [assignment("a1", "p1")],
      included: [
        person("p1", "Casey", "Elsewhere"),
        teamPosition(positionId, "Guitar", teamId),
        team(teamId, "Band"),
      ],
    });
    mocks.getPersonBlockouts.mockResolvedValue([]);
    mocks.getPersonSchedules.mockResolvedValue({
      data: [
        scheduleEntry({
          id: "pp1",
          planId,
          teamId,
          status: "U",
          teamName: "Band",
          teamPositionName: "Keys",
        }),
      ],
      included: [],
    });

    const result = await getPeopleForPosition({
      serviceTypeId,
      positionId,
      teamId,
      planId,
      date: "2026-02-22",
    });

    expect(result).toHaveLength(1);
    expect(result[0]?.isScheduledForSelectedPlanPosition).toBe(false);
    expect(result[0]?.selectedPlanAssignmentLabels).toEqual(["Band - Keys"]);
    expect(result[0]?.scheduledPlanPersonId).toBeUndefined();
  });

  it("reuses derived candidate history for the same person and reference date across positions", async () => {
    const serviceTypeId = "st-1";
    const teamId = "team-1";
    const planId = "plan-target";
    const personId = "p-shared";

    mocks.getPeopleForTeamPosition.mockImplementation(async (
      _serviceTypeId: string,
      positionId: string
    ) => ({
      data: [assignment(`a-${positionId}`, personId)],
      included: [
        person(personId, "Shared", "Candidate"),
        teamPosition(positionId, positionId === "pos-vocals" ? "Vocals" : "Keys", teamId),
        team(teamId, "Band"),
      ],
    }));
    mocks.getPersonBlockouts.mockResolvedValue([]);
    mocks.getPersonSchedules.mockResolvedValue({
      data: [
        scheduleEntry({
          id: "pp-keys",
          planId,
          teamId,
          status: "U",
          teamName: "Band",
          teamPositionName: "Keys",
        }),
      ],
      included: [],
    });

    const vocalsResult = await getPeopleForPosition({
      serviceTypeId,
      positionId: "pos-vocals",
      teamId,
      planId,
      date: "2026-02-22",
    });
    const keysResult = await getPeopleForPosition({
      serviceTypeId,
      positionId: "pos-keys",
      teamId,
      planId,
      date: "2026-02-22",
    });

    expect(mocks.getPersonSchedules).toHaveBeenCalledTimes(1);
    expect(vocalsResult[0]?.selectedPlanAssignmentLabels).toEqual(["Band - Keys"]);
    expect(vocalsResult[0]?.isScheduledForSelectedPlanPosition).toBe(false);
    expect(keysResult[0]?.selectedPlanAssignmentLabels).toEqual(["Band - Keys"]);
    expect(keysResult[0]?.isScheduledForSelectedPlanPosition).toBe(true);
  });

  it("includes and marks a selected slot plan member even when they are not assigned to the position", async () => {
    const serviceTypeId = "st-1";
    const teamId = "team-1";
    const positionId = "pos-vocals";
    const planId = "plan-target";
    const personId = "p-pending";

    mocks.getPeopleForTeamPosition.mockResolvedValue({
      data: [],
      included: [teamPosition(positionId, "Vocals", teamId), team(teamId, "Band")],
    });
    mocks.getPlanTeamMembers.mockResolvedValue({
      data: [
        planMemberEntry({
          id: "pp-pending",
          personId,
          planId,
          teamId,
          status: "U",
          teamPositionName: "Vocals",
        }),
      ],
      included: [person(personId, "Pending", "Singer"), team(teamId, "Band")],
    });
    mocks.getPersonBlockouts.mockResolvedValue([]);
    mocks.getPersonSchedules.mockResolvedValue({ data: [], included: [] });

    const result = await getPeopleForPosition({
      serviceTypeId,
      positionId,
      teamId,
      planId,
      date: "2026-02-22",
    });

    expect(result.map((row) => row.id)).toEqual([personId]);
    expect(result[0]?.isScheduledForSelectedPlanPosition).toBe(true);
    expect(result[0]?.isConfirmedForSelectedPlanPosition).toBe(false);
    expect(result[0]?.scheduledPlanPersonId).toBe("pp-pending");
    expect(result[0]?.selectedPlanAssignmentLabels).toEqual(["Band - Vocals"]);
  });

  it("does not add unassigned people who are scheduled elsewhere on the selected plan", async () => {
    const serviceTypeId = "st-1";
    const teamId = "team-1";
    const positionId = "pos-lead-guitar";
    const planId = "plan-target";

    mocks.getPeopleForTeamPosition.mockResolvedValue({
      data: [assignment("a-lead", "p-lead")],
      included: [
        person("p-lead", "Lead", "Candidate"),
        teamPosition(positionId, "Lead Guitar", teamId),
        team(teamId, "Band"),
      ],
    });
    mocks.getPlanTeamMembers.mockResolvedValue({
      data: [
        planMemberEntry({
          id: "pp-vocals",
          personId: "p-vocals",
          planId,
          teamId,
          status: "U",
          teamPositionName: "Vocals",
        }),
      ],
      included: [person("p-vocals", "Vocal", "Only"), team(teamId, "Band")],
    });
    mocks.getPersonBlockouts.mockResolvedValue([]);
    mocks.getPersonSchedules.mockResolvedValue({ data: [], included: [] });

    const result = await getPeopleForPosition({
      serviceTypeId,
      positionId,
      teamId,
      planId,
      date: "2026-02-22",
    });

    expect(result.map((row) => row.id)).toEqual(["p-lead"]);
  });

  it("matches selected plan when plan_person team_position_name is unprefixed (position only)", async () => {
    const serviceTypeId = "st-1";
    const teamId = "team-1";
    const positionId = "pos-1";
    const planId = "plan-target";

    mocks.getPeopleForTeamPosition.mockResolvedValue({
      data: [assignment("a1", "p1")],
      included: [person("p1", "Una", "Prefixed"), teamPosition(positionId, "Vocals", teamId), team(teamId, "Band")],
    });
    mocks.getPersonBlockouts.mockResolvedValue([]);
    mocks.getPersonSchedules.mockResolvedValue({
      data: [
        scheduleEntry({
          id: "pp1",
          planId,
          teamId,
          status: "U",
          teamPositionName: "Vocals",
        }),
      ],
      included: [],
    });

    const result = await getPeopleForPosition({
      serviceTypeId,
      positionId,
      teamId,
      planId,
      date: "2026-02-22",
    });

    expect(result).toHaveLength(1);
    expect(result[0]?.isScheduledForSelectedPlanPosition).toBe(true);
    expect(result[0]?.isConfirmedForSelectedPlanPosition).toBe(false);
  });

  it("does not mark selected plan scheduled when schedule team_name does not match selected team", async () => {
    const serviceTypeId = "st-1";
    const teamId = "team-1";
    const otherTeamId = "team-2";
    const positionId = "pos-1";
    const planId = "plan-target";

    mocks.getPeopleForTeamPosition.mockResolvedValue({
      data: [assignment("a1", "p1")],
      included: [
        person("p1", "Team", "Mismatch"),
        teamPosition(positionId, "Vocals", teamId),
        team(teamId, "Band"),
        team(otherTeamId, "Choir"),
      ],
    });
    mocks.getPersonBlockouts.mockResolvedValue([]);
    mocks.getPersonSchedules.mockResolvedValue({
      data: [
        scheduleEntry({
          id: "pp1",
          planId,
          teamId,
          status: "U",
          teamName: "Choir",
          teamPositionName: "Vocals",
        }),
      ],
      included: [],
    });

    const result = await getPeopleForPosition({
      serviceTypeId,
      positionId,
      teamId,
      planId,
      date: "2026-02-22",
    });

    expect(result[0]?.isScheduledForSelectedPlanPosition).toBe(false);
    expect(result[0]?.scheduledPlanPersonId).toBeUndefined();
  });

  it("builds history from person schedules without prefetching plan team members", async () => {
    const serviceTypeId = "st-1";
    const teamId = "team-1";
    const positionId = "pos-bass";
    const planEasterId = "plan-easter-am";
    const personId = "p-michael";
    const easterSortDay = "2026-04-05";

    mocks.getPeopleForTeamPosition.mockResolvedValue({
      data: [assignment("a-michael", personId)],
      included: [
        person(personId, "Michael", "Bortis"),
        teamPosition(positionId, "Bass Guitar", teamId),
        team(teamId, "Band"),
      ],
    });
    mocks.getPersonBlockouts.mockResolvedValue([]);
    mocks.getPersonSchedules.mockResolvedValue({
      data: [
        scheduleEntry({
          id: "pp-from-schedules",
          planId: planEasterId,
          teamId,
          status: "C",
          teamPositionName: "Band - Bass Guitar",
          sortDate: easterSortDay,
        }),
      ],
      included: [],
    });

    const result = await getPeopleForPosition({
      serviceTypeId,
      positionId,
      teamId,
      planId: planEasterId,
      date: easterSortDay,
    });

    expect(mocks.getPersonSchedules).toHaveBeenCalledWith(
      personId,
      { order: "-starts_at" },
      2
    );
    expect(result).toHaveLength(1);
    expect(result[0]).toBeDefined();
    const personRow = result[0]!;
    expect(personRow.frequency).toBeDefined();
    expect(personRow.serviceHistory).toBeDefined();
    const historyRow = personRow.serviceHistory!.find(
      (h) => h.teamPositionName === "Band - Bass Guitar"
    );
    expect(historyRow).toBeDefined();
    expect(personRow.frequency!.totalServed).toBeGreaterThanOrEqual(1);
    expect(personRow.frequency!.recentServedDays).toBeGreaterThanOrEqual(1);
  });

  it.skip("does not mark blocked from recurring blockout parent range alone (needs blockout_dates)", async () => {
    const serviceTypeId = "st-1";
    const teamId = "team-1";
    const positionId = "pos-1";
    const planId = "plan-target";
    const planSortDay = "2026-04-13";

    mocks.getPeopleForTeamPosition.mockResolvedValue({
      data: [assignment("a1", "p1")],
      included: [person("p1", "Pat", "Person"), teamPosition(positionId, "Vocals", teamId), team(teamId, "Band")],
    });
    mocks.getPersonBlockouts.mockResolvedValue([
      recurringWeeklyBlockout(
        "b-weekly",
        "2026-01-01T00:00:00.000Z",
        "2026-12-31T23:59:59.000Z"
      ),
    ]);
    mocks.getPersonSchedules.mockResolvedValue({
      data: [],
      included: [],
    });

    const result = await getPeopleForPosition({
      serviceTypeId,
      positionId,
      teamId,
      planId,
      date: planSortDay,
    });

    expect(result).toHaveLength(1);
    // Recurring rules use a wide parent starts_at/ends_at; real instances live on blockout_dates.
    // Calendar-day envelope matching still treats Apr 13 as inside Jan 1–Dec 31 until we expand dates.
    expect(result[0]?.isBlockedForDate).toBe(false);
  });

});
