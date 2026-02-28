import { betterAuth } from "better-auth";
import { genericOAuth } from "better-auth/plugins/generic-oauth";
import { nextCookies } from "better-auth/next-js";
import { PostgresDialect } from "kysely";
import { Pool } from "pg";

const baseUrl = process.env.BETTER_AUTH_URL;
const secret = process.env.BETTER_AUTH_SECRET;
const databaseUrl = process.env.DATABASE_URL;

if (!baseUrl) {
  throw new Error("Missing BETTER_AUTH_URL environment variable");
}

if (!secret) {
  throw new Error("Missing BETTER_AUTH_SECRET environment variable");
}

if (!databaseUrl) {
  throw new Error("Missing DATABASE_URL environment variable");
}

const planningCenterClientId = process.env.PLANNING_CENTER_OAUTH_CLIENT_ID;
const planningCenterClientSecret = process.env.PLANNING_CENTER_OAUTH_CLIENT_SECRET;

if (!planningCenterClientId) {
  throw new Error("Missing PLANNING_CENTER_OAUTH_CLIENT_ID environment variable");
}

if (!planningCenterClientSecret) {
  throw new Error("Missing PLANNING_CENTER_OAUTH_CLIENT_SECRET environment variable");
}

const globalForDb = globalThis as typeof globalThis & {
  __planningCenterPgPool?: Pool;
};

const pool =
  globalForDb.__planningCenterPgPool ??
  new Pool({
    connectionString: databaseUrl,
    max: 10,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__planningCenterPgPool = pool;
}

export const auth = betterAuth({
  baseURL: baseUrl,
  secret,
  database: {
    type: "postgres",
    dialect: new PostgresDialect({
      pool,
    }),
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["planning-center"],
      updateUserInfoOnLink: true,
    },
  },
  socialProviders: {},
  plugins: [
    nextCookies(),
    genericOAuth({
      config: [
        {
          providerId: "planning-center",
          discoveryUrl:
            "https://api.planningcenteronline.com/.well-known/openid-configuration",
          clientId: planningCenterClientId,
          clientSecret: planningCenterClientSecret,
          scopes: ["openid", "services", "people"],
          // Force Planning Center to prompt for login so users can switch accounts/org context.
          prompt: "login",
          pkce: true,
          accessType: "offline",
          authentication: "basic",
          overrideUserInfo: true,
        },
      ],
    }),
  ],
});
