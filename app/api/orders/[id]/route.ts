import { NextRequest, NextResponse } from 'next/server'
import { ordersCollection } from '@/lib/collections'
import { getApiAdmin } from '@/lib/session'
import type { Order, OrderStatus, PaymentStatus } from '@/lib/types'

const VALID_STATUSES: OrderStatus[] = ['Pending', 'Confirmed', 'Preparing', 'Out for delivery', 'Delivered', 'Cancelled']
const VALID_PAYMENT_STATUSES: PaymentStatus[] = ['Pending', 'Paid', 'Failed']

// Order lookup by ID is intentionally public (used for guest order tracking).
// The order ID itself (e.g. RS-10241) acts as the lookup token; no sensitive
// data beyond what the customer already knows from their own order is exposed.
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const orders = await ordersCollection()
  const order = await orders.findOne({ id })
  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  return NextResponse.json({ order })
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getApiAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json().catch(() => null)
  const status = body?.status as OrderStatus | undefined
  const paymentStatus = body?.paymentStatus as PaymentStatus | undefined

  if (status === undefined && paymentStatus === undefined) {
    return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
  }
  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }
  if (paymentStatus !== undefined && !VALID_PAYMENT_STATUSES.includes(paymentStatus)) {
    return NextResponse.json({ error: 'Invalid payment status' }, { status: 400 })
  }

  const update: Partial<Pick<Order, 'status' | 'paymentStatus'>> = {}
  if (status !== undefined) update.status = status
  if (paymentStatus !== undefined) update.paymentStatus = paymentStatus

  const orders = await ordersCollection()
  const result = await orders.findOneAndUpdate({ id }, { $set: update }, { returnDocument: 'after' })
  if (!result) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  return NextResponse.json({ order: result })
}
