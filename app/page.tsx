"use client";

import { useReducer } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Info } from "lucide-react";
import { PersonCard } from "@/components/person-card";
import { ServiceTypeSelector } from "@/components/service-type-selector";
import { PlanDateSelector } from "@/components/plan-date-selector";
import { PositionSelector } from "@/components/position-selector";
import { WizardNavigation } from "@/components/wizard-navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { usePeople } from "@/hooks/use-people";
import { useTeamPositions } from "@/hooks/use-team-positions";
import { queryKeys } from "@/lib/query-keys";
import type { ServiceType, Plan } from "@/lib/types";

type Step = 1 | 2 | 3;

interface DashboardState {
  step: Step;
  selectedServiceType: ServiceType | null;
  selectedPlan: Plan | null;
  selectedTeam: string | null;
  selectedPosition: string | null;
}

type DashboardAction =
  | { type: "serviceTypeSelected"; serviceType: ServiceType }
  | { type: "planSelected"; plan: Plan }
  | { type: "teamChanged"; teamId: string }
  | { type: "positionChanged"; positionId: string }
  | { type: "back" };

const initialState: DashboardState = {
  step: 1,
  selectedServiceType: null,
  selectedPlan: null,
  selectedTeam: null,
  selectedPosition: null,
};

function dashboardReducer(state: DashboardState, action: DashboardAction): DashboardState {
  switch (action.type) {
    case "serviceTypeSelected":
      return {
        step: 2,
        selectedServiceType: action.serviceType,
        selectedPlan: null,
        selectedTeam: null,
        selectedPosition: null,
      };
    case "planSelected":
      return {
        ...state,
        step: 3,
        selectedPlan: action.plan,
        selectedTeam: null,
        selectedPosition: null,
      };
    case "teamChanged":
      return {
        ...state,
        selectedTeam: action.teamId,
        selectedPosition: null,
      };
    case "positionChanged":
      return {
        ...state,
        selectedPosition: action.positionId,
      };
    case "back":
      if (state.step === 2) {
        return {
          step: 1,
          selectedServiceType: null,
          selectedPlan: null,
          selectedTeam: null,
          selectedPosition: null,
        };
      }
      if (state.step === 3) {
        return {
          ...state,
          step: 2,
          selectedPlan: null,
          selectedTeam: null,
          selectedPosition: null,
        };
      }
      return state;
    default:
      return state;
  }
}

