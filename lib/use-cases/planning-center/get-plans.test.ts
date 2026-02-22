import { describe, expect, it, vi } from "vitest";
import { getPlansForServiceType } from "@/lib/use-cases/planning-center/get-plans";

const { getPlansNearDateMock } = vi.hoisted(() => ({
  getPlansNearDateMock: vi.fn(),
}));

vi.mock("@/lib/planning-center/services/plans-service", () => ({
  planningCenterPlansService: {
    getPlansNearDate: getPlansNearDateMock,
  },
}));

describe("getPlansForServiceType", () => {
  it("returns bounded, sorted plans near today", async () => {
    const today = new Date();
    const format = (offsetDays: number) => {
      const d = new Date(today);
      d.setDate(d.getDate() + offsetDays);
      return d.toISOString();
    };

    getPlansNearDateMock.mockResolvedValue([
      {
        id: "old",
        type: "Plan",
        attributes: {
          title: "Too Old",
          created_at: format(-200),
          sort_date: format(-200),
        },
      },
      {
        id: "past-1",
        type: "Plan",
        attributes: {
          title: "Past",
          created_at: format(-10),
          sort_date: format(-1),
        },
      },
      {
        id: "today",
        type: "Plan",
        attributes: {
          title: "Today",
          created_at: format(-10),
          sort_date: format(0),
        },
      },
      {
        id: "future-1",
        type: "Plan",
        attributes: {
          title: "Future",
          created_at: format(-10),
          sort_date: format(2),
        },
      },
    ]);

    const plans = await getPlansForServiceType("686882");

    expect(plans.map((p) => p.id)).toEqual(["past-1", "today", "future-1"]);
    expect(getPlansNearDateMock).toHaveBeenCalledWith("686882", expect.any(Date), 5, 5, 3);
  });
});
