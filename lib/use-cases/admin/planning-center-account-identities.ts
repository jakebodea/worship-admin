import { pool } from "@/lib/db/pool";
import type { PlanningCenterIdentity } from "@/lib/auth/planning-center-identity";

export type StoredPlanningCenterAccountIdentity = PlanningCenterIdentity & {
  accountId: string;
  providerAccountId: string;
  fetchedAt: string;
};

type StoredPlanningCenterAccountIdentityRow = {
  account_id: string;
  provider_account_id: string;
  planning_center_user_id: string | null;
  name: string | null;
  email: string | null;
  organization_id: string | null;
  organization_name: string | null;
  fetched_at: Date;
};

export async function upsertPlanningCenterAccountIdentity(input: {
  accountId: string;
  providerAccountId: string;
  identity: PlanningCenterIdentity;
  fetchedAt?: Date;
}) {
  await pool.query(
    `
      insert into planning_center_account_identities (
        account_id,
        provider_account_id,
        planning_center_user_id,
        name,
        email,
        organization_id,
        organization_name,
        fetched_at,
        updated_at
      ) values ($1, $2, $3, $4, $5, $6, $7, coalesce($8::timestamptz, now()), now())
      on conflict (account_id) do update set
        provider_account_id = excluded.provider_account_id,
        planning_center_user_id = excluded.planning_center_user_id,
        name = excluded.name,
        email = excluded.email,
        organization_id = excluded.organization_id,
        organization_name = excluded.organization_name,
        fetched_at = excluded.fetched_at,
        updated_at = now()
    `,
    [
      input.accountId,
      input.providerAccountId,
      input.identity.sub,
      input.identity.name,
      input.identity.email,
      input.identity.organizationId,
      input.identity.organizationName,
      input.fetchedAt ?? null,
    ]
  );
}

export async function getPlanningCenterAccountIdentity(
  accountId: string
): Promise<StoredPlanningCenterAccountIdentity | null> {
  const { rows } = await pool.query<StoredPlanningCenterAccountIdentityRow>(
    `
      select
        account_id,
        provider_account_id,
        planning_center_user_id,
        name,
        email,
        organization_id,
        organization_name,
        fetched_at
      from planning_center_account_identities
      where account_id = $1
    `,
    [accountId]
  );

  const row = rows[0];
  if (!row) return null;

  return {
    accountId: row.account_id,
    providerAccountId: row.provider_account_id,
    sub: row.planning_center_user_id,
    name: row.name,
    email: row.email,
    organizationId: row.organization_id,
    organizationName: row.organization_name,
    fetchedAt: row.fetched_at.toISOString(),
  };
}
