import type { PCApiResponse, PCResource } from "@/lib/types";
import { mergeHeaders } from "@/lib/http/merge-headers";
import { logger } from "@/lib/logger";
import { getPlanningCenterRequestAccessToken } from "@/lib/planning-center/request-auth-context";

const log = logger.for("planning-center/core");
const PC_BASE_URL = "https://api.planningcenteronline.com";
const DEFAULT_TIMEOUT_MS = 15000;
const MAX_RETRIES = 2;
const RETRYABLE_STATUS_CODES = new Set([408, 429, 500, 502, 503, 504]);

export class PlanningCenterApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly details?: unknown;
  readonly responseBody?: string;

  constructor({
    message,
    status,
    code,
    details,
    responseBody,
  }: {
    message: string;
    status: number;
    code?: string;
    details?: unknown;
    responseBody?: string;
  }) {
    super(message);
    this.name = "PlanningCenterApiError";
    this.status = status;
    this.code = code;
    this.details = details;
    this.responseBody = responseBody;
  }
}

export class PlanningCenterCoreClient {
  constructor(
    private readonly auth?: {
      accessToken: string;
    }
  ) {}

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
    const requestAccessToken = getPlanningCenterRequestAccessToken();
    if (requestAccessToken) {
      return `Bearer ${requestAccessToken}`;
    }

    if (this.auth?.accessToken) {
      return `Bearer ${this.auth.accessToken}`;
    }

    const credentials = Buffer.from(
      `${this.getClientId()}:${this.getPat()}`
    ).toString("base64");
    return `Basic ${credentials}`;
  }

  async request(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> {
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
          headers: mergeHeaders(
            {
              Authorization: this.getAuthHeader(),
              Accept: "application/json",
            },
            options.headers
          ),
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

          throw buildApiError(response.status, errorText);
        }

        return response;
      } catch (error) {
        clearTimeout(timeout);
        lastError = error instanceof Error ? error : new Error(String(error));
        if (!isRetryableError(lastError)) {
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

  async fetch<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<PCApiResponse<T>> {
    const response = await this.request(endpoint, options);
    return response.json();
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

function buildApiError(status: number, responseBody: string): PlanningCenterApiError {
  let code: string | undefined;
  let details: unknown;
  let message = `Planning Center API error: ${status}`;

  try {
    const errorJson = JSON.parse(responseBody) as Record<string, unknown>;
    code = typeof errorJson.code === "string" ? errorJson.code : undefined;
    details = errorJson;

    const title =
      typeof errorJson.error === "string"
        ? errorJson.error
        : typeof errorJson.message === "string"
          ? errorJson.message
          : undefined;

    if (title) {
      message += ` - ${title}`;
    }
  } catch {
    if (responseBody) {
      message += ` - ${responseBody}`;
    }
  }

  return new PlanningCenterApiError({
    message,
    status,
    code,
    details,
    responseBody,
  });
}

function isRetryableError(error: Error): boolean {
  if (error instanceof PlanningCenterApiError) {
    return RETRYABLE_STATUS_CODES.has(error.status);
  }

  return error.name === "AbortError";
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
