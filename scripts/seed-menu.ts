/**
 * Royal Sofra – menu seeder (MongoDB)
 *
 * Writes every menu item straight into MongoDB, using the same fields as the
 * admin "Add menu item" form: name, description, category, price, tag,
 * spiceLevel, image, available, featured.
 *
 * Put this file at:  scripts/seed-menu.ts
 * Install once:      npm i mongodb     (skip if it is already in node_modules)
 *
 * Run (Node 20.6+; use .env or .env.local, whichever holds MONGODB_URI):
 *   npx tsx --env-file=.env.local scripts/seed-menu.ts --dry       # preview, no database needed
 *   npx tsx --env-file=.env.local scripts/seed-menu.ts --inspect   # list databases/collections + a sample document
 *   npx tsx --env-file=.env.local scripts/seed-menu.ts             # insert all items
 *
 * Flags:
 *   --only="Royal BBQ"   seed one category only
 *   --update             also overwrite items that already exist (default: leave them untouched)
 *   --json               write menu.json instead of touching the database
 *   --force              write even if existing documents have a different shape
 *
 * Env vars:
 *   MONGODB_URI          connection string (required)
 *   MONGODB_DB           database name (default "royal_sofra")
 *   MONGODB_COLLECTION   collection name (default "menu_items")
 *   MENU_PLACEHOLDER_IMAGE  optional image URL used for every item until you upload real photos
 *
 * Safe to re-run: items are matched by slug, so nothing is duplicated.
 */

import { writeFileSync } from "node:fs";
import { MongoClient } from "mongodb";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type Category =
  | "Appetizers"
  | "Pakistani Handi"
  | "Special Karahi"
  | "BBQ & Kabab Fries"
  | "Royal Shinwari"
  | "Royal BBQ"
  | "Chinese"
  | "Platters"
  | "Bar & Shakes"
  | "Drinks"
  | "Ice Cream"
  | "Tandoor";

type SpiceLevel = "Mild" | "Medium" | "Hot";

type MenuItem = {
  name: string;
  description: string;
  category: Category;
  price: number; // Rs.
  tag?: string;
  spiceLevel?: SpiceLevel;
  image?: string; // URL or path your API accepts; leave empty to upload later
  available: boolean;
  featured: boolean;
};

type Input = Omit<MenuItem, "category" | "available" | "featured" | "description"> &
  Partial<Pick<MenuItem, "description" | "available" | "featured">>;

/* ------------------------------------------------------------------ */
/* Builders                                                            */
/* ------------------------------------------------------------------ */

const make = (category: Category, items: Input[]): MenuItem[] =>
  items.map((i) => ({
    description: "",
    available: true,
    featured: false,
    ...i,
    category,
  }));

/** Creates "<name> (Half)" and "<name> (Full)" items. */
const halfFull = (
  name: string,
  half: number,
  full: number,
  extra: Partial<Input> = {}
): Input[] => [
  { name: `${name} (Half)`, price: half, ...extra },
  { name: `${name} (Full)`, price: full, ...extra },
];

/** Creates one item per flavour, all at the same price. */
const group = (
  flavours: string[],
  price: number,
  nameOf: (flavour: string) => string
): Input[] => flavours.map((f) => ({ name: nameOf(f), price }));

/* ------------------------------------------------------------------ */
/* Menu data                                                           */
/* ------------------------------------------------------------------ */

