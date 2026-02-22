import type { PCResource } from "@/lib/types";

export function findIncluded(
  included: PCResource[] | undefined,
  type: string,
  id: string
): PCResource | undefined {
  return included?.find((item) => item.type === type && item.id === id);
}

export function findAllIncluded(
  included: PCResource[] | undefined,
  type: string
): PCResource[] {
  return included?.filter((item) => item.type === type) || [];
}
