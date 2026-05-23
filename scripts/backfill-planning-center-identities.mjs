import fs from "node:fs";
import { Pool } from "pg";

function loadEnvFile(path) {
  if (!fs.existsSync(path)) return;
  for (const line of fs.readFileSync(path, "utf8").split(/\r?\n/)) {
    if (!line || line.trim().startsWith("#")) continue;
    const separator = line.indexOf("=");
    if (separator === -1) continue;
    const key = line.slice(0, separator);
    const value = line.slice(separator + 1);
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(".env.local");

const databaseUrl = process.env.DATABASE_URL;
const clientId = process.env.PLANNING_CENTER_OAUTH_CLIENT_ID;
const clientSecret = process.env.PLANNING_CENTER_OAUTH_CLIENT_SECRET;

if (!databaseUrl) throw new Error("Missing DATABASE_URL");
if (!clientId) throw new Error("Missing PLANNING_CENTER_OAUTH_CLIENT_ID");
if (!clientSecret) throw new Error("Missing PLANNING_CENTER_OAUTH_CLIENT_SECRET");

const pool = new Pool({ connectionString: databaseUrl });
const tokenEndpoint = "https://api.planningcenteronline.com/oauth/token";
const userinfoEndpoint = "https://api.planningcenteronline.com/oauth/userinfo";

function normalizeIdentity(payload) {
  if (!payload || typeof payload !== "object") return null;
  return {
    sub: typeof payload.sub === "string" ? payload.sub : null,
    name: typeof payload.name === "string" ? payload.name : null,
    email: typeof payload.email === "string" ? payload.email : null,
    organizationId:
      typeof payload.organization_id === "string" ? payload.organization_id : null,
    organizationName:
      typeof payload.organization_name === "string" ? payload.organization_name : null,
  };
}

async function refreshAccessToken(refreshToken) {
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body,
  });

  if (!response.ok) {
    throw new Error(`refresh failed: ${response.status} ${await response.text()}`);
  }

  return response.json();
}

async function fetchIdentity(accessToken) {
  const response = await fetch(userinfoEndpoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`userinfo failed: ${response.status} ${await response.text()}`);
  }

  return normalizeIdentity(await response.json());
}

async function upsertIdentity(account, identity) {
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
      ) values ($1, $2, $3, $4, $5, $6, $7, now(), now())
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
      account.id,
      account.accountId,
      identity.sub,
      identity.name,
      identity.email,
      identity.organizationId,
      identity.organizationName,
    ]
  );
}

async function updateAccountTokens(account, token) {
  const accessTokenExpiresAt =
    typeof token.expires_in === "number"
      ? new Date(Date.now() + token.expires_in * 1000)
      : account.accessTokenExpiresAt;
  const refreshToken = typeof token.refresh_token === "string" ? token.refresh_token : account.refreshToken;

  await pool.query(
    `
      update account
      set
        "accessToken" = $2,
        "refreshToken" = $3,
        "accessTokenExpiresAt" = $4,
        "updatedAt" = now()
      where id = $1
    `,
    [account.id, token.access_token, refreshToken, accessTokenExpiresAt]
  );
}

async function main() {
  await pool.query(`
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
    )
  `);
  await pool.query(`
    create index if not exists "planning_center_account_identities_org_idx"
      on "planning_center_account_identities" ("organization_id")
  `);

  const { rows: accounts } = await pool.query(`
    select
      a.id,
      a."accountId",
      a."accessToken",
      a."refreshToken",
      a."accessTokenExpiresAt",
      u.email as user_email
    from account a
    join "user" u on u.id = a."userId"
    where a."providerId" = 'planning-center'
    order by u.email, a."updatedAt" desc
  `);

  for (const account of accounts) {
    try {
      let accessToken = account.accessToken;
      if (!accessToken || !account.accessTokenExpiresAt || account.accessTokenExpiresAt <= new Date()) {
        if (!account.refreshToken) throw new Error("no refresh token");
        const refreshed = await refreshAccessToken(account.refreshToken);
        accessToken = refreshed.access_token;
        await updateAccountTokens(account, refreshed);
      }

      const identity = await fetchIdentity(accessToken);
      if (!identity) throw new Error("empty identity");
      await upsertIdentity(account, identity);
      console.log(`${account.user_email} ${account.accountId}: ${identity.organizationName ?? "unknown"} (${identity.organizationId ?? "no org id"})`);
    } catch (error) {
      console.warn(`${account.user_email} ${account.accountId}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

main()
  .finally(async () => {
    await pool.end();
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