const menu: MenuItem[] = [
  /* 1. Appetizers */
  ...make("Appetizers", [
    {
      name: "Signature Special Soup",
      description:
        "A rich house-special recipe, crafted with premium ingredients and bold flavors",
      price: 430,
      tag: "Signature",
    },
    {
      name: "Hot & Sour Soup",
      description:
        "A perfect balance of spicy, tangy and comforting flavours, served piping hot",
      price: 449,
    },
    {
      name: "Chicken Corn Soup",
      description:
        "Tender chicken, sweet corn, and delicate egg ribbons, served with crispy crackers",
      price: 399,
    },
    {
      name: "Garden Salad",
      description: "Fresh seasonal vegetables with a light dressing",
      price: 180,
    },
    ...halfFull("Russian Salad", 299, 599, {
      description:
        "A classic creamy salad with fresh vegetables & fruit",
    }),
    {
      name: "Waldorf Salad",
      description:
        "Fresh apples, walnuts & crisp vegetables in a signature dressing",
      price: 510,
    },
    {
      name: "Kachumber Salad",
      description:
        "Finely diced cucumbers, tomatoes & onions tossed in a tangy lemon dressing",
      price: 350,
    },
    {
      name: "Mint Raita",
      description:
        "A refreshing, cooling yogurt dip infused with fresh mint and mild spices",
      price: 130,
    },
    {
      name: "Zeera Raita",
      description:
        "A cooling yogurt dip lightly spiced with roasted cumin seeds",
      price: 180,
    },
  ]),

  /* 2. Pakistani Handi */
  ...make("Pakistani Handi", [
    { name: "Rajasthani Handi", price: 1630 },
    { name: "Chicken Cheese Handi", price: 1550 },
    { name: "Chicken Boneless Handi", price: 1530, tag: "Signature" },
    { name: "Chicken Achari Handi", price: 1599 },
    { name: "Chicken White Handi", price: 1599, tag: "Signature" },
    { name: "Madrasi Handi", price: 1599 },
    { name: "Mughlai Handi", price: 1599 },
    { name: "Chicken Palak Paneer", price: 1630 },
    { name: "Beef Palak Paneer", price: 1630 },
    { name: "Mix Vegetable", price: 799 },
    { name: "Dal Mash Makhni", price: 799 },
  ]),

  /* 3. Special Karahi */
  ...make("Special Karahi", [
    { name: "Shahi Chicken Karahi", price: 1899 },
    ...halfFull("Chicken Karahi Makhni", 1299, 2290),
    ...halfFull("Mutton Karahi Makhni", 2399, 4599),
    // Menu lists "Rs. 1,799 / Rs. 3,399" – treated as Half / Full.
    ...halfFull("Batera Karahi", 1799, 3399),
    { name: "Chicken Lahori Karahi", price: 2399 },
    { name: "Chicken White Karahi", price: 2399 },
    { name: "Chicken Tikka Karahi", price: 2199 },
  ]),

  /* 4. Tikka / Kabab Fries (BBQ) */
  ...make("BBQ & Kabab Fries", [
    { name: "Chicken Boti Fry", price: 2760 },
    { name: "Chicken Seekh Kabab Fry", price: 1499 },
    { name: "Beef Seekh Kabab Fry", price: 1699 },
    { name: "Beef Tikka Fry", price: 1699 },
  ]),

  /* 5. Royal Shanwari */
  ...make("Royal Shinwari", [
    ...halfFull("Shinwari Namkeen Karahi", 2099, 4199),
    { name: "Namkeen Tikka", price: 4199 },
    ...halfFull("Shinwari Chicken Karahi", 999, 1999),
    { name: "Sulmani Karahi", price: 4199 },
  ]),

  /* 6. Royal BBQ */
  ...make("Royal BBQ", [
    { name: "Chicken Boti", price: 1299 },
    { name: "Malai Boti", price: 1499 },
    { name: "Kastoori Boti", price: 1499 },
    { name: "Achari Boti", price: 1499 },
    { name: "Hariyali Boti", price: 1499 },
    { name: "Afghani Boti", price: 1399 },
    { name: "Chicken Piece (Leg / Chest)", price: 499 },
    { name: "Royal Reshmi Kabab", price: 1399 },
    { name: "Chicken Cheese Kabab", price: 1450 },
    { name: "Chicken Gola Kabab", price: 899 },
    { name: "Chicken Angara", price: 1299 },
    { name: "Batera Grill", price: 300 },
    { name: "Beef Kabab / Tikka", price: 1299 },
    { name: "Beef Gola Kabab", price: 999 },
    { name: "Traditional Slow-Roasted Chicken", price: 1950 },
    { name: "Spiced Steamed & Fried Chicken", price: 1299 },
  ]),

  /* 7. Chinese */
  ...make("Chinese", [
    { name: "Chicken Manchurian", price: 1399 },
    { name: "Chicken Chow Mein", price: 799 },
    { name: "Vegetable Chow Mein", price: 699 },
    { name: "Chicken Masala Rice", price: 899 },
    { name: "Chicken Fried Rice", price: 799 },
    { name: "Vegetable Rice", price: 699 },
    { name: "Egg Rice", price: 699 },
    { name: "Chicken Shashlik", price: 1399 },
    { name: "Chicken Jalfrezi", price: 1299 },
    { name: "Chicken Ginger", price: 1299 },
  ]),

  /* 8. Platters */
  ...make("Platters", [
    { name: "Royal Grand Feast", description: "Serves 5–7 persons", price: 12999 },
    { name: "Sofra Family Feast", description: "Serves 4–5 persons", price: 6999 },
    { name: "Royal Sofra Special", description: "Serves 3–4 persons", price: 4499 },
    { name: "Shahi Platter", description: "Serves 2–3 persons", price: 3999 },
    { name: "Economy Platter", price: 2499 },
    { name: "Sofra Special Kabuli Pulao", price: 1099 },
  ]),

  /* 9. Bar & Shakes */
  ...make("Bar & Shakes", [
    ...group(
      ["Mint", "Strawberry", "Peach", "Pineapple", "Blue Lagoon", "Apple"],
      399,
      (f) => `${f} Margarita`
    ),
    ...group(
      ["Blueberry", "Pineapple", "Strawberry"],
      450,
      (f) => `${f} Mojito`
    ),
    ...group(
      ["Strawberry Colada", "Mango Colada", "Peach Colada", "Pina Colada"],
      599,
      (f) => f
    ),
    ...group(["Sweet", "Namkeen", "Simple"], 299, (f) => `${f} Lassi`),
    ...group(
      ["Vanilla", "Chocolate", "Caramel"],
      499,
      (f) => `${f} Cold Coffee`
    ),
    ...group(
      ["Kulfa", "Pista", "Mango", "Strawberry", "Vanilla", "Chocolate"],
      550,
      (f) => `${f} Ice Cream Shake`
    ),
    ...group(
      ["Apple & Banana", "Strawberry", "Mango", "Peach"],
      350,
      (f) => `${f} Fresh Shake`
    ),
    ...group(
      ["Oreo", "Nutella", "Mars", "KitKat"],
      499,
      (f) => `${f} Special Shake`
    ),
    ...group(
      ["Cappuccino", "Latte", "Black Coffee", "Hot Chocolate"],
      499,
      (f) => f
    ),
  ]),

  /* 10. Drinks */
  ...make("Drinks", [
    { name: "250 ml Can", price: 160 },
    { name: "Mineral Water (Small)", price: 80 },
    { name: "Mineral Water (Large)", price: 160 },
    { name: "Soft Drink", price: 99 },
    { name: "Soft Drink (1.5 Liter)", price: 240 },
  ]),

  /* 11. Ice Cream */
  ...make("Ice Cream", [
    { name: "2 Scoops Ice Cream", price: 230 },
    { name: "3 Scoops Ice Cream", price: 330 },
    { name: "2 Scoops Tutti Fruity", price: 250 },
    { name: "Half Liter Ice Cream", price: 620 },
    { name: "One Liter Ice Cream", price: 1200 },
    { name: "Royal Special Ice Cream", price: 399 },
  ]),

  /* 12. Tandoor */
  ...make("Tandoor", [
    { name: "Tandoor (Per Head)", price: 99 },
    { name: "Roghani Naan", price: 120 },
    { name: "Kalonji Naan", price: 180 },
    { name: "Plain Naan", price: 30 },
    { name: "Tandoori Roti", price: 17 },
  ]),
];

