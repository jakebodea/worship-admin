create table if not exists "planning_center_account_identities" (
  "account_id" text primary key references "account" ("id") on delete cascade,
  "provider_account_id" text not null,
  "planning_center_user_id" text,
  "name" text,
  "email" text,
  "organization_id" text,
  "organization_name" text,
  "fetched_at" timestamptz default CURRENT_TIMESTAMP not null,
  "created_at" timestamptz default CURRENT_TIMESTAMP not null,
  "updated_at" timestamptz default CURRENT_TIMESTAMP not null
);

create index if not exists "planning_center_account_identities_org_idx"
  on "planning_center_account_identities" ("organization_id");
