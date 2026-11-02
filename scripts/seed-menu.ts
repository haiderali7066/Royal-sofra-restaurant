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
 *   --auto-images        find online photos and save them on the items in one run
 *   --find-images        search online photos for every item (no database needed)
 *   --apply-images       save the links from menu-images.json on the items (add --rehost for Cloudinary)
 *   --images             attach photos to items already in the database (see below)
 *   --dir=PATH           folder with photos for --images (default scripts/menu-images)
 *
 * Env vars:
 *   MONGODB_URI          connection string (required)
 *   MONGODB_DB           database name (default "royal_sofra")
 *   MONGODB_COLLECTION   collection name (default "menu_items")
 *   MENU_PLACEHOLDER_IMAGE  image used when an item has no photo (default /images/menu-placeholder.png,
 *                           a file in your public/ folder)
 *   CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET   needed by --images
 *
 * Online photos (no files needed):
 *   1. --find-images   searches for a photo per item, writes menu-images.json and
 *                      menu-images-review.html (open it to check every match)
 *   2. edit menu-images.json if any photo is wrong (swap the "url", or use an "alternatives" entry)
 *   3. --apply-images  saves those links on the items in the database
 *                      add --rehost to copy each photo into your Cloudinary first (more reliable)
 *   One-step version:  --auto-images  (find + save in a single run, no review step)
 *   Search provider (works with no key at all; keys only improve the match):
 *     (no key)         Wikimedia Commons, free, openly licensed photos
 *     PEXELS_API_KEY   free stock photos from pexels.com
 *     SERPER_API_KEY   Google image results via serper.dev (paid, best match for local dishes)
 *   IMAGE_PROVIDER=wikimedia|pexels|serper forces one.
 *   Items with no photo found get the placeholder image, so image is never empty.
 *
 * Photos from your own files: put files named after the item slug in scripts/menu-images, e.g.
 *   chicken-boneless-handi.jpg, hot-and-sour-soup.webp, mint-margarita.png
 * then run with --images. Each photo is uploaded to Cloudinary (folder royal-sofra/menu)
 * and its URL is saved on the matching item. The script also writes
 * menu-images-needed.txt listing the file names still missing.
 *
 * Safe to re-run: items are matched by slug, so nothing is duplicated.
 * To apply changed descriptions / spice levels / homepage picks to items that are
 * already in the database, re-run with --update (photos and ids are kept).
 */

import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { basename, extname, join } from "node:path";
import { MongoClient, type Collection } from "mongodb";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type Category =
  | "Appetizers"
  | "Pakistani Handi"
  | "Special Karahi"
  | "BBQ & Fried Kababs"
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

