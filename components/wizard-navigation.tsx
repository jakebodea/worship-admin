"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface WizardNavigationProps {
  onBack?: () => void;
  canGoBack?: boolean;
}

export function WizardNavigation({
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
    </div>
  );
}
