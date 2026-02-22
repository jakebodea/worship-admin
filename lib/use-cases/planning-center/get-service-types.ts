import { planningCenterCatalogService } from "@/lib/planning-center/services/catalog-service";
import { isServiceExcluded } from "@/lib/excluded-services";
import type { RawServiceType, ServiceType } from "@/lib/types";

export async function getServiceTypes(): Promise<ServiceType[]> {
  const rawServiceTypes = await planningCenterCatalogService.getServiceTypes();
  const activeRawServiceTypes = rawServiceTypes.filter((raw) => {
    const archivedAt = (raw.attributes.archived_at as string | null) || null;
    return !archivedAt;
  });

  const serviceTypes: ServiceType[] = activeRawServiceTypes
    .map((raw) => {
      const st = raw as unknown as RawServiceType;
      return {
        id: st.id,
        name: st.attributes.name as string,
        sequence: st.attributes.sequence as number,
      };
    })
    .filter((st) => !isServiceExcluded(st.id));

  serviceTypes.sort((a, b) => a.sequence - b.sequence);
  return serviceTypes;
}
