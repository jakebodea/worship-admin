import { beforeEach, describe, expect, it, vi } from "vitest";
import { getPeopleForPosition } from "@/lib/use-cases/planning-center/get-people-for-position";
import type { PCResource } from "@/lib/types";

const mocks = vi.hoisted(() => ({
  getPeopleForTeamPosition: vi.fn(),
  getPersonBlockouts: vi.fn(),
  getPersonPlanPeopleWithPlans: vi.fn(),
  getPlanTimesForPlan: vi.fn(),
  getPlanTeamMembers: vi.fn(),
  getPersonSchedules: vi.fn(),
  getServiceTypesCached: vi.fn(),
  getPlansInDateRange: vi.fn(),
}));

vi.mock("@/lib/planning-center/resolve-organization-timezone", () => ({
  resolveOrganizationTimeZone: vi.fn(() => Promise.resolve("UTC")),
}));

vi.mock("@/lib/planning-center/services/people-service", () => ({
  planningCenterPeopleService: {
    getPeopleForTeamPosition: mocks.getPeopleForTeamPosition,
    getPersonBlockouts: mocks.getPersonBlockouts,
    getPersonPlanPeopleWithPlans: mocks.getPersonPlanPeopleWithPlans,
    getPlanTimesForPlan: mocks.getPlanTimesForPlan,
    getPlanTeamMembers: mocks.getPlanTeamMembers,
    getPersonSchedules: mocks.getPersonSchedules,
  },
}));

vi.mock("@/lib/planning-center/services/plans-service", () => ({
  planningCenterPlansService: {
    getPlansInDateRange: mocks.getPlansInDateRange,
  },
}));

