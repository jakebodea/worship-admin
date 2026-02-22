import { describe, expect, it, vi } from "vitest";
import { getPlansForServiceType } from "@/lib/use-cases/planning-center/get-plans";

const { getPlansInDateRangeMock } = vi.hoisted(() => ({
  getPlansInDateRangeMock: vi.fn(),
}));

vi.mock("@/lib/planning-center/services/plans-service", () => ({
  planningCenterPlansService: {
    getPlansInDateRange: getPlansInDateRangeMock,
  },
}));

describe("getPlansForServiceType", () => {
  it("returns bounded, sorted plans from today through next 2 months", async () => {
    const today = new Date();
    const format = (offsetDays: number) => {
      const d = new Date(today);
      d.setDate(d.getDate() + offsetDays);
      return d.toISOString();
    };

    getPlansInDateRangeMock.mockResolvedValue([
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

    expect(plans.map((p) => p.id)).toEqual(["today", "future-1"]);
    expect(getPlansInDateRangeMock).toHaveBeenCalledWith(
      "686882",
      expect.any(Date),
      expect.any(Date)
    );
    const [, startDate, endDate] = getPlansInDateRangeMock.mock.calls[0];
    expect(endDate.getTime()).toBeGreaterThan(startDate.getTime());
  });
});
