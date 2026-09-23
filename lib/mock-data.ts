import type {
  AdminNotification,
  BlogPost,
  Customer,
  Deal,
  InventoryItem,
  MenuCategory,
  MenuItem,
  Order,
  Review,
  StaffMember,
} from './types'
import { slugify } from './format'

export const brand = {
  name: 'Royal Sofra',
  tagline: 'Where every meal is served like royalty.',
  type: 'Premium Pakistani · BBQ · Chinese Restaurant',
  address: '28 Garden Avenue, Lahore',
  phone: '+92 42 111 76925',
  phoneHref: 'tel:+924211176925',
  email: 'info@royalsofra.pk',
  hours: 'Mon–Sun · 12pm–12am',
}

// Editorial marketing copy for the homepage promo grid — not a persisted data
// model, just on-brand content the restaurant curates like a print menu insert.
export const promoCards = [
  {
    title: 'The Royal Tasting',
    desc: "A 5-course journey through our chef's finest creations.",
    img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1000&q=85',
    href: '/menu?category=Special%20Karahi',
  },
  {
    title: 'Shinwari Nights',
    desc: 'Smoky, namkeen and unapologetically bold.',
    img: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=85',
    href: '/menu?category=Royal%20Shinwari',
  },
  {
    title: 'Midnight Grill',
    desc: 'Late night cravings meet royal flavours.',
    img: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=85',
    href: '/menu?category=Royal%20BBQ',
  },
]

export const menuCategories: MenuCategory[] = [
  'Appetizers',
  'Pakistani Handi',
  'Special Karahi',
  'BBQ & Kabab Fries',
  'Royal Shinwari',
  'Royal BBQ',
  'Chinese',
  'Platters',
  'Bar & Shakes',
  'Drinks',
  'Ice Cream',
  'Tandoor',
]

// A curated subset used for the homepage "Curated Selections" scroller —
// the full menu page lists all twelve categories, but the homepage only
// needs a handful of signature ones to stay visually elegant.
export const homeCategories: MenuCategory[] = [
  'Special Karahi',
  'Royal BBQ',
  'Royal Shinwari',
  'Pakistani Handi',
  'Chinese',
  'Platters',
]

// Small image pools per category, cycled across items — the new menu spans
// ~90 dishes and we don't have unique photography for each one, so items
// within a category share a rotating set of representative food photos
// (the same approach a printed menu takes with section photography).
const IMG = {
  appetizer: [
    'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=85',
  ],
  handi: [
    'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=900&q=85',
  ],
  karahi: [
    'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=900&q=85',
  ],
  bbqFries: [
    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=900&q=85',
  ],
  shinwari: [
    'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?auto=format&fit=crop&w=900&q=85',
  ],
  bbq: [
    'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=900&q=85',
  ],
  chinese: [
    'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=900&q=85',
  ],
  platter: [
    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85',
  ],
  bar: [
    'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=900&q=85',
  ],
  drinks: [
    'https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9e?auto=format&fit=crop&w=900&q=85',
  ],
  iceCream: [
    'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1497034825429-c343d7c6a68a?auto=format&fit=crop&w=900&q=85',
  ],
  tandoor: [
    'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=900&q=85',
  ],
} as const

let itemSeq = 0
function img(pool: readonly string[]) {
  return pool[itemSeq % pool.length]
}

function makeItem(partial: {
  name: string
  category: MenuCategory
  description?: string
  price: number
  priceNote?: string
  tag?: string
  spiceLevel?: 1 | 2 | 3
  options?: string[]
  isFeatured?: boolean
  imagePool: readonly string[]
}): MenuItem {
  itemSeq += 1
  const slug = slugify(partial.name)
  return {
    id: `itm-${itemSeq}`,
    slug,
    name: partial.name,
    category: partial.category,
    description: partial.description ?? `A Royal Sofra classic from our ${partial.category.toLowerCase()} selection.`,
    price: partial.price,
    priceNote: partial.priceNote,
    image: img(partial.imagePool),
    tag: partial.tag ?? '',
    spiceLevel: partial.spiceLevel ?? 1,
    isAvailable: true,
    isFeatured: partial.isFeatured ?? false,
    options: partial.options,
  }
}

