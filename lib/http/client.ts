import { mergeHeaders } from "@/lib/http/merge-headers";

export class HttpClientError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly details?: unknown;

  constructor(message: string, status: number, code?: string, details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

async function parseError(response: Response): Promise<HttpClientError> {
  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    const message =
      typeof record.error === "string"
        ? record.error
        : `Request failed with status ${response.status}`;
    const code = typeof record.code === "string" ? record.code : undefined;
    return new HttpClientError(message, response.status, code, record.details);
  }

  return new HttpClientError(`Request failed with status ${response.status}`, response.status);
}

async function parseSuccess<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return undefined as T;
  }

  const text = await response.text();
  if (!text.trim()) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}

async function requestJson<T>(url: string, init: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  if (!response.ok) {
    throw await parseError(response);
  }
  return parseSuccess<T>(response);
}

export async function getJson<T>(url: string, init?: RequestInit): Promise<T> {
  return requestJson<T>(url, {
    method: "GET",
    ...init,
  });
}

export async function postJson<T>(
  url: string,
  body?: unknown,
  init?: Omit<RequestInit, "method" | "body">
): Promise<T> {
  const { headers: initHeaders, ...rest } = init ?? {};
  return requestJson<T>(url, {
    method: "POST",
    headers: mergeHeaders({ "Content-Type": "application/json" }, initHeaders),
    ...rest,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

export async function patchJson<T>(
  url: string,
  body?: unknown,
  init?: Omit<RequestInit, "method" | "body">
): Promise<T> {
  const { headers: initHeaders, ...rest } = init ?? {};
  return requestJson<T>(url, {
    method: "PATCH",
    headers: mergeHeaders({ "Content-Type": "application/json" }, initHeaders),
    ...rest,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

export async function deleteJson<T>(
  url: string,
  body?: unknown,
  init?: Omit<RequestInit, "method" | "body">
): Promise<T> {
  const { headers: initHeaders, ...rest } = init ?? {};
  return requestJson<T>(url, {
    method: "DELETE",
    headers: mergeHeaders({ "Content-Type": "application/json" }, initHeaders),
    ...rest,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}
