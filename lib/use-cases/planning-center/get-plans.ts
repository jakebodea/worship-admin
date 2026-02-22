import { planningCenterPlansService } from "@/lib/planning-center/services/plans-service";
import type { Plan, RawPlan } from "@/lib/types";

export async function getPlansForServiceType(
  serviceTypeId: string
): Promise<Plan[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 90);
  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() + 90);

  const rawPlans = await planningCenterPlansService.getPlansNearDate(
    serviceTypeId,
    today,
    5,
    5,
    3
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

  const todayStart = new Date(today);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(today);
  todayEnd.setHours(23, 59, 59, 999);

  const pastPlans = plans.filter((p) => p.sortDate && p.sortDate < todayStart);
  const futurePlans = plans.filter((p) => p.sortDate && p.sortDate > todayEnd);
  const todayPlans = plans.filter(
    (p) => p.sortDate && p.sortDate >= todayStart && p.sortDate <= todayEnd
  );

  const limitedPlans = [...pastPlans.slice(-5).reverse(), ...todayPlans, ...futurePlans.slice(0, 5)];
  limitedPlans.sort((a, b) => (a.sortDate?.getTime() || 0) - (b.sortDate?.getTime() || 0));
  return limitedPlans;
}