export const menuItems: MenuItem[] = [
  // 1. Appetizers
  makeItem({ name: 'Signature Special Soup', category: 'Appetizers', description: 'A rich house-special recipe, crafted with premium ingredients and bold flavours.', price: 430, tag: 'House special', spiceLevel: 1, imagePool: IMG.appetizer }),
  makeItem({ name: 'Hot & Sour Soup', category: 'Appetizers', description: 'A perfect balance of spicy, tangy and comforting flavours, served piping hot.', price: 449, spiceLevel: 2, imagePool: IMG.appetizer }),
  makeItem({ name: 'Chicken Corn Soup', category: 'Appetizers', description: 'Tender chicken, sweet corn, and delicate egg ribbons, served with crispy crackers.', price: 399, spiceLevel: 1, imagePool: IMG.appetizer }),
  makeItem({ name: 'Garden Salad', category: 'Appetizers', description: 'Fresh seasonal vegetables with a light dressing.', price: 180, spiceLevel: 1, imagePool: IMG.appetizer }),
  makeItem({ name: 'Russian Salad', category: 'Appetizers', description: 'A classic creamy salad with fresh vegetables & fruit.', price: 599, priceNote: 'Half Rs. 299 / Full Rs. 599', spiceLevel: 1, imagePool: IMG.appetizer }),
  makeItem({ name: 'Waldorf Salad', category: 'Appetizers', description: 'Fresh apples, walnuts & crisp vegetables in a signature dressing.', price: 510, spiceLevel: 1, imagePool: IMG.appetizer }),
  makeItem({ name: 'Kachumber Salad', category: 'Appetizers', description: 'Finely diced cucumbers, tomatoes & onions tossed in a tangy lemon dressing.', price: 350, spiceLevel: 1, imagePool: IMG.appetizer }),
  makeItem({ name: 'Mint Raita', category: 'Appetizers', description: 'A refreshing, cooling yogurt dip infused with fresh mint and mild spices.', price: 130, spiceLevel: 1, imagePool: IMG.appetizer }),
  makeItem({ name: 'Zeera Raita', category: 'Appetizers', description: 'A cooling yogurt dip lightly spiced with roasted cumin seeds.', price: 180, spiceLevel: 1, imagePool: IMG.appetizer }),

  // 2. Pakistani Handi
  makeItem({ name: 'Rajasthani Handi', category: 'Pakistani Handi', price: 1630, tag: 'Chef selection', spiceLevel: 2, imagePool: IMG.handi }),
  makeItem({ name: 'Chicken Cheese Handi', category: 'Pakistani Handi', price: 1550, spiceLevel: 1, imagePool: IMG.handi }),
  makeItem({ name: 'Chicken Boneless Handi', category: 'Pakistani Handi', price: 1530, tag: 'Signature', spiceLevel: 2, isFeatured: true, imagePool: IMG.handi }),
  makeItem({ name: 'Chicken Achari Handi', category: 'Pakistani Handi', price: 1599, spiceLevel: 3, imagePool: IMG.handi }),
  makeItem({ name: 'Chicken White Handi', category: 'Pakistani Handi', price: 1599, tag: 'Signature', spiceLevel: 1, isFeatured: true, imagePool: IMG.handi }),
  makeItem({ name: 'Madrasi Handi', category: 'Pakistani Handi', price: 1599, spiceLevel: 2, imagePool: IMG.handi }),
  makeItem({ name: 'Mughlai Handi', category: 'Pakistani Handi', price: 1599, spiceLevel: 2, imagePool: IMG.handi }),
  makeItem({ name: 'Chicken Palak Paneer', category: 'Pakistani Handi', price: 1630, spiceLevel: 1, imagePool: IMG.handi }),
  makeItem({ name: 'Beef Palak Paneer', category: 'Pakistani Handi', price: 1630, spiceLevel: 1, imagePool: IMG.handi }),
  makeItem({ name: 'Mix Vegetable', category: 'Pakistani Handi', price: 799, spiceLevel: 1, imagePool: IMG.handi }),
  makeItem({ name: 'Dal Mash Makhni', category: 'Pakistani Handi', price: 799, spiceLevel: 1, imagePool: IMG.handi }),

  // 3. Special Karahi
  makeItem({ name: 'Shahi Chicken Karahi', category: 'Special Karahi', price: 1899, tag: 'House favourite', spiceLevel: 2, isFeatured: true, imagePool: IMG.karahi }),
  makeItem({ name: 'Chicken Karahi Makhni', category: 'Special Karahi', price: 2290, priceNote: 'Half Rs. 1,299 / Full Rs. 2,290', spiceLevel: 2, imagePool: IMG.karahi }),
  makeItem({ name: 'Mutton Karahi Makhni', category: 'Special Karahi', price: 4599, priceNote: 'Half Rs. 2,399 / Full Rs. 4,599', spiceLevel: 2, imagePool: IMG.karahi }),
  makeItem({ name: 'Batera Karahi', category: 'Special Karahi', price: 3399, priceNote: 'Rs. 1,799 / Rs. 3,399', spiceLevel: 2, imagePool: IMG.karahi }),
  makeItem({ name: 'Chicken Lahori Karahi', category: 'Special Karahi', price: 2399, tag: 'Slow cooked', spiceLevel: 3, imagePool: IMG.karahi }),
  makeItem({ name: 'Chicken White Karahi', category: 'Special Karahi', price: 2399, spiceLevel: 1, imagePool: IMG.karahi }),
  makeItem({ name: 'Chicken Tikka Karahi', category: 'Special Karahi', price: 2199, spiceLevel: 2, imagePool: IMG.karahi }),

  // 4. BBQ & Kabab Fries
  makeItem({ name: 'Chicken Boti Fry', category: 'BBQ & Kabab Fries', price: 2760, spiceLevel: 2, imagePool: IMG.bbqFries }),
  makeItem({ name: 'Chicken Seekh Kabab Fry', category: 'BBQ & Kabab Fries', price: 1499, spiceLevel: 2, imagePool: IMG.bbqFries }),
  makeItem({ name: 'Beef Seekh Kabab Fry', category: 'BBQ & Kabab Fries', price: 1699, spiceLevel: 2, imagePool: IMG.bbqFries }),
  makeItem({ name: 'Beef Tikka Fry', category: 'BBQ & Kabab Fries', price: 1699, spiceLevel: 2, imagePool: IMG.bbqFries }),

  // 5. Royal Shinwari
  makeItem({ name: 'Shinwari Namkeen Karahi', category: 'Royal Shinwari', price: 4199, priceNote: 'Half Rs. 2,099 / Full Rs. 4,199', tag: 'Namkeen', spiceLevel: 2, isFeatured: true, imagePool: IMG.shinwari }),
  makeItem({ name: 'Namkeen Tikka', category: 'Royal Shinwari', price: 4199, spiceLevel: 2, imagePool: IMG.shinwari }),
  makeItem({ name: 'Shinwari Chicken Karahi', category: 'Royal Shinwari', price: 1999, priceNote: 'Half Rs. 999 / Full Rs. 1,999', spiceLevel: 2, imagePool: IMG.shinwari }),
  makeItem({ name: 'Sulmani Karahi', category: 'Royal Shinwari', price: 4199, spiceLevel: 2, imagePool: IMG.shinwari }),

  // 6. Royal BBQ
  makeItem({ name: 'Chicken Boti', category: 'Royal BBQ', price: 1299, tag: 'Charcoal grilled', spiceLevel: 2, isFeatured: true, imagePool: IMG.bbq }),
  makeItem({ name: 'Malai Boti', category: 'Royal BBQ', price: 1499, spiceLevel: 1, imagePool: IMG.bbq }),
  makeItem({ name: 'Kastoori Boti', category: 'Royal BBQ', price: 1499, spiceLevel: 2, imagePool: IMG.bbq }),
  makeItem({ name: 'Achari Boti', category: 'Royal BBQ', price: 1499, spiceLevel: 3, imagePool: IMG.bbq }),
  makeItem({ name: 'Hariyali Boti', category: 'Royal BBQ', price: 1499, spiceLevel: 2, imagePool: IMG.bbq }),
  makeItem({ name: 'Afghani Boti', category: 'Royal BBQ', price: 1399, spiceLevel: 1, imagePool: IMG.bbq }),
  makeItem({ name: 'Chicken Piece (Leg / Chest)', category: 'Royal BBQ', price: 499, spiceLevel: 1, imagePool: IMG.bbq }),
  makeItem({ name: 'Royal Reshmi Kabab', category: 'Royal BBQ', price: 1399, tag: 'Signature', spiceLevel: 1, imagePool: IMG.bbq }),
  makeItem({ name: 'Chicken Cheese Kabab', category: 'Royal BBQ', price: 1450, spiceLevel: 1, imagePool: IMG.bbq }),
  makeItem({ name: 'Chicken Gola Kabab', category: 'Royal BBQ', price: 899, spiceLevel: 2, imagePool: IMG.bbq }),
  makeItem({ name: 'Chicken Angara', category: 'Royal BBQ', price: 1299, spiceLevel: 3, imagePool: IMG.bbq }),
  makeItem({ name: 'Batera Grill', category: 'Royal BBQ', price: 300, spiceLevel: 1, imagePool: IMG.bbq }),
  makeItem({ name: 'Beef Kabab / Tikka', category: 'Royal BBQ', price: 1299, spiceLevel: 2, imagePool: IMG.bbq }),
  makeItem({ name: 'Beef Gola Kabab', category: 'Royal BBQ', price: 999, spiceLevel: 2, imagePool: IMG.bbq }),
  makeItem({ name: 'Traditional Slow-Roasted Chicken', category: 'Royal BBQ', price: 1950, tag: 'Slow cooked', spiceLevel: 1, imagePool: IMG.bbq }),
  makeItem({ name: 'Spiced Steamed & Fried Chicken', category: 'Royal BBQ', price: 1299, spiceLevel: 2, imagePool: IMG.bbq }),

  // 7. Chinese
  makeItem({ name: 'Chicken Manchurian', category: 'Chinese', price: 1399, spiceLevel: 2, imagePool: IMG.chinese }),
  makeItem({ name: 'Chicken Chow Mein', category: 'Chinese', price: 799, spiceLevel: 1, imagePool: IMG.chinese }),
  makeItem({ name: 'Vegetable Chow Mein', category: 'Chinese', price: 699, spiceLevel: 1, imagePool: IMG.chinese }),
  makeItem({ name: 'Chicken Masala Rice', category: 'Chinese', price: 899, spiceLevel: 2, imagePool: IMG.chinese }),
  makeItem({ name: 'Chicken Fried Rice', category: 'Chinese', price: 799, spiceLevel: 1, imagePool: IMG.chinese }),
  makeItem({ name: 'Vegetable Rice', category: 'Chinese', price: 699, spiceLevel: 1, imagePool: IMG.chinese }),
  makeItem({ name: 'Egg Rice', category: 'Chinese', price: 699, spiceLevel: 1, imagePool: IMG.chinese }),
  makeItem({ name: 'Chicken Shashlik', category: 'Chinese', price: 1399, tag: 'Fan favourite', spiceLevel: 1, imagePool: IMG.chinese }),
  makeItem({ name: 'Chicken Jalfrezi', category: 'Chinese', price: 1299, spiceLevel: 2, imagePool: IMG.chinese }),
  makeItem({ name: 'Chicken Ginger', category: 'Chinese', price: 1299, spiceLevel: 2, imagePool: IMG.chinese }),

  // 8. Platters
  makeItem({ name: 'Royal Grand Feast', category: 'Platters', price: 12999, priceNote: '5–7 Persons · Rs. 12,999', tag: 'For sharing', spiceLevel: 2, isFeatured: true, imagePool: IMG.platter }),
  makeItem({ name: 'Sofra Family Feast', category: 'Platters', price: 6999, priceNote: '4–5 Persons · Rs. 6,999', spiceLevel: 2, imagePool: IMG.platter }),
  makeItem({ name: 'Royal Sofra Special', category: 'Platters', price: 4499, priceNote: '3–4 Persons · Rs. 4,499', spiceLevel: 2, imagePool: IMG.platter }),
  makeItem({ name: 'Shahi Platter', category: 'Platters', price: 3999, priceNote: '2–3 Persons · Rs. 3,999', spiceLevel: 2, imagePool: IMG.platter }),
  makeItem({ name: 'Economy Platter', category: 'Platters', price: 2499, spiceLevel: 1, imagePool: IMG.platter }),
  makeItem({ name: 'Sofra Special Kabuli Pulao', category: 'Platters', price: 1099, spiceLevel: 1, imagePool: IMG.platter }),

  // 9. Bar & Shakes
  makeItem({ name: 'Margarita', category: 'Bar & Shakes', description: 'Choose your favourite flavour, blended fresh to order.', price: 399, options: ['Mint', 'Strawberry', 'Peach', 'Pineapple', 'Blue Lagoon', 'Apple'], spiceLevel: 1, imagePool: IMG.bar }),
  makeItem({ name: 'Mojito', category: 'Bar & Shakes', description: 'A crushed-mint classic in your choice of fruit.', price: 450, options: ['Blueberry', 'Pineapple', 'Strawberry'], spiceLevel: 1, imagePool: IMG.bar }),
  makeItem({ name: 'Mocktail Colada', category: 'Bar & Shakes', description: 'Creamy coconut colada, blended with fresh fruit.', price: 599, options: ['Strawberry', 'Mango', 'Peach', 'Pina'], spiceLevel: 1, imagePool: IMG.bar }),
  makeItem({ name: 'Lassi', category: 'Bar & Shakes', description: 'Traditional churned yogurt, served chilled.', price: 299, options: ['Sweet', 'Namkeen', 'Simple'], spiceLevel: 1, imagePool: IMG.bar }),
  makeItem({ name: 'Cold Coffee', category: 'Bar & Shakes', price: 499, options: ['Vanilla', 'Chocolate', 'Caramel'], spiceLevel: 1, imagePool: IMG.bar }),
  makeItem({ name: 'Ice Cream Shake', category: 'Bar & Shakes', price: 550, options: ['Kulfa', 'Pista', 'Mango', 'Strawberry', 'Vanilla', 'Chocolate'], spiceLevel: 1, imagePool: IMG.bar }),
  makeItem({ name: 'Fresh Shake', category: 'Bar & Shakes', price: 350, options: ['Apple & Banana', 'Strawberry', 'Mango', 'Peach'], spiceLevel: 1, imagePool: IMG.bar }),
  makeItem({ name: 'Special Shake', category: 'Bar & Shakes', price: 499, options: ['Oreo Special', 'Nutella Special', 'Mars Special', 'KitKat Special'], tag: 'Indulgent', spiceLevel: 1, imagePool: IMG.bar }),
  makeItem({ name: 'Hot Menu', category: 'Bar & Shakes', description: 'Freshly brewed, served warm.', price: 499, options: ['Cappuccino', 'Latte', 'Black Coffee', 'Hot Chocolate'], spiceLevel: 1, imagePool: IMG.bar }),

  // 10. Drinks
  makeItem({ name: '250 ml Can', category: 'Drinks', price: 160, spiceLevel: 1, imagePool: IMG.drinks }),
  makeItem({ name: 'Mineral Water — Small', category: 'Drinks', price: 80, spiceLevel: 1, imagePool: IMG.drinks }),
  makeItem({ name: 'Mineral Water — Large', category: 'Drinks', price: 160, spiceLevel: 1, imagePool: IMG.drinks }),
  makeItem({ name: 'Soft Drink', category: 'Drinks', price: 99, spiceLevel: 1, imagePool: IMG.drinks }),
  makeItem({ name: 'Soft Drink — 1.5 Liter', category: 'Drinks', price: 240, spiceLevel: 1, imagePool: IMG.drinks }),

  // 11. Ice Cream
  makeItem({ name: '2 Scoops Ice Cream', category: 'Ice Cream', price: 230, spiceLevel: 1, imagePool: IMG.iceCream }),
  makeItem({ name: '3 Scoops Ice Cream', category: 'Ice Cream', price: 330, spiceLevel: 1, imagePool: IMG.iceCream }),
  makeItem({ name: '2 Scoops Tutti Fruity', category: 'Ice Cream', price: 250, spiceLevel: 1, imagePool: IMG.iceCream }),
  makeItem({ name: 'Half Liter Ice Cream', category: 'Ice Cream', price: 620, spiceLevel: 1, imagePool: IMG.iceCream }),
  makeItem({ name: 'One Liter Ice Cream', category: 'Ice Cream', price: 1200, spiceLevel: 1, imagePool: IMG.iceCream }),
  makeItem({ name: 'Royal Special Ice Cream', category: 'Ice Cream', price: 399, tag: 'Signature', spiceLevel: 1, imagePool: IMG.iceCream }),

  // 12. Tandoor
  makeItem({ name: 'Tandoor (Per Head)', category: 'Tandoor', price: 99, priceNote: 'Rs. 99 / Per Head', spiceLevel: 1, imagePool: IMG.tandoor }),
  makeItem({ name: 'Roghani Naan', category: 'Tandoor', price: 120, spiceLevel: 1, imagePool: IMG.tandoor }),
  makeItem({ name: 'Kalonji Naan', category: 'Tandoor', price: 180, spiceLevel: 1, imagePool: IMG.tandoor }),
  makeItem({ name: 'Plain Naan', category: 'Tandoor', price: 30, spiceLevel: 1, imagePool: IMG.tandoor }),
  makeItem({ name: 'Tandoori Roti', category: 'Tandoor', price: 17, spiceLevel: 1, imagePool: IMG.tandoor }),
]

