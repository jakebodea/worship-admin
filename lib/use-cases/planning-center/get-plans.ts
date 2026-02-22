import { planningCenterPlansService } from "@/lib/planning-center/services/plans-service";
import type { Plan, RawPlan } from "@/lib/types";

export async function getPlansForServiceType(
  serviceTypeId: string
): Promise<Plan[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startDate = new Date(today);
  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() + 60); // Next 2 months

  const rawPlans = await planningCenterPlansService.getPlansInDateRange(
    serviceTypeId,
    startDate,
    endDate
  );

  const parsedPlans = rawPlans
    .map((raw) => {
      const plan = raw as unknown as RawPlan;
      const sortDateStr = plan.attributes.sort_date as string | undefined;
      if (!sortDateStr) return null;

      const sortDate = new Date(sortDateStr);
      if (isNaN(sortDate.getTime())) return null;

      const parsedPlan: Plan = {
        id: plan.id,
        title: plan.attributes.title as string,
        seriesTitle: plan.attributes.series_title as string | undefined,
        createdAt: new Date(plan.attributes.created_at as string),
        sortDate,
      };
      return parsedPlan;
    })
    .filter((plan): plan is Plan => plan !== null);

  const plans: Plan[] = parsedPlans.filter(
    (plan) =>
      !!plan.sortDate && plan.sortDate >= startDate && plan.sortDate <= endDate
  );

  plans.sort((a, b) => (a.sortDate?.getTime() || 0) - (b.sortDate?.getTime() || 0));
  return plans;
}
