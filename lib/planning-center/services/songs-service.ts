import type { PCResource } from "@/lib/types";
import { logger } from "@/lib/logger";
import {
  PlanningCenterApiError,
  PlanningCenterCoreClient,
} from "@/lib/planning-center/core-client";

const log = logger.for("planning-center/songs");
const DEFAULT_CATALOG_TTL_MS = 15 * 60 * 1000;
const DEFAULT_CATALOG_MAX_PAGES = 15;

type CatalogCacheEntry = {
  expiresAt: number;
  data: PCResource[];
};

export class PlanningCenterSongsService {
  private readonly catalogCache = new Map<string, CatalogCacheEntry>();

  constructor(private readonly core: PlanningCenterCoreClient) {}

  async getSongsPage(params: Record<string, string> = {}): Promise<PCResource[]> {
    return this.core.fetchAll<PCResource>("/services/v2/songs", params, 1);
  }

  async getSongsCatalogCached(
    cacheKey: string,
    options?: {
      ttlMs?: number;
      maxPages?: number;
    }
  ): Promise<PCResource[]> {
    const now = Date.now();
    const ttlMs = options?.ttlMs ?? DEFAULT_CATALOG_TTL_MS;
    const maxPages = options?.maxPages ?? DEFAULT_CATALOG_MAX_PAGES;
    const cached = this.catalogCache.get(cacheKey);

    if (cached && cached.expiresAt > now) {
      return cached.data;
    }

    const data = await this.core.fetchAll<PCResource>(
      "/services/v2/songs",
      { order: "title" },
      maxPages
    );

    this.catalogCache.set(cacheKey, {
      expiresAt: now + ttlMs,
      data,
    });

    log.info({ cacheKey, songCount: data.length }, "Songs catalog cached");
    return data;
  }

  async getSong(songId: string): Promise<PCResource> {
    const response = await this.core.fetch<PCResource>(`/services/v2/songs/${songId}`);
    return response.data;
  }

  async getSongArrangementsWithKeys(
    songId: string
  ): Promise<{ data: PCResource[]; included: PCResource[] }> {
    const response = await this.core.fetchAllWithIncluded<PCResource>(
      `/services/v2/songs/${songId}/arrangements`,
      { include: "keys" }
    );

    return response;
  }

  async getSongLastScheduledItem(
    songId: string,
    serviceTypeId: string
  ): Promise<{ data: PCResource | null; included: PCResource[] }> {
    try {
      const response = await this.core.fetch<PCResource>(
        `/services/v2/songs/${songId}/last_scheduled_item?service_type=${serviceTypeId}&include=arrangement,key`
      );

      return {
        data: response.data,
        included: response.included || [],
      };
    } catch (error) {
      if (error instanceof PlanningCenterApiError && error.status === 404) {
        return {
          data: null,
          included: [],
        };
      }
      throw error;
    }
  }
}

export const planningCenterSongsService = new PlanningCenterSongsService(
  new PlanningCenterCoreClient()
);
