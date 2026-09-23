import { NextResponse } from 'next/server'
import { ordersCollection } from '@/lib/collections'
import { getApiAdmin } from '@/lib/session'

// Lightweight polling endpoint for the admin "new order" alert. Returns how
// many orders were created after `since`, plus a short preview list, so the
// admin layout can show a toast + play a sound without loading the full
// orders list on every poll.
export async function GET(request: Request) {
  const admin = await getApiAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const since = searchParams.get('since')
  const sinceDate = since ? new Date(since) : new Date(0)

  const orders = await ordersCollection()
  const newOrders = await orders
    .find({ placedAt: { $gt: sinceDate.toISOString() } })
    .sort({ placedAt: -1 })
    .limit(10)
    .toArray()

  return NextResponse.json({
    count: newOrders.length,
    orders: newOrders.map((order) => ({
      id: order.id,
      customerName: order.customerName,
      total: order.total,
      placedAt: order.placedAt,
    })),
    serverTime: new Date().toISOString(),
  })
}
