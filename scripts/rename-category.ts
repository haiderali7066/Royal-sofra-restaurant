/**
 * Rename a menu category in MongoDB – changes ONLY the `category` field.
 * Ids, slugs, photos, descriptions, prices etc. are not touched.
 *
 * Put this file at:  scripts/rename-category.ts
 *
 * Run (Node 20.6+):
 *   npx tsx --env-file=.env.local scripts/rename-category.ts --dry   # preview, changes nothing
 *   npx tsx --env-file=.env.local scripts/rename-category.ts         # apply
 *
 * Defaults rename "BBQ & Kabab Fries" -> "BBQ & Fried Kababs". For another rename:
 *   npx tsx --env-file=.env.local scripts/rename-category.ts --from="Old name" --to="New name"
 *
 * Env vars: MONGODB_URI (required), MONGODB_DB (default "royal_sofra"),
 *           MONGODB_COLLECTION (default "menu_items")
 */

import { MongoClient } from "mongodb";

const args = process.argv.slice(2);
const option = (name: string) =>
  args.find((a) => a.startsWith(`--${name}=`))?.split("=").slice(1).join("=");

const FROM = (option("from") ?? "BBQ & Kabab Fries").trim();
const TO = (option("to") ?? "BBQ & Fried Kababs").trim();
const DRY = args.includes("--dry");

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not set. Run with --env-file=.env.local (or .env).");
    process.exit(1);
  }
  if (!FROM || !TO || FROM === TO) {
    console.error("--from and --to must be different, non-empty names.");
    process.exit(1);
  }

  const dbName = process.env.MONGODB_DB ?? "royal_sofra";
  const collName = process.env.MONGODB_COLLECTION ?? "menu_items";

  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });
  try {
    await client.connect();
  } catch (err) {
    console.error("Could not connect to MongoDB: " + (err as Error).message);
    process.exit(1);
  }

  try {
    const col = client.db(dbName).collection(collName);

    // Matches the old name even if it has stray spaces around it.
    const filter = { category: { $regex: `^\\s*${escapeRegex(FROM)}\\s*$` } };

    const matches = await col
      .find(filter)
      .project({ name: 1, category: 1, _id: 0 })
      .toArray();

    console.log(`\n${dbName}.${collName}`);
    console.log(`Rename category: "${FROM}"  ->  "${TO}"`);
    console.log(`Items found: ${matches.length}`);
    for (const m of matches) console.log(`  - ${m.name}  (stored as ${JSON.stringify(m.category)})`);

    if (matches.length === 0) {
      const existing = (await col.distinct("category")) as string[];
      console.log("\nNothing to change. Categories currently in the database:");
      for (const c of existing) console.log(`  ${JSON.stringify(c)}`);
      return;
    }

    if (DRY) {
      console.log("\nDry run – nothing was changed.");
      return;
    }

    const res = await col.updateMany(filter, { $set: { category: TO } });
    console.log(`\nDone. Matched ${res.matchedCount}, modified ${res.modifiedCount}.`);
  } finally {
    await client.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