export const featuredMenuItems = menuItems.filter((item) => item.isFeatured)

// Note: these mock orders are only used by the deferred /admin/reports page.
// Real orders placed through checkout are persisted to MongoDB (see app/api/orders).
export const orders: Order[] = [
  { id: 'RS-10241', customerName: 'Ayesha Khan', customerEmail: 'ayesha.khan@example.com', customerPhone: '+92 300 1234567', address: '14 Model Town, Lahore', items: [{ name: 'Royal Handi Karahi', qty: 1, price: 1850 }, { name: 'Butter Garlic Naan', qty: 3, price: 220 }], total: 2510, status: 'Preparing', paymentMethod: 'GoPayfast', paymentStatus: 'Paid', placedAt: '2026-08-21 19:42' },
  { id: 'RS-10240', customerName: 'Bilal Ahmed', customerEmail: 'bilal.ahmed@example.com', customerPhone: '+92 321 9876543', address: '7 DHA Phase 5, Lahore', items: [{ name: 'Tandoori Mixed Grill', qty: 1, price: 2650 }], total: 2650, status: 'Out for delivery', paymentMethod: 'GoPayfast', paymentStatus: 'Paid', placedAt: '2026-08-21 18:55' },
  { id: 'RS-10239', customerName: 'Fatima Noor', customerEmail: 'fatima.noor@example.com', customerPhone: '+92 333 4567890', address: '52 Johar Town, Lahore', items: [{ name: 'Wok-Tossed Chicken Rice', qty: 2, price: 980 }, { name: 'Mint Lemonade', qty: 2, price: 350 }], total: 2660, status: 'Delivered', paymentMethod: 'Cash on delivery', paymentStatus: 'Paid', placedAt: '2026-08-21 13:10' },
  { id: 'RS-10238', customerName: 'Hamza Sheikh', customerEmail: 'hamza.sheikh@example.com', customerPhone: '+92 345 1122334', address: '3 Gulberg III, Lahore', items: [{ name: 'Peshawari Mutton Karahi', qty: 1, price: 2450 }, { name: 'Saffron Kheer', qty: 2, price: 480 }], total: 3410, status: 'Confirmed', paymentMethod: 'GoPayfast', paymentStatus: 'Paid', placedAt: '2026-08-21 12:02' },
  { id: 'RS-10237', customerName: 'Sana Malik', customerEmail: 'sana.malik@example.com', customerPhone: '+92 312 6677889', address: '19 Cavalry Ground, Lahore', items: [{ name: 'Lahori Fish Fry', qty: 1, price: 1550 }], total: 1550, status: 'Cancelled', paymentMethod: 'Cash on delivery', paymentStatus: 'Failed', placedAt: '2026-08-20 20:31' },
  { id: 'RS-10236', customerName: 'Usman Raza', customerEmail: 'usman.raza@example.com', customerPhone: '+92 301 5544332', address: '11 Bahria Town, Lahore', items: [{ name: 'Smoky Seekh Kebab', qty: 2, price: 1450 }], total: 2900, status: 'Pending', paymentMethod: 'GoPayfast', paymentStatus: 'Pending', placedAt: '2026-08-20 19:08' },
]

