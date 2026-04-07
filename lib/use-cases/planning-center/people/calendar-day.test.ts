import { describe, expect, it } from "vitest";
import { blockoutCoversPlanSortInstant } from "@/lib/use-cases/planning-center/people/calendar-day";

describe("blockoutCoversPlanSortInstant", () => {
  it("does not block Apr 13 plan when blockout is only Apr 12 in America/Los_Angeles", () => {
    const planSortAt = new Date("2026-04-13T07:00:00.000Z");
    const startsAt = new Date("2026-04-12T07:00:00.000Z");
    const endsAt = new Date("2026-04-13T06:59:59.000Z");
    expect(
      blockoutCoversPlanSortInstant(planSortAt, {
        startsAt,
        endsAt,
        timeZone: "America/Los_Angeles",
      })
    ).toBe(false);
  });

  it("still blocks when plan sort_date falls on the same local blockout day (LA)", () => {
    const planSortAt = new Date("2026-04-12T07:00:00.000Z");
    const startsAt = new Date("2026-04-12T07:00:00.000Z");
    const endsAt = new Date("2026-04-13T06:59:59.000Z");
    expect(
      blockoutCoversPlanSortInstant(planSortAt, {
        startsAt,
        endsAt,
        timeZone: "America/Los_Angeles",
      })
    ).toBe(true);
  });

  it("UTC single-day blockout matches when time_zone is omitted (UTC)", () => {
    const planSortAt = new Date("2026-02-22T15:00:00.000Z");
    expect(
      blockoutCoversPlanSortInstant(planSortAt, {
        startsAt: new Date("2026-02-22T00:00:00.000Z"),
        endsAt: new Date("2026-02-22T23:59:59.000Z"),
        timeZone: null,
      })
    ).toBe(true);
  });
});
