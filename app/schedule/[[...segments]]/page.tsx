import { DashboardPage } from "@/components/dashboard-page";

interface SchedulePageProps {
  params: Promise<{
    segments?: string[];
  }>;
}

export default async function SchedulePage({ params }: SchedulePageProps) {
  const resolvedParams = await params;

  return <DashboardPage routeSegments={resolvedParams.segments ?? []} />;
}
