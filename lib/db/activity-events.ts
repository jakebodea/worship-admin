import { pool } from "@/lib/db/pool";

export type ActivityEventType =
  | "schedule_attempt"
  | "auth_session_created"
  | "auth_session_deleted"
  | "auth_account_linked";

export type ActivityEventInput = {
  eventType: ActivityEventType;
  actorUserId?: string | null;
  actorAccountId?: string | null;
  requestId?: string | null;
  path?: string | null;
  method?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  success?: boolean | null;
  statusCode?: number | null;
  errorCode?: string | null;
  serviceTypeId?: string | null;
  personId?: string | null;
  planId?: string | null;
  teamId?: string | null;
  positionId?: string | null;
  metadata?: Record<string, unknown> | null;
};

type HeadersLike = {
  get: (name: string) => string | null;
};

type RequestLike = {
  method?: string;
  url?: string;
  headers?: HeadersLike;
};

type RequestContextSource =
  | RequestLike
  | {
      request?: RequestLike;
      headers?: HeadersLike;
    }
  | null
  | undefined;

export type ActivityRequestContext = {
  requestId: string | null;
  path: string | null;
  method: string | null;
  ipAddress: string | null;
  userAgent: string | null;
};

function toNullableString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function toNullableNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function getHeader(headers: HeadersLike | undefined, name: string): string | null {
  return toNullableString(headers?.get(name));
}

function pathFromUrl(url: string | undefined): string | null {
  if (!url) return null;
  try {
    return new URL(url).pathname;
  } catch {
    return null;
  }
}

export function getActivityRequestContext(source: RequestContextSource): ActivityRequestContext {
  const request =
    source && "request" in source ? source.request : (source as RequestLike | null | undefined);
  const headers =
    source && "headers" in source && source.headers
      ? source.headers
      : request?.headers;

  return {
    requestId: getHeader(headers, "x-request-id"),
    path: pathFromUrl(request?.url),
    method: toNullableString(request?.method),
    ipAddress: getHeader(headers, "x-forwarded-for") ?? getHeader(headers, "x-real-ip"),
    userAgent: getHeader(headers, "user-agent"),
  };
}

function stringifyMetadata(metadata: ActivityEventInput["metadata"]): string {
  if (!metadata) return "{}";
  try {
    return JSON.stringify(metadata);
  } catch {
    return "{}";
  }
}

export async function recordActivityEvent(input: ActivityEventInput): Promise<void> {
  await pool.query(
    `
      insert into activity_events (
        event_type,
        actor_user_id,
        actor_account_id,
        request_id,
        path,
        method,
        ip_address,
        user_agent,
        success,
        status_code,
        error_code,
        service_type_id,
        person_id,
        plan_id,
        team_id,
        position_id,
        metadata
      ) values (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17::jsonb
      )
    `,
    [
      input.eventType,
      toNullableString(input.actorUserId),
      toNullableString(input.actorAccountId),
      toNullableString(input.requestId),
      toNullableString(input.path),
      toNullableString(input.method),
      toNullableString(input.ipAddress),
      toNullableString(input.userAgent),
      typeof input.success === "boolean" ? input.success : null,
      toNullableNumber(input.statusCode),
      toNullableString(input.errorCode),
      toNullableString(input.serviceTypeId),
      toNullableString(input.personId),
      toNullableString(input.planId),
      toNullableString(input.teamId),
      toNullableString(input.positionId),
      stringifyMetadata(input.metadata),
    ]
  );
}
