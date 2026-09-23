import { NextResponse } from 'next/server'
import { getApiAdmin } from '@/lib/session'
import { getDb } from '@/lib/mongodb'
import { ordersCollection } from '@/lib/collections'

// Derives the customer list from Better Auth's user collection joined with order history,
// rather than maintaining a separate duplicate customers collection.
export async function GET() {
  const admin = await getApiAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = await getDb()
  const users = await db.collection('user').find({ role: { $ne: 'admin' } }).toArray()
  const orders = await ordersCollection()

  const customers = await Promise.all(
    users.map(async (u) => {
      const userOrders = await orders.find({ userId: String(u._id) }).toArray()
      const totalSpent = userOrders.reduce((sum, o) => sum + o.total, 0)
      return {
        id: String(u._id),
        name: u.name || u.email,
        email: u.email,
        phone: u.phone || '-',
        orders: userOrders.length,
        totalSpent,
        joinedOn: u.createdAt ? new Date(u.createdAt).toISOString().slice(0, 10) : '-',
      }
    }),
  )

  return NextResponse.json({ customers })
}
