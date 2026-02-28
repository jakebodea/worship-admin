create table if not exists "activity_events" (
  "id" bigserial primary key,
  "created_at" timestamptz default CURRENT_TIMESTAMP not null,
  "event_type" text not null,
  "actor_user_id" text,
  "actor_account_id" text,
  "request_id" text,
  "path" text,
  "method" text,
  "ip_address" text,
  "user_agent" text,
  "success" boolean,
  "status_code" integer,
  "error_code" text,
  "service_type_id" text,
  "person_id" text,
  "plan_id" text,
  "team_id" text,
  "position_id" text,
  "metadata" jsonb default '{}'::jsonb not null
);

create index if not exists "activity_events_created_at_idx"
  on "activity_events" ("created_at" desc);

create index if not exists "activity_events_type_created_at_idx"
  on "activity_events" ("event_type", "created_at" desc);

create index if not exists "activity_events_actor_user_created_at_idx"
  on "activity_events" ("actor_user_id", "created_at" desc);
