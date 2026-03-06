type JsonValue = unknown;

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
  let payload: JsonValue | null = null;
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

export async function getJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    method: "GET",
    ...init,
  });
  if (!response.ok) {
    throw await parseError(response);
  }
  return response.json() as Promise<T>;
}

export async function postJson<T>(
  url: string,
  body?: unknown,
  init?: Omit<RequestInit, "method" | "body">
): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    ...init,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!response.ok) {
    throw await parseError(response);
  }
  return response.json() as Promise<T>;
}

export async function deleteJson<T>(
  url: string,
  body?: unknown,
  init?: Omit<RequestInit, "method" | "body">
): Promise<T> {
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    ...init,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!response.ok) {
    throw await parseError(response);
  }
  return response.json() as Promise<T>;
}
