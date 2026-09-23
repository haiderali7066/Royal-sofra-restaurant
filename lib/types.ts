export type MenuCategory =
  | 'Appetizers'
  | 'Pakistani Handi'
  | 'Special Karahi'
  | 'BBQ & Kabab Fries'
  | 'Royal Shinwari'
  | 'Royal BBQ'
  | 'Chinese'
  | 'Platters'
  | 'Bar & Shakes'
  | 'Drinks'
  | 'Ice Cream'
  | 'Tandoor'

export interface MenuItem {
  id: string
  slug: string
  name: string
  category: MenuCategory
  description: string
  price: number
  image: string
  tag: string
  spiceLevel: 1 | 2 | 3
  isAvailable: boolean
  isFeatured: boolean
  // Raw display string for items whose pricing doesn't reduce to a single
  // number, e.g. "Half Rs. 1,299 / Full Rs. 2,290" or "Rs. 99 / Per Head".
  // `price` still holds a single numeric charge (the higher/standard tier)
  // so cart totals stay simple; priceNote overrides the display only.
  priceNote?: string
  // Flavour/variant names offered at the same price (e.g. bar & shake
  // flavours) — informational chips only, not separate line items.
  options?: string[]
}

export interface CartLine {
  item: MenuItem
  qty: number
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Preparing' | 'Out for delivery' | 'Delivered' | 'Cancelled'

export interface OrderItem {
  name: string
  qty: number
  price: number
}

export type PaymentStatus = 'Pending' | 'Paid' | 'Failed'

export interface Order {
  id: string
  userId?: string
  customerName: string
  customerEmail: string
  customerPhone: string
  address: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  paymentMethod: 'GoPayfast' | 'Cash on delivery'
  paymentStatus: PaymentStatus
  placedAt: string
}

// A short-lived bridge between the gopayfast.com "initiate" and "verify OTP" calls.
// gopayfast's API is stateless per-call, so we hold the access token and instrument
// details server-side between the two steps instead of trusting the client with them.
export interface PendingGopayfastPayment {
  orderId: string
  accessToken: string
  basketId: string
  amount: number
  instrument: 'card' | 'easypaisa' | 'jazzcash'
  createdAt: string
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  author: string
  date: string
  image: string
  published: boolean
}

export interface Review {
  id: string
  customerName: string
  itemName: string
  rating: 1 | 2 | 3 | 4 | 5
  comment: string
  date: string
  status: 'Pending' | 'Approved' | 'Rejected'
}

export interface Deal {
  id: string
  title: string
  description: string
  discountPercent: number
  code: string
  active: boolean
  expiresOn: string
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  orders: number
  totalSpent: number
  joinedOn: string
}

export interface StaffMember {
  id: string
  name: string
  email: string
  role: 'Owner' | 'Manager' | 'Chef' | 'Rider' | 'Support'
  status: 'Active' | 'Suspended'
}

export interface InventoryItem {
  id: string
  name: string
  unit: string
  quantity: number
  reorderLevel: number
  updatedOn: string
}

export interface AdminNotification {
  id: string
  title: string
  detail: string
  time: string
  read: boolean
}

export interface Address {
  id: string
  userId: string
  label: string
  line1: string
  city: string
  phone: string
  isDefault: boolean
  createdAt: string
}

export interface NewsletterSubscriber {
  email: string
  subscribedAt: string
}

export interface SiteSettings {
  id: 'site'
  deliveryFee: number
  freeDeliveryThreshold: number
  taxPercent: number
  minOrderAmount: number
  codEnabled: boolean
  gopayfastEnabled: boolean
}