export default function DashboardPage() {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);
  const {
    step,
    selectedServiceType,
    selectedPlan,
    selectedTeam,
    selectedPosition,
  } = state;

  // Get team and position names for display
  const { data: teamPositionGroups } = useTeamPositions(
    selectedServiceType?.id || null,
    selectedPlan?.id || null,
    selectedPlan?.seriesId || null
  );
  const selectedTeamGroup = teamPositionGroups?.find((g) => g.teamId === selectedTeam);
  const selectedPositionObj = selectedTeamGroup?.positions.find((p) => p.id === selectedPosition);

  const queryClient = useQueryClient();
  const { data: people, isLoading: peopleLoading } = usePeople(
    selectedServiceType?.id || null,
    selectedTeam,
    selectedPosition,
    selectedPlan?.id || null,
    selectedPlan?.sortDate || null
  );

  const handleScheduleSuccess = () => {
    const dateKey = selectedPlan?.sortDate
      ? new Date(selectedPlan.sortDate).toISOString()
      : null;
    queryClient.invalidateQueries({
      queryKey: queryKeys.people(
        selectedServiceType?.id || null,
        selectedTeam,
        selectedPosition,
        selectedPlan?.id || null,
        dateKey
      ),
    });
  };

  const handleScheduleError = (message: string) => {
    console.error("Schedule error:", message);
  };

  const handleServiceTypeSelect = (serviceType: ServiceType) => {
    dispatch({ type: "serviceTypeSelected", serviceType });
  };

  const handlePlanSelect = (plan: Plan) => {
    dispatch({ type: "planSelected", plan });
  };

  const handleBack = () => {
    dispatch({ type: "back" });
  };

  const handleTeamChange = (teamId: string) => {
    dispatch({ type: "teamChanged", teamId });
  };

  const handlePositionChange = (positionId: string) => {
    dispatch({ type: "positionChanged", positionId });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Agape Planning Center Helper
          </h1>
          <p className="text-muted-foreground">
            Schedule team members for your worship services
          </p>
        </div>

        <WizardNavigation
          onBack={handleBack}
          canGoBack={step > 1}
        />

        {/* Filter Summary */}
        {(selectedServiceType || selectedPlan || selectedTeam || selectedPosition) && (
          <div className="mb-6 p-4 bg-muted/50 rounded-lg border">
            <h3 className="text-sm font-semibold mb-2 text-muted-foreground">Selected Filters</h3>
            <div className="flex flex-wrap gap-2 text-sm">
              {selectedServiceType && (
                <span className="px-2 py-1 bg-background rounded border">
                  Service Type: <span className="font-medium">{selectedServiceType.name}</span>
                </span>
              )}
              {selectedPlan && (
                <span className="px-2 py-1 bg-background rounded border">
                  Plan: <span className="font-medium">{selectedPlan.title}</span>
                  {selectedPlan.sortDate && !isNaN(new Date(selectedPlan.sortDate).getTime()) && (
                    <span className="text-muted-foreground ml-1">
                      ({new Intl.DateTimeFormat("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }).format(new Date(selectedPlan.sortDate))})
                    </span>
                  )}
                </span>
              )}
              {selectedTeamGroup && (
                <span className="px-2 py-1 bg-background rounded border">
                  Team: <span className="font-medium">{selectedTeamGroup.teamName}</span>
                </span>
              )}
              {selectedPositionObj && (
                <span className="px-2 py-1 bg-background rounded border">
                  Position: <span className="font-medium">{selectedPositionObj.name}</span>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Step 1: Service Type Selection */}
        {step === 1 && (
          <ServiceTypeSelector
            selectedServiceType={selectedServiceType?.id || null}
            onSelect={handleServiceTypeSelect}
          />
        )}

        {/* Step 2: Plan/Date Selection */}
        {step === 2 && (
          <PlanDateSelector
            serviceTypeId={selectedServiceType?.id || null}
            selectedPlan={selectedPlan}
            onSelect={handlePlanSelect}
          />
        )}

        {/* Step 3: Team/Position Selection and People Display */}
        {step === 3 && (
          <div className="space-y-6">
            <PositionSelector
              serviceTypeId={selectedServiceType?.id || null}
              planId={selectedPlan?.id || null}
              seriesId={selectedPlan?.seriesId || null}
              selectedTeam={selectedTeam}
              selectedPosition={selectedPosition}
              onTeamChange={handleTeamChange}
              onPositionChange={handlePositionChange}
            />

            {selectedPosition && (
              <div className="mt-8">
                {peopleLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <Skeleton key={i} className="h-64 w-full" />
                    ))}
                  </div>
                ) : !people || people.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      No people found for this position. Make sure the position
                      has team members assigned.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <span>
                          Showing {people.length}{" "}
                          {people.length === 1 ? "person" : "people"}
                        </span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              className="inline-flex items-center justify-center rounded-full hover:bg-muted transition-colors"
                              aria-label="Learn about recommendation scores"
                            >
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80" align="start">
                            <div className="space-y-2">
                              <h4 className="font-semibold text-sm">Recommendation Scores</h4>
                              <div className="text-xs text-muted-foreground space-y-2">
                                <p>
                                  Scores are calculated based on:
                                </p>
                                <ul className="list-disc list-inside ml-2 space-y-1">
                                  <li>Past service frequency (fewer recent services = higher score)</li>
                                  <li>Time since last service (longer gap = higher score, up to 30 days)</li>
                                  <li>Upcoming scheduled services (penalties apply for services within 21 days)</li>
                                  <li>Multiple positions on the same day count as one service day</li>
                                </ul>
                                <p className="mt-2">
                                  Click the recommendation badge on each person card to see detailed reasoning, which provides an approximate evaluation of all scoring criteria.
                                </p>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {people.map((person) => (
                        <PersonCard
                          key={person.id}
                          person={person}
                          serviceTypeId={selectedServiceType?.id ?? null}
                          planId={selectedPlan?.id ?? null}
                          teamId={selectedTeam ?? null}
                          positionId={selectedPosition ?? null}
                          onScheduleSuccess={handleScheduleSuccess}
                          onScheduleError={handleScheduleError}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