export const blogPosts: BlogPost[] = [
  { id: 'blg-1', slug: 'secret-behind-a-great-karahi', title: 'The secret behind a truly great karahi', excerpt: 'From the first sizzle to the final garnish, discover why our copper handi matters.', content: 'A great karahi begins long before the pan touches the flame. It starts with the right cut of meat, patiently rendered tomatoes and a copper handi that holds heat exactly the way tradition intended. In this piece, our head chef walks through the rhythm of building layers of flavour, one spoon of ginger-garlic at a time.', category: 'Kitchen notes', author: 'Chef Imran', date: '2026-08-18', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=85', published: true },
  { id: 'blg-2', slug: 'royal-sofra-spice-shelf', title: 'A guide to the Royal Sofra spice shelf', excerpt: 'Meet the warm, fragrant spices that give our signature dishes their depth.', content: 'Cumin, black cardamom, mace and our house garam masala blend form the backbone of nearly every dish we serve. We source whole spices and grind them in small batches so every karahi and kebab tastes freshly spiced, never dusty or stale.', category: 'From the pantry', author: 'Chef Imran', date: '2026-08-06', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=85', published: true },
  { id: 'blg-3', slug: 'why-charcoal-changes-everything', title: 'Why charcoal changes everything', excerpt: 'An evening around the grill, and the craft behind our smoky BBQ platters.', content: 'There is a reason our BBQ platters taste different from anything cooked on a gas flame. Charcoal brings a smokiness and char that seeps into the marinade, and our grill masters know exactly when to turn each skewer for that perfect edge.', category: 'Stories', author: 'Ali Raza', date: '2026-07-24', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85', published: true },
]

export const reviews: Review[] = [
  { id: 'rev-1', customerName: 'Ayesha Khan', itemName: 'Royal Handi Karahi', rating: 5, comment: 'Best karahi in the city, hands down. The gravy is unreal.', date: '2026-08-19', status: 'Approved' },
  { id: 'rev-2', customerName: 'Bilal Ahmed', itemName: 'Tandoori Mixed Grill', rating: 4, comment: 'Great for sharing, could use a bit more char on the boti.', date: '2026-08-18', status: 'Approved' },
  { id: 'rev-3', customerName: 'Sana Malik', itemName: 'Lahori Fish Fry', rating: 3, comment: 'Good flavour but arrived a little cold.', date: '2026-08-15', status: 'Pending' },
  { id: 'rev-4', customerName: 'Usman Raza', itemName: 'Smoky Seekh Kebab', rating: 5, comment: 'Smoky, juicy, and the mint chutney is addictive.', date: '2026-08-12', status: 'Pending' },
]

export const deals: Deal[] = [
  { id: 'deal-1', title: 'Weekday Family Feast', description: '20% off on all BBQ platters, Monday to Thursday.', discountPercent: 20, code: 'FAMILY20', active: true, expiresOn: '2026-09-30' },
  { id: 'deal-2', title: 'First Order Welcome', description: '15% off for new customers on their first order.', discountPercent: 15, code: 'WELCOME15', active: true, expiresOn: '2026-12-31' },
  { id: 'deal-3', title: 'Weekend Karahi Special', description: '10% off Signature Handi Karahi on weekends.', discountPercent: 10, code: 'KARAHI10', active: false, expiresOn: '2026-08-01' },
]

export const customers: Customer[] = [
  { id: 'cus-1', name: 'Ayesha Khan', email: 'ayesha.khan@example.com', phone: '+92 300 1234567', orders: 14, totalSpent: 38650, joinedOn: '2025-02-11' },
  { id: 'cus-2', name: 'Bilal Ahmed', email: 'bilal.ahmed@example.com', phone: '+92 321 9876543', orders: 9, totalSpent: 24980, joinedOn: '2025-05-03' },
  { id: 'cus-3', name: 'Fatima Noor', email: 'fatima.noor@example.com', phone: '+92 333 4567890', orders: 21, totalSpent: 55210, joinedOn: '2024-11-22' },
  { id: 'cus-4', name: 'Hamza Sheikh', email: 'hamza.sheikh@example.com', phone: '+92 345 1122334', orders: 5, totalSpent: 12340, joinedOn: '2026-01-09' },
]

export const staff: StaffMember[] = [
  { id: 'stf-1', name: 'Imran Qureshi', email: 'imran@royalsofra.pk', role: 'Chef', status: 'Active' },
  { id: 'stf-2', name: 'Maria Yousaf', email: 'maria@royalsofra.pk', role: 'Manager', status: 'Active' },
  { id: 'stf-3', name: 'Ali Raza', email: 'ali@royalsofra.pk', role: 'Rider', status: 'Active' },
  { id: 'stf-4', name: 'Zainab Iqbal', email: 'zainab@royalsofra.pk', role: 'Support', status: 'Suspended' },
]

export const inventory: InventoryItem[] = [
  { id: 'inv-1', name: 'Chicken (kg)', unit: 'kg', quantity: 42, reorderLevel: 20, updatedOn: '2026-08-22' },
  { id: 'inv-2', name: 'Mutton (kg)', unit: 'kg', quantity: 12, reorderLevel: 15, updatedOn: '2026-08-22' },
  { id: 'inv-3', name: 'Basmati Rice (kg)', unit: 'kg', quantity: 80, reorderLevel: 30, updatedOn: '2026-08-21' },
  { id: 'inv-4', name: 'Charcoal (kg)', unit: 'kg', quantity: 18, reorderLevel: 25, updatedOn: '2026-08-20' },
  { id: 'inv-5', name: 'Naan Flour (kg)', unit: 'kg', quantity: 55, reorderLevel: 20, updatedOn: '2026-08-22' },
]

export const notifications: AdminNotification[] = [
  { id: 'ntf-1', title: 'New order received', detail: 'RS-10241 placed by Ayesha Khan.', time: '5 min ago', read: false },
  { id: 'ntf-2', title: 'Low stock alert', detail: 'Mutton is below reorder level.', time: '38 min ago', read: false },
  { id: 'ntf-3', title: 'New review submitted', detail: 'Usman Raza rated Smoky Seekh Kebab.', time: '2 hours ago', read: true },
  { id: 'ntf-4', title: 'Deal expiring soon', detail: 'Weekend Karahi Special expired on Aug 1.', time: '1 day ago', read: true },
]

export const revenueByDay = [
  { day: 'Mon', revenue: 84500 },
  { day: 'Tue', revenue: 91200 },
  { day: 'Wed', revenue: 76800 },
  { day: 'Thu', revenue: 102400 },
  { day: 'Fri', revenue: 138900 },
  { day: 'Sat', revenue: 165200 },
  { day: 'Sun', revenue: 149700 },
]
