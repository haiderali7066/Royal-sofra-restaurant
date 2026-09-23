import { getDb } from '@/lib/mongodb'
import type {
  MenuItem,
  Order,
  BlogPost,
  Review,
  Deal,
  Customer,
  StaffMember,
  Address,
  SiteSettings,
  PendingGopayfastPayment,
  NewsletterSubscriber,
} from '@/lib/types'

export async function menuItemsCollection() {
  const db = await getDb()
  return db.collection<MenuItem>('menu_items')
}

export async function ordersCollection() {
  const db = await getDb()
  return db.collection<Order>('orders')
}

export async function blogPostsCollection() {
  const db = await getDb()
  return db.collection<BlogPost>('blog_posts')
}

export async function reviewsCollection() {
  const db = await getDb()
  return db.collection<Review>('reviews')
}

export async function dealsCollection() {
  const db = await getDb()
  return db.collection<Deal>('deals')
}

export async function customersCollection() {
  const db = await getDb()
  return db.collection<Customer>('customers')
}

export async function staffCollection() {
  const db = await getDb()
  return db.collection<StaffMember>('staff')
}

export async function addressesCollection() {
  const db = await getDb()
  return db.collection<Address>('addresses')
}

export async function settingsCollection() {
  const db = await getDb()
  return db.collection<SiteSettings>('settings')
}

export async function pendingGopayfastPaymentsCollection() {
  const db = await getDb()
  return db.collection<PendingGopayfastPayment>('pending_gopayfast_payments')
}

export async function newsletterSubscribersCollection() {
  const db = await getDb()
  return db.collection<NewsletterSubscriber>('newsletter_subscribers')
}
