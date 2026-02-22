import type { PCApiResponse, PCResource } from "@/lib/types";
import { logger } from "@/lib/logger";

const log = logger.for("planning-center/core");
const PC_BASE_URL = "https://api.planningcenteronline.com";
const DEFAULT_TIMEOUT_MS = 15000;
const MAX_RETRIES = 2;
const RETRYABLE_STATUS_CODES = new Set([408, 429, 500, 502, 503, 504]);

export class PlanningCenterCoreClient {
  private getClientId(): string {
    const id = process.env.PLANNING_CENTER_CLIENT;
    if (!id) {
      throw new Error("Missing PLANNING_CENTER_CLIENT environment variable");
    }
    return id;
  }

  private getPat(): string {
    const pat = process.env.PLANNING_CENTER_PAT;
    if (!pat) {
      throw new Error("Missing PLANNING_CENTER_PAT environment variable");
    }
    return pat;
  }

  private getAuthHeader(): string {
    const credentials = Buffer.from(
      `${this.getClientId()}:${this.getPat()}`
    ).toString("base64");
    return `Basic ${credentials}`;
  }

  async fetch<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<PCApiResponse<T>> {
    const url = endpoint.startsWith("http")
      ? endpoint
      : `${PC_BASE_URL}${endpoint}`;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
          headers: {
            Authorization: this.getAuthHeader(),
            Accept: "application/json",
            ...options.headers,
          },
        });
        clearTimeout(timeout);

        if (!response.ok) {
          const errorText = await response.text();
          const canRetry =
            RETRYABLE_STATUS_CODES.has(response.status) && attempt < MAX_RETRIES;
          if (canRetry) {
            log.debug(
              { status: response.status, attempt: attempt + 1, url: url.replace(/\/$/, "").slice(-80) },
              "Planning Center API retry"
            );
            await sleep((attempt + 1) * 300);
            continue;
          }

          let errorMessage = `Planning Center API error: ${response.status}`;
          try {
            const errorJson = JSON.parse(errorText);
            errorMessage += ` - ${JSON.stringify(errorJson)}`;
          } catch {
            errorMessage += ` - ${errorText}`;
          }
          throw new Error(errorMessage);
        }

        return response.json();
      } catch (error) {
        clearTimeout(timeout);
        lastError = error instanceof Error ? error : new Error(String(error));
        if (
          lastError.message.startsWith("Planning Center API error:") &&
          !lastError.message.startsWith("Planning Center API error: 408") &&
          !lastError.message.startsWith("Planning Center API error: 429") &&
          !lastError.message.startsWith("Planning Center API error: 500") &&
          !lastError.message.startsWith("Planning Center API error: 502") &&
          !lastError.message.startsWith("Planning Center API error: 503") &&
          !lastError.message.startsWith("Planning Center API error: 504")
        ) {
          break;
        }
        const canRetry = attempt < MAX_RETRIES;
        if (!canRetry) break;
        log.debug(
          { attempt: attempt + 1, error: lastError.message.slice(0, 100) },
          "Planning Center request failed, retrying"
        );
        await sleep((attempt + 1) * 300);
      }
    }

    throw lastError || new Error("Planning Center API request failed");
  }

  buildUrl(endpoint: string, params: Record<string, string> = {}): string {
    const url = new URL(endpoint, PC_BASE_URL);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    return url.toString();
  }

  async fetchAll<T>(
    endpoint: string,
    params: Record<string, string> = {},
    maxPages: number = 10
  ): Promise<T[]> {
    const allData: T[] = [];
    let url = this.buildUrl(endpoint, { ...params, per_page: "100" });
    let hasMore = true;
    let pageCount = 0;

    while (hasMore && pageCount < maxPages) {
      pageCount++;
      const response = await this.fetch<T[] | T>(url);
      const data = Array.isArray(response.data) ? response.data : [response.data];
      allData.push(...data);

      const nextUrl = response.links?.next;
      if (nextUrl && nextUrl !== url) {
        url = nextUrl;
      } else {
        hasMore = false;
      }
    }

    return allData;
  }

  async fetchAllWithIncluded<T>(
    endpoint: string,
    params: Record<string, string> = {},
    maxPages: number = 5
  ): Promise<{ data: T[]; included: PCResource[] }> {
    const allData: T[] = [];
    const allIncluded: PCResource[] = [];
    const seenIncluded = new Set<string>();
    let url = this.buildUrl(endpoint, { ...params, per_page: "100" });
    let hasMore = true;
    let pageCount = 0;

    while (hasMore && pageCount < maxPages) {
      pageCount++;
      const response = await this.fetch<T[] | T>(url);
      const data = Array.isArray(response.data) ? response.data : [response.data];
      allData.push(...data);

      for (const resource of response.included || []) {
        const key = `${resource.type}:${resource.id}`;
        if (!seenIncluded.has(key)) {
          seenIncluded.add(key);
          allIncluded.push(resource);
        }
      }

      const nextUrl = response.links?.next;
      if (nextUrl && nextUrl !== url) {
        url = nextUrl;
      } else {
        hasMore = false;
      }
    }

    return { data: allData, included: allIncluded };
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
