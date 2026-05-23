import { db } from "@/lib/db";

async function main() {
  await db.execute("select 1");
  console.log("Seed complete: no baseline rows are required.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
