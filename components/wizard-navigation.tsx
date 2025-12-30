"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
  canGoBack?: boolean;
}

export function WizardNavigation({
  currentStep,
  totalSteps,
  onBack,
  canGoBack = false,
}: WizardNavigationProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        {canGoBack && onBack && (
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ChevronLeft className="size-4 mr-1" />
            Back
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const step = index + 1;
          return (
            <div
              key={step}
              className={cn(
                "size-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                step === currentStep
                  ? "bg-primary text-primary-foreground"
                  : step < currentStep
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
              )}
            >
              {step}
            </div>
          );
        })}
      </div>
    </div>
  );
}
