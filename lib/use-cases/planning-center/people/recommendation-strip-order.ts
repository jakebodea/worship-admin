import type { PersonWithAvailability } from "@/lib/types";

function isStripTail(person: PersonWithAvailability): boolean {
  return !!person.isBlockedForDate || !!person.isDeclinedForSelectedPlanPosition;
}

/** Within the tail: blocked before declined, then score, then name. */
function tailSortKey(person: PersonWithAvailability): number {
  if (person.isBlockedForDate) return 0;
  if (person.isDeclinedForSelectedPlanPosition) return 1;
  return 2;
}

/** Everyone except blocked/declined (highest → lowest recommendation), then blocked & declined at the end. */
export function partitionPeopleForRecommendationStrip(people: PersonWithAvailability[]): {
  actionable: PersonWithAvailability[];
  exceptions: PersonWithAvailability[];
} {
  const actionable: PersonWithAvailability[] = [];
  const exceptions: PersonWithAvailability[] = [];

  for (const p of people) {
    if (isStripTail(p)) exceptions.push(p);
    else actionable.push(p);
  }

  actionable.sort((a, b) => {
    const as = a.recommendationScore ?? 0;
    const bs = b.recommendationScore ?? 0;
    if (bs !== as) return bs - as;
    return a.fullName.localeCompare(b.fullName);
  });

  exceptions.sort((a, b) => {
    const tr = tailSortKey(a) - tailSortKey(b);
    if (tr !== 0) return tr;
    const as = a.recommendationScore ?? 0;
    const bs = b.recommendationScore ?? 0;
    if (bs !== as) return bs - as;
    return a.fullName.localeCompare(b.fullName);
  });

  return { actionable, exceptions };
}