/* ------------------------------------------------------------------ */
/* Document mapping – rename fields here if your schema differs        */
/* (run with --inspect to see what an existing document looks like)    */
/* ------------------------------------------------------------------ */

const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const ID_BASE = Date.now();

/** Matches the shape of items created by the admin panel: id "itm-<timestamp>" + slug. */
function toDoc(item: MenuItem, index: number) {
  return {
    id: `itm-${ID_BASE + index}`,
    slug: slugify(item.name),
    name: item.name,
    description: item.description,
    category: item.category,
    price: item.price,
    tag: item.tag ?? "",
    spiceLevel: item.spiceLevel ?? "",
    image: item.image ?? process.env.MENU_PLACEHOLDER_IMAGE ?? "",
    available: item.available,
    featured: item.featured,
  };
}

/* ------------------------------------------------------------------ */
/* Runner                                                              */
/* ------------------------------------------------------------------ */

const args = process.argv.slice(2);
const flag = (name: string) => args.includes(`--${name}`);
const option = (name: string) =>
  args.find((a) => a.startsWith(`--${name}=`))?.split("=").slice(1).join("=");

function dbNameFromUri(uri: string): string | undefined {
  try {
    const name = new URL(uri.replace(/^mongodb(\+srv)?:/, "https:")).pathname.slice(1);
    return name || undefined;
  } catch {
    return undefined;
  }
}

async function inspect(client: MongoClient, fallbackDb?: string) {
  let dbNames: string[] = [];
  try {
    const { databases } = await client.db().admin().listDatabases();
    dbNames = databases
      .map((d) => d.name)
      .filter((n) => !["admin", "local", "config"].includes(n));
  } catch {
    if (fallbackDb) dbNames = [fallbackDb];
  }
  if (dbNames.length === 0) console.log("No databases visible to this user.");

  for (const name of dbNames) {
    console.log(`\nDatabase: ${name}`);
    const cols = await client.db(name).listCollections().toArray();
    if (cols.length === 0) console.log("  (no collections)");
    for (const c of cols) {
      const col = client.db(name).collection(c.name);
      const count = await col.estimatedDocumentCount();
      console.log(`  ${c.name}  (${count} docs)`);
      if (/^(user|users|account|accounts|session|sessions|verification|verifications)$/i.test(c.name)) {
        console.log("    (sample hidden – auth data)");
        continue;
      }
      const sample = await col.findOne();
      if (sample) {
        console.log("    sample:\n" + JSON.stringify(sample, null, 2).replace(/^/gm, "      "));
      }
    }
  }
}

