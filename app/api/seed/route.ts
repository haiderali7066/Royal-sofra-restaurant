import { NextResponse } from 'next/server'
import { menuItemsCollection, blogPostsCollection, reviewsCollection, dealsCollection, staffCollection } from '@/lib/collections'
import { menuItems, blogPosts, reviews, deals, staff } from '@/lib/mock-data'
import { auth } from '@/lib/auth'
import { getDb } from '@/lib/mongodb'

const ADMIN_EMAIL = 'admin@royalsofra.pk'
const ADMIN_PASSWORD = 'RoyalSofra@2026'

// One-time idempotent seed route. Safe to call multiple times — skips collections that already have data.
export async function POST() {
  const results: Record<string, string> = {}

  // The menu was fully redesigned (new categories, ~90 dishes), so this
  // collection is unconditionally resynced on every seed call rather than
  // skipped when non-empty -- otherwise the site would keep serving the old
  // 12-item placeholder menu forever. Menu items aren't customer-owned data,
  // so a full replace here is safe.
  const menu = await menuItemsCollection()
  await menu.deleteMany({})
  await menu.insertMany(menuItems)
  results.menuItems = `resynced ${menuItems.length}`

  const blogs = await blogPostsCollection()
  if ((await blogs.countDocuments()) === 0) {
    await blogs.insertMany(blogPosts)
    results.blogPosts = `inserted ${blogPosts.length}`
  } else {
    results.blogPosts = 'already seeded'
  }

  const reviewsCol = await reviewsCollection()
  if ((await reviewsCol.countDocuments()) === 0) {
    await reviewsCol.insertMany(reviews)
    results.reviews = `inserted ${reviews.length}`
  } else {
    results.reviews = 'already seeded'
  }

  const dealsCol = await dealsCollection()
  if ((await dealsCol.countDocuments()) === 0) {
    await dealsCol.insertMany(deals)
    results.deals = `inserted ${deals.length}`
  } else {
    results.deals = 'already seeded'
  }

  const staffCol = await staffCollection()
  if ((await staffCol.countDocuments()) === 0) {
    await staffCol.insertMany(staff)
    results.staff = `inserted ${staff.length}`
  } else {
    results.staff = 'already seeded'
  }

  const db = await getDb()
  const usersCol = db.collection('user')
  const existingAdmin = await usersCol.findOne({ email: ADMIN_EMAIL })
  if (!existingAdmin) {
    await auth.api.signUpEmail({
      body: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD, name: 'Royal Sofra Admin' },
    })
    await usersCol.updateOne({ email: ADMIN_EMAIL }, { $set: { role: 'admin' } })
    results.adminAccount = `created ${ADMIN_EMAIL}`
  } else if (existingAdmin.role !== 'admin') {
    await usersCol.updateOne({ email: ADMIN_EMAIL }, { $set: { role: 'admin' } })
    results.adminAccount = 'role fixed'
  } else {
    results.adminAccount = 'already exists'
  }

  return NextResponse.json({ ok: true, results })
}
