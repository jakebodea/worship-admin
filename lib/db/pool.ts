import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("Missing DATABASE_URL environment variable");
}

const globalForDb = globalThis as typeof globalThis & {
  __planningCenterPgPool?: Pool;
};

export const pool =
  globalForDb.__planningCenterPgPool ??
  new Pool({
    connectionString: databaseUrl,
    max: 10,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__planningCenterPgPool = pool;
}
