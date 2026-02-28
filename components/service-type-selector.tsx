"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useServiceTypes } from "@/hooks/use-service-types";
import type { ServiceType } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ServiceTypeSelectorProps {
  selectedServiceType: string | null;
  onSelect: (serviceType: ServiceType) => void;
}

export function ServiceTypeSelector({
  selectedServiceType,
  onSelect,
}: ServiceTypeSelectorProps) {
  const { data: serviceTypes, isLoading } = useServiceTypes();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (!serviceTypes || serviceTypes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No service types found. Make sure your Planning Center credentials
          are configured correctly.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold mb-2">
          What type of service are you scheduling for?
        </h2>
        <p className="text-muted-foreground">
          Select a service type to continue
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {serviceTypes.map((serviceType) => (
          <Card
            key={serviceType.id}
            className={cn(
              "p-0 overflow-hidden transition-all hover:shadow-md",
              selectedServiceType === serviceType.id &&
                "ring-2 ring-primary ring-offset-2"
            )}
          >
            <Button
              type="button"
              variant="ghost"
              className="h-auto w-full items-start justify-start rounded-xl px-0 py-0 text-left hover:bg-transparent"
              onClick={() => onSelect(serviceType)}
              aria-pressed={selectedServiceType === serviceType.id}
            >
              <CardHeader>
                <CardTitle>{serviceType.name}</CardTitle>
              </CardHeader>
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