async function main() {
  const only = option("only");
  const items = only ? menu.filter((m) => m.category === only) : menu;

  if (items.length === 0) {
    console.error(`No items found for category "${only}".`);
    process.exit(1);
  }

  // Category summary
  const counts = new Map<string, number>();
  for (const i of items) counts.set(i.category, (counts.get(i.category) ?? 0) + 1);

  if (!flag("inspect")) {
    console.log(`\nRoyal Sofra menu: ${items.length} items`);
    for (const [c, n] of counts) console.log(`  ${c.padEnd(20)} ${n}`);
    console.log("");
  }

  if (flag("json")) {
    writeFileSync("menu.json", JSON.stringify(items.map(toDoc), null, 2));
    console.log("Wrote menu.json");
    return;
  }

  if (flag("dry")) {
    for (const i of items) {
      console.log(`${i.category.padEnd(20)} ${i.name.padEnd(40)} Rs. ${i.price}`);
    }
    console.log("\nDry run – nothing was written.");
    return;
  }

  /* ---- database ---- */
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not set. Run with --env-file=.env.local (or .env).");
    process.exit(1);
  }

  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });
  try {
    await client.connect();
  } catch (err) {
    const e = err as Error;
    console.error("Could not connect to MongoDB:");
    console.error("  " + e.message);
    console.error("\nCheck: username/password, that special characters in the password are");
    console.error("URL-encoded, and that your IP is allowed in Atlas > Network Access.");
    process.exit(1);
  }

  try {
    const dbName = process.env.MONGODB_DB ?? dbNameFromUri(uri) ?? "royal_sofra";

    if (flag("inspect")) {
      await inspect(client, dbName);
      return;
    }

    if (!dbName) {
      console.error("Your MONGODB_URI has no database name. Set MONGODB_DB in the env file,");
      console.error("or run with --inspect to see which databases and collections exist.");
      process.exit(1);
    }

    const collName = process.env.MONGODB_COLLECTION ?? "menu_items";
    const col = client.db(dbName).collection(collName);
    const overwrite = flag("update");
    const now = new Date();

    console.log(`Writing to ${dbName}.${collName}${overwrite ? " (overwriting existing)" : ""}\n`);

    // Slugs must be unique.
    const seen = new Set<string>();
    for (const item of items) {
      const slug = slugify(item.name);
      if (seen.has(slug)) {
        console.error(`Duplicate slug "${slug}" – rename one of the items.`);
        process.exit(1);
      }
      seen.add(slug);
    }

    // Compare against an existing document so a field-name mismatch is caught before writing.
    const existing = await col.findOne({});
    if (existing && !flag("force")) {
      const ignore = new Set(["_id", "__v", "createdAt", "updatedAt"]);
      const theirs = Object.keys(existing).filter((k) => !ignore.has(k));
      const ours = Object.keys(toDoc(items[0], 0));
      const missing = theirs.filter((k) => !ours.includes(k));
      const extra = ours.filter((k) => !theirs.includes(k));
      if (missing.length || extra.length) {
        console.error("Existing documents have a different shape than this script writes:");
        if (missing.length) console.error(`  fields in your database the script does not write: ${missing.join(", ")}`);
        if (extra.length) console.error(`  fields the script writes that your documents do not have: ${extra.join(", ")}`);
        console.error("\nRename/add fields in toDoc() to match, or re-run with --force to write anyway.");
        process.exit(1);
      }
    }

    const ops = items.map((item, idx) => {
      const doc = toDoc(item, idx);
      return {
        updateOne: {
          filter: { slug: doc.slug },
          update: overwrite
            ? { $set: { ...doc, updatedAt: now }, $setOnInsert: { createdAt: now } }
            : { $setOnInsert: { ...doc, createdAt: now, updatedAt: now } },
          upsert: true,
        },
      };
    });

    const res = await col.bulkWrite(ops, { ordered: false });
    const skipped = items.length - res.upsertedCount - (overwrite ? res.modifiedCount : 0);
    console.log(`Done. Inserted ${res.upsertedCount}` +
      (overwrite ? `, updated ${res.modifiedCount}` : "") +
      `, already existed ${Math.max(skipped, 0)}.`);
  } catch (err) {
    console.error("Write failed: " + (err as Error).message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});