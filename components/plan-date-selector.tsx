"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePlans } from "@/hooks/use-plans";
import type { Plan } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PlanDateSelectorProps {
  serviceTypeId: string | null;
  selectedPlan: Plan | null;
  onSelect: (plan: Plan) => void;
}

export function PlanDateSelector({
  serviceTypeId,
  selectedPlan,
  onSelect,
}: PlanDateSelectorProps) {
  const { data: plans, isLoading, isFetching } = usePlans(serviceTypeId);

  if (isLoading || isFetching) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">
            Which date are you looking to schedule for?
          </h2>
          <p className="text-muted-foreground">
            Loading available plans...
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!plans || plans.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No plans found for this service type. Make sure there are existing
          plans scheduled.
        </p>
      </div>
    );
  }

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "No date";
    
    // Convert string to Date if needed
    const dateObj = typeof date === "string" ? new Date(date) : date;
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return "Invalid date";
    }
    
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(dateObj);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold mb-2">
          Which date are you looking to schedule for?
        </h2>
        <p className="text-muted-foreground">
          Select a date from the available plans
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={cn(
              "p-0 overflow-hidden transition-all hover:shadow-md",
              selectedPlan?.id === plan.id &&
                "ring-2 ring-primary ring-offset-2"
            )}
          >
            <button
              type="button"
              className="w-full text-left rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => onSelect(plan)}
              aria-pressed={selectedPlan?.id === plan.id}
            >
              <CardHeader>
                <CardTitle className="text-lg">
                  {formatDate(plan.sortDate)}
                </CardTitle>
                {plan.title && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {plan.title}
                  </p>
                )}
              </CardHeader>
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
