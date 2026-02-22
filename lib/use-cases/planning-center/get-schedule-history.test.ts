import { describe, expect, it, vi } from "vitest";
import { getScheduleHistory } from "@/lib/use-cases/planning-center/get-schedule-history";

const { getPersonPlanPeopleWithPlansMock } = vi.hoisted(() => ({
  getPersonPlanPeopleWithPlansMock: vi.fn(),
}));

vi.mock("@/lib/planning-center/services/people-service", () => ({
  planningCenterPeopleService: {
    getPersonPlanPeopleWithPlans: getPersonPlanPeopleWithPlansMock,
  },
}));

describe("getScheduleHistory", () => {
  it("keeps confirmed non-excluded records and computes frequency", async () => {
    const now = new Date();
    const iso = (offsetDays: number) => {
      const d = new Date(now);
      d.setDate(d.getDate() + offsetDays);
      return d.toISOString();
    };

    getPersonPlanPeopleWithPlansMock.mockResolvedValue({
      data: [
        {
          id: "pp-1",
          type: "PlanPerson",
          attributes: {
            status: "Confirmed",
            created_at: iso(-5),
            team_position_name: "Band - Electric",
          },
          relationships: { plan: { data: { id: "p-1", type: "Plan" } } },
        },
        {
          id: "pp-2",
          type: "PlanPerson",
          attributes: {
            status: "U",
            created_at: iso(-3),
            team_position_name: "Band - Electric",
          },
          relationships: { plan: { data: { id: "p-2", type: "Plan" } } },
        },
        {
          id: "pp-3",
          type: "PlanPerson",
          attributes: {
            status: "C",
            created_at: iso(-2),
            team_position_name: "Band - Electric",
          },
          relationships: { plan: { data: { id: "p-3", type: "Plan" } } },
        },
      ],
      included: [
        {
          id: "p-1",
          type: "Plan",
          attributes: { title: "Past Plan", sort_date: iso(-5), created_at: iso(-5) },
          relationships: { service_type: { data: { id: "ok-st", type: "ServiceType" } } },
        },
        {
          id: "p-2",
          type: "Plan",
          attributes: { title: "Unconfirmed Plan", sort_date: iso(-3), created_at: iso(-3) },
          relationships: { service_type: { data: { id: "ok-st", type: "ServiceType" } } },
        },
        {
          id: "p-3",
          type: "Plan",
          attributes: { title: "Excluded Plan", sort_date: iso(-2), created_at: iso(-2) },
          relationships: { service_type: { data: { id: "1106935", type: "ServiceType" } } },
        },
      ],
    });

    const result = await getScheduleHistory("person-1", 90);
    expect(result.planPeople.map((p) => p.id)).toEqual(["pp-1"]);
    expect(result.frequency.last30Days).toBe(1);
    expect(result.frequency.totalServed).toBe(1);
  });
});