const baseMenu: MenuItem[] = [
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
  ...make("BBQ & Fried Kababs", [
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
/* Image search queries                                                */
/* ------------------------------------------------------------------ */

/** Added to the item name when searching. */
const CATEGORY_HINT: Partial<Record<Category, string>> = {
  "Pakistani Handi": "pakistani",
  "Special Karahi": "pakistani",
  "Royal Shinwari": "peshawari",
  "Royal BBQ": "bbq",
  "Bar & Shakes": "drink",
  "Ice Cream": "dessert",
};

/** Items whose name alone would find the wrong thing. Key = slug. */
const QUERY_OVERRIDES: Record<string, string> = {
  "signature-special-soup": "chicken soup bowl restaurant",
  "royal-grand-feast": "pakistani bbq mixed grill platter large",
  "sofra-family-feast": "pakistani family platter bbq karahi naan",
  "royal-sofra-special": "pakistani bbq mixed platter",
  "shahi-platter": "pakistani mixed grill platter",
  "economy-platter": "bbq platter tikka kabab naan",
  "sofra-special-kabuli-pulao": "kabuli pulao",
  "tandoor-per-head": "tandoori naan roti",
  "250-ml-can": "soft drink can 250ml",
  "mineral-water-small": "small mineral water bottle",
  "mineral-water-large": "large mineral water bottle",
  "soft-drink": "soft drink glass cola ice",
  "soft-drink-1-5-liter": "1.5 liter soft drink bottle",
  "royal-special-ice-cream": "ice cream sundae",
  "half-liter-ice-cream": "ice cream tub half liter",
  "one-liter-ice-cream": "ice cream tub one liter",
  "chicken-piece-leg-chest": "grilled chicken leg piece",
  "batera-grill": "quail bbq grilled",
  "batera-karahi-half": "quail karahi",
  "batera-karahi-full": "quail karahi",
  "traditional-slow-roasted-chicken": "slow roasted whole chicken",
  "spiced-steamed-and-fried-chicken": "spiced fried chicken",
  "royal-reshmi-kabab": "reshmi kabab",
  "chicken-angara": "chicken angara tikka",
  "rajasthani-handi": "rajasthani chicken handi",
  "namkeen-tikka": "namkeen tikka peshawari",
  "sulmani-karahi": "namkeen mutton karahi peshawari",
};

function imageQuery(item: MenuItem): string {
  const override = QUERY_OVERRIDES[slugify(item.name)];
  if (override) return override;
  const base = item.name.replace(/\((half|full)\)/i, "").replace(/\s+/g, " ").trim();
  return `${base} ${CATEGORY_HINT[item.category] ?? ""}`.trim();
}

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

/** Used whenever an item has no photo, so the image field is never empty. */
const PLACEHOLDER_IMAGE = process.env.MENU_PLACEHOLDER_IMAGE || "/images/menu-placeholder.png";

/** Mongo filter: item has no real photo (empty, missing or still the placeholder). */
const NO_PHOTO = {
  $or: [{ image: "" }, { image: PLACEHOLDER_IMAGE }, { image: { $exists: false } }],
};

/** Your admin stores spice level as a number: Mild = 1, Medium = 2, Hot = 3. */
const SPICE_NUMBER: Record<SpiceLevel, number> = { Mild: 1, Medium: 2, Hot: 3 };
const DEFAULT_SPICE_LEVEL = 1;
/**
 * Categories that should save spiceLevel 0 (no chili icon). Left empty on purpose:
 * 0 is not something the admin form can produce, so only use it if your site handles it,
 * e.g. ["Drinks", "Ice Cream", "Bar & Shakes"].
 */
const NO_SPICE_CATEGORIES: Category[] = [];

/* ------------------------------------------------------------------ */
/* Descriptions, spice levels and homepage picks                       */
/* (keyed by slug; "-half" / "-full" variants share one entry)         */
/* ------------------------------------------------------------------ */

const DESCRIPTIONS: Record<string, string> = {
  // Pakistani Handi
  "rajasthani-handi": "Chicken handi slow-cooked in a bold, fiery Rajasthani-style masala.",
  "chicken-cheese-handi": "Creamy chicken handi finished with melted cheese.",
  "chicken-boneless-handi": "Boneless chicken cooked slowly in a rich, aromatic handi gravy.",
  "chicken-achari-handi": "Tender chicken in a tangy gravy spiced with pickling spices.",
  "chicken-white-handi": "Tender chicken in a smooth, creamy white gravy.",
  "madrasi-handi": "Chicken handi in a hot, bold Madras-style masala.",
  "mughlai-handi": "Rich, mildly spiced Mughlai-style chicken handi in a creamy gravy.",
  "chicken-palak-paneer": "Chicken and paneer in a smooth, spiced spinach gravy.",
  "beef-palak-paneer": "Tender beef and paneer in a smooth, spiced spinach gravy.",
  "mix-vegetable": "Seasonal vegetables cooked in a lightly spiced masala.",
  "dal-mash-makhni": "Slow-cooked urad dal finished with butter and cream.",

  // Special Karahi
  "shahi-chicken-karahi": "Chicken karahi in a rich, royal-style gravy with bold spices.",
  "chicken-karahi-makhni": "Chicken karahi in a buttery, tomato-based makhni gravy.",
  "mutton-karahi-makhni": "Tender mutton karahi in a buttery, tomato-based makhni gravy.",
  "batera-karahi": "Quail cooked karahi-style with tomatoes, ginger and green chillies.",
  "chicken-lahori-karahi": "Lahori-style chicken karahi with tomatoes, ginger and green chillies.",
  "chicken-white-karahi": "Chicken karahi in a creamy white gravy with mild spices.",
  "chicken-tikka-karahi": "Smoky chicken tikka pieces tossed in a spiced karahi masala.",

  // BBQ & Fried Kababs
  "chicken-boti-fry": "Chicken boti pan-fried with onions and spices.",
  "chicken-seekh-kabab-fry": "Chicken seekh kababs fried with onions and spices.",
  "beef-seekh-kabab-fry": "Beef seekh kababs fried with onions and spices.",
  "beef-tikka-fry": "Beef tikka pieces stir-fried with onions and spices.",

  // Royal Shinwari
  "shinwari-namkeen-karahi": "Peshawari namkeen karahi, cooked simply in the traditional style.",
  "namkeen-tikka": "Peshawari-style tikka grilled simply with salt and light seasoning.",
  "shinwari-chicken-karahi": "Chicken karahi cooked the Shinwari way, simple and full of flavour.",
  "sulmani-karahi": "A traditional Peshawari-style karahi, simply seasoned and full of flavour.",

  // Royal BBQ
  "chicken-boti": "Juicy chicken boti marinated in spices and grilled.",
  "malai-boti": "Chicken boti marinated in cream and mild spices, grilled until tender.",
  "kastoori-boti": "Chicken boti marinated with kasuri methi and spices, grilled to perfection.",
  "achari-boti": "Chicken boti marinated in tangy pickling spices and grilled.",
  "hariyali-boti": "Chicken boti in a fresh green herb marinade, grilled until tender.",
  "afghani-boti": "Mildly spiced, creamy Afghani-style chicken boti, grilled until tender.",
  "chicken-piece-leg-chest": "Marinated chicken leg or chest piece, grilled and served hot.",
  "royal-reshmi-kabab": "Soft, silky chicken reshmi kabab with a creamy, mild flavour.",
  "chicken-cheese-kabab": "Chicken kabab stuffed with melted cheese.",
  "chicken-gola-kabab": "Spiced minced chicken gola kabab, grilled until golden.",
  "chicken-angara": "Smoky, fiery chicken angara grilled with bold spices.",
  "batera-grill": "Quail marinated in spices and grilled.",
  "beef-kabab-tikka": "Tender beef kabab or tikka, marinated and grilled.",
  "beef-gola-kabab": "Spiced minced beef gola kabab, grilled until golden.",
  "traditional-slow-roasted-chicken": "Chicken slow-roasted in the traditional way until tender and juicy.",
  "spiced-steamed-and-fried-chicken": "Chicken steamed in spices, then fried until crisp outside and juicy inside.",

  // Chinese
  "chicken-manchurian": "Crispy chicken tossed in a tangy, savoury Manchurian sauce.",
  "chicken-chow-mein": "Stir-fried noodles with chicken and vegetables.",
  "vegetable-chow-mein": "Stir-fried noodles with fresh mixed vegetables.",
  "chicken-masala-rice": "Fragrant rice cooked with chicken and masala spices.",
  "chicken-fried-rice": "Wok-fried rice with chicken and vegetables.",
  "vegetable-rice": "Wok-fried rice with mixed vegetables.",
  "egg-rice": "Wok-fried rice tossed with egg.",
  "chicken-shashlik": "Chicken pieces stir-fried with capsicum and onion in a tangy sauce.",
  "chicken-jalfrezi": "Chicken stir-fried with capsicum, onion and tomato in a spiced sauce.",
  "chicken-ginger": "Chicken stir-fried with fresh ginger in a savoury sauce.",

  // Platters (serving sizes are already in the description)
  "economy-platter": "A budget-friendly platter to share.",
  "sofra-special-kabuli-pulao": "Fragrant Afghani-style Kabuli pulao with carrots and raisins.",

  // Bar & Shakes (one-offs; the rest are generated from the name below)
  "sweet-lassi": "Thick, creamy yogurt lassi, sweetened and served chilled.",
  "namkeen-lassi": "Salted yogurt lassi, cool and refreshing.",
  "simple-lassi": "Classic plain yogurt lassi, served cold.",
  "cappuccino": "Espresso topped with steamed milk and a layer of foam.",
  "latte": "Smooth espresso with plenty of steamed milk.",
  "black-coffee": "Freshly brewed black coffee, bold and simple.",
  "hot-chocolate": "Rich, creamy hot chocolate.",

  // Drinks
  "250-ml-can": "Chilled 250 ml soft drink can.",
  "mineral-water-small": "Chilled mineral water, small bottle.",
  "mineral-water-large": "Chilled mineral water, large bottle.",
  "soft-drink": "Chilled soft drink, served cold.",
  "soft-drink-1-5-liter": "1.5 litre soft drink bottle, ideal for sharing.",

  // Ice Cream
  "2-scoops-ice-cream": "Two scoops of creamy ice cream.",
  "3-scoops-ice-cream": "Three scoops of creamy ice cream.",
  "2-scoops-tutti-fruity": "Two scoops of colourful tutti frutti ice cream.",
  "half-liter-ice-cream": "Half a litre of creamy ice cream to share or take away.",
  "one-liter-ice-cream": "One litre of creamy ice cream to share or take away.",
  "royal-special-ice-cream": "Our house-special ice cream, rich and indulgent.",

  // Tandoor
  "tandoor-per-head": "Freshly baked tandoor bread, charged per person.",
  "roghani-naan": "Soft naan brushed with ghee and topped with sesame seeds.",
  "kalonji-naan": "Soft naan topped with nigella (kalonji) seeds.",
  "plain-naan": "Soft, freshly baked tandoor naan.",
  "tandoori-roti": "Whole wheat roti baked fresh in the tandoor.",
};

/** Items not listed here stay Mild (1). Always review against your own recipes. */
const SPICE: Record<string, SpiceLevel> = {
  "rajasthani-handi": "Hot",
  "madrasi-handi": "Hot",
  "chicken-angara": "Hot",
  "hot-and-sour-soup": "Medium",
  "chicken-achari-handi": "Medium",
  "shahi-chicken-karahi": "Medium",
  "chicken-lahori-karahi": "Medium",
  "chicken-tikka-karahi": "Medium",
  "batera-karahi": "Medium",
  "sulmani-karahi": "Medium",
  "achari-boti": "Medium",
  "beef-tikka-fry": "Medium",
  "chicken-seekh-kabab-fry": "Medium",
  "beef-seekh-kabab-fry": "Medium",
  "chicken-manchurian": "Medium",
  "chicken-jalfrezi": "Medium",
  "chicken-masala-rice": "Medium",
};

/** Shown on the homepage. */
const FEATURED = new Set([
  "signature-special-soup",
  "chicken-boneless-handi",
  "chicken-white-handi",
]);

const baseSlug = (name: string) => slugify(name).replace(/-(half|full)$/, "");

function describe(item: MenuItem): string {
  const direct = DESCRIPTIONS[baseSlug(item.name)];
  if (direct) return direct;

  const n = item.name;
  const lower = n.toLowerCase();
  const strip = (suffix: string) => n.replace(suffix, "").trim();

  if (/ Margarita$/.test(n)) return `A refreshing ${lower} mocktail, served chilled.`;
  if (/ Mojito$/.test(n)) return `A cool ${lower} with fresh mint and lime.`;
  if (/ Colada$/.test(n)) return `A creamy, frozen ${lower} mocktail.`;
  if (/ Cold Coffee$/.test(n)) return `Chilled ${lower}, blended smooth over ice.`;
  if (/ Ice Cream Shake$/.test(n)) return `A thick ${strip(" Ice Cream Shake").toLowerCase()} shake blended with ice cream.`;
  if (/ Fresh Shake$/.test(n)) return `A fresh ${strip(" Fresh Shake").toLowerCase()} shake, blended with milk.`;
  if (/ Special Shake$/.test(n)) return `A thick, indulgent shake loaded with ${strip(" Special Shake")}.`;
  return "";
}

const menu: MenuItem[] = baseMenu.map((item) => {
  const key = baseSlug(item.name);
  return {
    ...item,
    description: item.description || describe(item),
    spiceLevel: item.spiceLevel ?? SPICE[key],
    featured: item.featured || FEATURED.has(key),
  };
});

/** Matches the shape of items created by the admin panel: id "itm-<timestamp>" + slug. */
function toDoc(item: MenuItem, index: number) {
  return {
    id: `itm-${ID_BASE + index}`,
    slug: slugify(item.name),
    name: item.name,
    description: item.description,
    category: item.category,
    price: item.price,
    ...(item.tag ? { tag: item.tag } : {}), // only saved when set, like the admin form
    spiceLevel: item.spiceLevel
      ? SPICE_NUMBER[item.spiceLevel]
      : NO_SPICE_CATEGORIES.includes(item.category)
        ? 0
        : DEFAULT_SPICE_LEVEL,
    image: item.image ?? "",
    isAvailable: item.available,
    isFeatured: item.featured,
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

async function uploadToCloudinary(
  filePath: string,
  slug: string,
  cloud: string,
  key: string,
  secret: string
): Promise<string> {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const folder = "royal-sofra/menu";
  const toSign = `folder=${folder}&overwrite=true&public_id=${slug}&timestamp=${timestamp}`;
  const signature = createHash("sha1").update(toSign + secret).digest("hex");

  const fd = new FormData();
  if (/^https?:\/\//i.test(filePath)) fd.append("file", filePath); // Cloudinary fetches the URL itself
  else fd.append("file", new Blob([readFileSync(filePath)]), basename(filePath));
  fd.append("api_key", key);
  fd.append("timestamp", timestamp);
  fd.append("signature", signature);
  fd.append("folder", folder);
  fd.append("public_id", slug);
  fd.append("overwrite", "true");

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
    method: "POST",
    body: fd,
  });
  const json = (await res.json().catch(() => ({}))) as {
    secure_url?: string;
    error?: { message?: string };
  };
  if (!res.ok || !json.secure_url) {
    throw new Error(json.error?.message ?? `${res.status} ${res.statusText}`);
  }
  return json.secure_url;
}

type ImageEntry = {
  slug: string;
  name: string;
  category: string;
  query: string;
  url: string;
  alternatives: string[];
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** True if the URL loads and really is an image (filters dead links and hotlink blocks). */
async function isImageUrl(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      headers: { Range: "bytes=0-1023", "User-Agent": "Mozilla/5.0" },
      signal: AbortSignal.timeout(6000),
    });
    void res.body?.cancel();
    return res.ok && (res.headers.get("content-type") ?? "").startsWith("image/");
  } catch {
    return false;
  }
}

type Candidate = { url: string; text: string }; // text = title/description used for matching

/** Words that don't identify a dish, so they are not required to appear in a photo's title. */
const GENERIC_WORDS = new Set([
  "chicken", "beef", "mutton", "special", "royal", "signature", "half", "full",
  "fresh", "and", "the", "of", "with",
]);

const words = (t: string) =>
  t
    .toLowerCase()
    .replace(/&/g, " and ")
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .map((w) => (w.length > 3 && w.endsWith("s") ? w.slice(0, -1) : w));

/**
 * A photo only counts if its title/description contains EVERY distinctive word of the
 * dish name ("Chicken Lahori Karahi" needs both "lahori" and "karahi"). No match = no photo.
 */
function matchesDish(name: string, text: string): boolean {
  const need = words(name.replace(/\((half|full)\)/i, "")).filter((w) => !GENERIC_WORDS.has(w));
  if (need.length === 0) return false;
  const have = new Set(words(text));
  return need.every((w) => have.has(w));
}

async function searchImages(provider: string, query: string): Promise<Candidate[]> {
  if (provider === "wikimedia") {
    const api =
      "https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search" +
      `&gsrsearch=${encodeURIComponent(query + " filetype:bitmap")}&gsrnamespace=6&gsrlimit=30` +
      "&prop=imageinfo&iiprop=url|mime|size|extmetadata&iiurlwidth=800";
    const res = await fetch(api, {
      headers: { "User-Agent": "RoyalSofraMenuSeeder/1.0 (restaurant menu script)" },
    });
    if (!res.ok) throw new Error(`Wikimedia ${res.status} ${res.statusText}`);
    const json = (await res.json()) as {
      query?: {
        pages?: Record<
          string,
          {
            title?: string;
            index?: number;
            imageinfo?: {
              thumburl?: string;
              url: string;
              mime: string;
              width: number;
              extmetadata?: { ImageDescription?: { value?: string } };
            }[];
          }
        >;
      };
    };
    const out: Candidate[] = [];
    for (const page of Object.values(json.query?.pages ?? {}).sort(
      (a, b) => (a.index ?? 0) - (b.index ?? 0)
    )) {
      const i = page.imageinfo?.[0];
      if (!i || !/^image\/(jpeg|png|webp)$/.test(i.mime) || i.width < 500) continue;
      const desc = (i.extmetadata?.ImageDescription?.value ?? "").replace(/<[^>]+>/g, " ");
      out.push({ url: i.thumburl ?? i.url, text: `${page.title ?? ""} ${desc}` });
    }
    return out;
  }

  if (provider === "pexels") {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=30&orientation=landscape`;
    const res = await fetch(url, { headers: { Authorization: process.env.PEXELS_API_KEY ?? "" } });
    if (!res.ok) throw new Error(`Pexels ${res.status} ${res.statusText}`);
    const json = (await res.json()) as { photos?: { alt?: string; src: { large: string } }[] };
    return (json.photos ?? []).map((p) => ({ url: p.src.large, text: p.alt ?? "" }));
  }

  // serper.dev – Google image results
  const res = await fetch(process.env.SERPER_URL ?? "https://google.serper.dev/images", {
    method: "POST",
    headers: { "X-API-KEY": process.env.SERPER_API_KEY ?? "", "Content-Type": "application/json" },
    body: JSON.stringify({ q: query, num: 20 }),
  });
  if (!res.ok) throw new Error(`Serper ${res.status} ${res.statusText}`);
  const json = (await res.json()) as { images?: { imageUrl?: string; title?: string }[] };
  return (json.images ?? [])
    .filter((i) => (i.imageUrl ?? "").startsWith("https://"))
    .map((i) => ({ url: i.imageUrl as string, text: i.title ?? "" }));
}

const esc = (t: string) =>
  t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

function reviewHtml(entries: ImageEntry[]) {
  const cards = entries
    .map(
      (e) => `<figure>
  ${e.url ? `<img src="${esc(e.url)}" loading="lazy" referrerpolicy="no-referrer" alt="">` : `<div class="none">no photo found</div>`}
  <figcaption><b>${esc(e.name)}</b><span>${esc(e.category)}</span><code>${esc(e.slug)}</code><em>searched: ${esc(e.query)}</em></figcaption>
</figure>`
    )
    .join("\n");
  return `<!doctype html><meta charset="utf-8"><title>Menu photo review</title>
<style>
body{font:14px system-ui;margin:24px;background:#faf6f0;color:#2b1810}
main{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px}
figure{margin:0;background:#fff;border:1px solid #e5d9cb;border-radius:12px;overflow:hidden}
img,.none{width:100%;height:150px;object-fit:cover;display:block;background:#eee}
.none{display:grid;place-items:center;color:#999}
figcaption{padding:10px;display:grid;gap:3px}
span,em{color:#6f5a4c;font-size:12px}code{font-size:11px;color:#8a6d3b}
</style>
<h1>Menu photo review (${entries.length} items)</h1>
<p>Wrong photo? Open <code>menu-images.json</code> and change that item's <code>url</code> (try one of its <code>alternatives</code>).</p>
<main>
${cards}
</main>`;
}

async function findImages(items: MenuItem[]): Promise<ImageEntry[]> {
  const provider = (
    process.env.IMAGE_PROVIDER ??
    (process.env.SERPER_API_KEY ? "serper" : process.env.PEXELS_API_KEY ? "pexels" : "wikimedia")
  ).toLowerCase();

  if (!["serper", "pexels", "wikimedia"].includes(provider)) {
    console.error(`Unknown IMAGE_PROVIDER "${provider}". Use wikimedia, pexels or serper.`);
    process.exit(1);
  }
  if (provider === "serper" && !process.env.SERPER_API_KEY) {
    console.error("IMAGE_PROVIDER=serper needs SERPER_API_KEY.");
    process.exit(1);
  }
  if (provider === "pexels" && !process.env.PEXELS_API_KEY) {
    console.error("IMAGE_PROVIDER=pexels needs PEXELS_API_KEY.");
    process.exit(1);
  }

  console.log(`Searching photos with ${provider}\n`);
  const cache = new Map<string, Candidate[]>();
  const entries: ImageEntry[] = [];

  for (const [i, item] of items.entries()) {
    // Try the tuned query first, then the plain dish name.
    const plain = item.name.replace(/\((half|full)\)/i, "").replace(/\s+/g, " ").trim();
    let query = imageQuery(item);
    let urls: string[] = [];
    for (const q of [...new Set([query, plain])]) {
      let found = cache.get(q);
      if (!found) {
        try {
          found = await searchImages(provider, q);
        } catch (err) {
          console.log(`  ! ${item.name}: ${(err as Error).message}`);
          found = [];
        }
        cache.set(q, found);
        await sleep(provider === "serper" ? 150 : 400);
      }
      // Keep only photos whose title really names this dish.
      const matched: string[] = [];
      for (const c of found) {
        if (matched.length >= 4) break;
        if (!matchesDish(item.name, c.text)) continue;
        if (provider === "serper" && !(await isImageUrl(c.url))) continue;
        matched.push(c.url);
      }
      if (matched.length) {
        urls = matched;
        query = q;
        break;
      }
    }
    entries.push({
      slug: slugify(item.name),
      name: item.name,
      category: item.category,
      query,
      url: urls[0] ?? "",
      alternatives: urls.slice(1),
    });
    console.log(
      `  ${urls[0] ? "✓" : "–"} [${i + 1}/${items.length}] ${item.name}` +
        (urls[0] ? "" : "   (no exact match, placeholder stays)")
    );
  }

  writeFileSync("menu-images.json", JSON.stringify(entries, null, 2));
  writeFileSync("menu-images-review.html", reviewHtml(entries));

  const found = entries.filter((e) => e.url).length;
  console.log(`\nExact matches for ${found} of ${entries.length} items.`);
  console.log("The rest keep the placeholder image until you add their photos.");
  console.log("Open menu-images-review.html to check the matches; fix any in menu-images.json.");

  const hosts = [...new Set(entries.filter((e) => e.url).map((e) => new URL(e.url).hostname))];
  console.log(
    `\nThese photos come from ${hosts.length} different sites. next/image only loads hosts listed in\n` +
      `next.config images.remotePatterns, so either add them, or use --rehost when applying to copy\n` +
      `the photos into Cloudinary (your existing host).\n` +
      `Hosts: ${hosts.join(", ")}`
  );
  return entries;
}

async function applyImages(col: Collection) {
  if (!existsSync("menu-images.json")) {
    console.error("menu-images.json not found. Run --find-images first.");
    process.exit(1);
  }
  const entries = JSON.parse(readFileSync("menu-images.json", "utf8")) as ImageEntry[];
  await applyEntries(col, entries);
}

async function applyEntries(col: Collection, entries: ImageEntry[]) {
  const rehost = flag("rehost");

  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  const key = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;
  if (rehost && (!cloud || !key || !secret)) {
    console.error("--rehost needs CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.");
    process.exit(1);
  }

  let applied = 0;
  let skipped = 0;
  let failed = 0;
  for (const e of entries) {
    if (!e.url) continue;
    try {
      let url = e.url;
      if (rehost) url = await uploadToCloudinary(e.url, e.slug, cloud!, key!, secret!);
      const filter = flag("update")
        ? { slug: e.slug }
        : { slug: e.slug, ...NO_PHOTO };
      const r = await col.updateOne(filter, { $set: { image: url } });
      if (r.matchedCount) {
        applied++;
        console.log(`  ✓ ${e.slug}`);
      } else {
        skipped++;
      }
    } catch (err) {
      failed++;
      console.log(`  ✗ ${e.slug} – ${(err as Error).message}`);
    }
  }
  console.log(`\nApplied ${applied}, skipped ${skipped} (already have a photo or not in database), failed ${failed}.`);
  if (skipped) console.log("Add --update to replace photos that are already set.");
}

async function syncImages(col: Collection, items: MenuItem[]) {
  const dir = option("dir") ?? "scripts/menu-images";
  const exts = [".jpg", ".jpeg", ".png", ".webp"];
  const files = existsSync(dir)
    ? readdirSync(dir).filter((f) => exts.includes(extname(f).toLowerCase()))
    : [];
  const bySlug = new Map(files.map((f) => [basename(f, extname(f)).toLowerCase(), f]));
  const slugs = items.map((i) => slugify(i.name));

  // 1) upload local photos
  if (files.length) {
    const cloud = process.env.CLOUDINARY_CLOUD_NAME;
    const key = process.env.CLOUDINARY_API_KEY;
    const secret = process.env.CLOUDINARY_API_SECRET;
    if (!cloud || !key || !secret) {
      console.error("Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET");
      console.error("in your env file (same values your admin panel uses for uploads).");
      process.exit(1);
    }
    let done = 0;
    for (const slug of slugs) {
      const file = bySlug.get(slug);
      if (!file) continue;
      try {
        const url = await uploadToCloudinary(join(dir, file), slug, cloud, key, secret);
        const r = await col.updateOne({ slug }, { $set: { image: url } });
        if (r.matchedCount === 0) throw new Error("item not in database – seed the menu first");
        done++;
        console.log(`  ✓ ${slug}`);
      } catch (err) {
        console.log(`  ✗ ${slug} – ${(err as Error).message}`);
      }
    }
    console.log(`\nUploaded ${done} of ${files.length} photos.`);
    const unknown = [...bySlug.keys()].filter((k) => !slugs.includes(k));
    if (unknown.length) {
      console.log(`Ignored (no item with that slug): ${unknown.join(", ")}`);
    }
  } else {
    console.log(`No photos found in ${dir}.`);
  }

  // 2) list what is still missing
  const noImage = { slug: { $in: slugs }, $or: [{ image: "" }, { image: { $exists: false } }] };
  const missing = await col
    .find({ slug: { $in: slugs }, ...NO_PHOTO })
    .project({ slug: 1, _id: 0 })
    .toArray();
  writeFileSync(
    "menu-images-needed.txt",
    missing.map((m) => `${m.slug}.jpg`).join("\n") + "\n"
  );
  console.log(`${missing.length} items have no photo (names saved to menu-images-needed.txt).`);

  // 3) optional placeholder for the rest
  const placeholder = PLACEHOLDER_IMAGE;
  if (placeholder && missing.length) {
    const r = await col.updateMany(noImage, { $set: { image: placeholder } });
    console.log(`Placeholder image set on ${r.modifiedCount} items.`);
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

  if (flag("find-images") && !flag("auto-images") && !flag("dry")) {
    await findImages(items);
    return;
  }

  if (flag("dry")) {
    for (const i of items) {
      console.log(
        `${i.category.padEnd(20)} ${i.name.padEnd(40)} Rs. ${i.price}` +
          (flag("find-images") ? `   ← "${imageQuery(i)}"` : "")
      );
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

    if (flag("auto-images")) {
      console.log(`Finding and saving photos for ${dbName}.${collName}\n`);
      const entries = await findImages(items);
      await applyEntries(col, entries);
      return;
    }

    if (flag("apply-images")) {
      console.log(`Applying photos to ${dbName}.${collName}\n`);
      await applyImages(col);
      return;
    }

    if (flag("images")) {
      console.log(`Images for ${dbName}.${collName}\n`);
      await syncImages(col, items);
      return;
    }
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
      const ignore = new Set(["_id", "__v", "createdAt", "updatedAt", "tag"]);
      const theirs = Object.keys(existing).filter((k) => !ignore.has(k));
      const ours = Object.keys(toDoc(items[0], 0)).filter((k) => !ignore.has(k));
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
      const { id, image, ...doc } = toDoc(item, idx);
      return {
        updateOne: {
          filter: { slug: doc.slug },
          update: overwrite
            ? {
                // keep existing id and photo; only write a photo if the script has one
                $set: { ...doc, ...(image ? { image } : {}), updatedAt: now },
                $setOnInsert: { id, createdAt: now, ...(image ? {} : { image: PLACEHOLDER_IMAGE }) },
              }
            : { $setOnInsert: { id, image: image || PLACEHOLDER_IMAGE, ...doc, createdAt: now, updatedAt: now } },
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