vi.mock("@/lib/planning-center/services/catalog-service", () => ({
  planningCenterCatalogService: {
    getServiceTypesCached: mocks.getServiceTypesCached,
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

function plan(id: string, serviceTypeId: string, sortDate: string): PCResource {
  return {
    type: "Plan",
    id,
    attributes: {
      title: `Plan ${id}`,
      created_at: `${sortDate}T00:00:00Z`,
      sort_date: `${sortDate}T00:00:00Z`,
    },
    relationships: {
      service_type: {
        data: { type: "ServiceType", id: serviceTypeId },
      },
    },
  };
}

/** PlanPerson as returned from plan `team_members` (includes `person` relationship). */
function planPersonFromTeamMembers(params: {
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
      created_at: "2026-02-01T00:00:00Z",
      team_position_name: params.teamPositionName,
    },
    relationships: {
      plan: { data: { type: "Plan", id: params.planId } },
      team: { data: { type: "Team", id: params.teamId } },
      person: { data: { type: "Person", id: params.personId } },
    },
  };
}

function planPersonEntry(params: {
  id: string;
  planId: string;
  teamId: string;
  status: string;
  teamPositionName: string;
  timesIds?: string[];
  serviceTimesIds?: string[];
}): PCResource {
  const relationships: PCResource["relationships"] = {
    plan: { data: { type: "Plan", id: params.planId } },
    team: { data: { type: "Team", id: params.teamId } },
  };
  if (params.timesIds) {
    relationships.times = {
      data: params.timesIds.map((id) => ({ type: "PlanTime", id })),
    };
  }
  if (params.serviceTimesIds) {
    relationships.service_times = {
      data: params.serviceTimesIds.map((id) => ({ type: "PlanTime", id })),
    };
  }

  return {
    type: "PlanPerson",
    id: params.id,
    attributes: {
      status: params.status,
      created_at: "2026-02-01T00:00:00Z",
      team_position_name: params.teamPositionName,
    },
    relationships,
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
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getPlanTimesForPlan.mockResolvedValue([]);
    mocks.getPlansInDateRange.mockResolvedValue([]);
    mocks.getPlanTeamMembers.mockResolvedValue({ data: [], included: [] });
  });

  it("marks selected plan scheduled/confirmed flags and sorts confirmed/scheduled before available/blocked", async () => {
    const serviceTypeId = "st-1";
    const teamId = "team-1";
    const positionId = "pos-1";
    const planId = "plan-target";
    const date = "2026-02-22";

    mocks.getServiceTypesCached.mockResolvedValue([
      {
        type: "ServiceType",
        id: serviceTypeId,
        attributes: { name: "Sunday", sequence: 1 },
      },
    ]);

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

    mocks.getPersonPlanPeopleWithPlans.mockImplementation(async (personId: string) => {
      if (personId === "p-confirmed") {
        return {
          data: [
            planPersonEntry({
              id: "pp-confirmed",
              planId,
              teamId,
              status: "C",
              teamPositionName: "Band - Vocals",
            }),
          ],
          included: [plan(planId, serviceTypeId, "2026-02-22")],
        };
      }

      if (personId === "p-scheduled") {
        return {
          data: [
            planPersonEntry({
              id: "pp-scheduled",
              planId,
              teamId,
              status: "U",
              teamPositionName: "Band - Vocals",
            }),
          ],
          included: [plan(planId, serviceTypeId, "2026-02-22")],
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
    expect(confirmed.scheduledPlanPersonId).toBe("pp-confirmed");

    expect(scheduled.isConfirmedForSelectedPlanPosition).toBe(false);
    expect(scheduled.isScheduledForSelectedPlanPosition).toBe(true);
    expect(scheduled.scheduledPlanPersonId).toBe("pp-scheduled");

    expect(available.isScheduledForSelectedPlanPosition).toBe(false);
    expect(blocked.isBlockedForDate).toBe(true);
  });

  it("matches selected plan when plan_person team_position_name is unprefixed (position only)", async () => {
    const serviceTypeId = "st-1";
    const teamId = "team-1";
    const positionId = "pos-1";
    const planId = "plan-target";

    mocks.getServiceTypesCached.mockResolvedValue([
      { type: "ServiceType", id: serviceTypeId, attributes: { name: "Sunday", sequence: 1 } },
    ]);
    mocks.getPeopleForTeamPosition.mockResolvedValue({
      data: [assignment("a1", "p1")],
      included: [person("p1", "Una", "Prefixed"), teamPosition(positionId, "Vocals", teamId), team(teamId, "Band")],
    });
    mocks.getPersonBlockouts.mockResolvedValue([]);
    mocks.getPersonPlanPeopleWithPlans.mockResolvedValue({
      data: [
        planPersonEntry({
          id: "pp1",
          planId,
          teamId,
          status: "U",
          teamPositionName: "Vocals",
        }),
      ],
      included: [plan(planId, serviceTypeId, "2026-02-22")],
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

  it("does not mark selected plan scheduled when team name prefix does not match selected team", async () => {
    const serviceTypeId = "st-1";
    const teamId = "team-1";
    const otherTeamId = "team-2";
    const positionId = "pos-1";
    const planId = "plan-target";

    mocks.getServiceTypesCached.mockResolvedValue([
      { type: "ServiceType", id: serviceTypeId, attributes: { name: "Sunday", sequence: 1 } },
    ]);
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
    mocks.getPersonPlanPeopleWithPlans.mockResolvedValue({
      data: [
        planPersonEntry({
          id: "pp1",
          planId,
          teamId,
          status: "U",
          teamPositionName: "Choir - Vocals",
        }),
      ],
      included: [plan(planId, serviceTypeId, "2026-02-22")],
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

  it("supplements history from paginated plan team_members when person plan_people is incomplete (PC gap)", async () => {
    const serviceTypeId = "st-1";
    const teamId = "team-1";
    const positionId = "pos-bass";
    const planEasterId = "plan-easter-am";
    const personId = "p-michael";
    const easterSortDay = "2026-04-05";

    mocks.getServiceTypesCached.mockResolvedValue([
      { type: "ServiceType", id: serviceTypeId, attributes: { name: "Sunday AM", sequence: 1 } },
    ]);
    mocks.getPlansInDateRange.mockImplementation(async (stId, _start, _end) => {
      if (stId !== serviceTypeId) return [];
      return [plan(planEasterId, serviceTypeId, easterSortDay)];
    });
    mocks.getPlanTeamMembers.mockImplementation(async (stId, planId) => {
      if (stId !== serviceTypeId || planId !== planEasterId) {
        return { data: [], included: [] };
      }
      return {
        data: [
          planPersonFromTeamMembers({
            id: "pp-from-team-members",
            personId,
            planId: planEasterId,
            teamId,
            status: "C",
            teamPositionName: "Band - Bass Guitar",
          }),
        ],
        included: [team(teamId, "Band")],
      };
    });

    mocks.getPeopleForTeamPosition.mockResolvedValue({
      data: [assignment("a-michael", personId)],
      included: [
        person(personId, "Michael", "Bortis"),
        teamPosition(positionId, "Bass Guitar", teamId),
        team(teamId, "Band"),
      ],
    });
    mocks.getPersonBlockouts.mockResolvedValue([]);
    mocks.getPersonPlanPeopleWithPlans.mockResolvedValue({ data: [], included: [] });

    const result = await getPeopleForPosition({
      serviceTypeId,
      positionId,
      teamId,
      planId: planEasterId,
      date: easterSortDay,
    });

    expect(mocks.getPlanTeamMembers).toHaveBeenCalledWith(serviceTypeId, planEasterId);
    expect(result).toHaveLength(1);
    expect(result[0]).toBeDefined();
    const personRow = result[0]!;
    expect(personRow.frequency).toBeDefined();
    expect(personRow.serviceHistory).toBeDefined();
    const historyRow = personRow.serviceHistory!.find(
      (h) => h.teamPositionName === "Bass Guitar" && h.planTitle === `Plan ${planEasterId}`
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

    mocks.getServiceTypesCached.mockResolvedValue([
      { type: "ServiceType", id: serviceTypeId, attributes: { name: "Sunday", sequence: 1 } },
    ]);
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
    mocks.getPersonPlanPeopleWithPlans.mockResolvedValue({
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
