import { NextRequest, NextResponse } from 'next/server'
import { ordersCollection, menuItemsCollection } from '@/lib/collections'
import { getApiUser } from '@/lib/session'
import { getSiteSettings } from '@/lib/settings'
import type { Order, OrderItem } from '@/lib/types'

function generateOrderId(): string {
  return `RS-${Math.floor(10000 + Math.random() * 89999)}`
}

// GET: list orders. Admins see all orders; signed-in customers see only their own.
export async function GET(request: NextRequest) {
  const user = await getApiUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const orders = await ordersCollection()
  const query = user.role === 'admin' ? {} : { userId: user.id }
  const results = await orders.find(query).sort({ placedAt: -1 }).limit(200).toArray()
  return NextResponse.json({ orders: results })
}

// POST: create a new order from the cart, validating prices/quantities server-side.
// Ordering requires a signed-in customer so orders can be tracked and disputes resolved.
export async function POST(request: NextRequest) {
  const user = await getApiUser()
  if (!user) {
    return NextResponse.json({ error: 'You must be signed in to place an order' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { cart, customerName, customerEmail, customerPhone, address, paymentMethod } = body as {
    cart: { slug: string; qty: number }[]
    customerName: string
    customerEmail: string
    customerPhone: string
    address: string
    paymentMethod: 'GoPayfast' | 'Cash on delivery'
  }

  if (!Array.isArray(cart) || cart.length === 0) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
  }
  if (!customerName || !customerEmail || !customerPhone || !address) {
    return NextResponse.json({ error: 'Missing required customer details' }, { status: 400 })
  }
  if (paymentMethod !== 'GoPayfast' && paymentMethod !== 'Cash on delivery') {
    return NextResponse.json({ error: 'Invalid payment method' }, { status: 400 })
  }

  const settings = await getSiteSettings()
  if (paymentMethod === 'Cash on delivery' && !settings.codEnabled) {
    return NextResponse.json({ error: 'Cash on delivery is currently unavailable' }, { status: 400 })
  }
  if (paymentMethod === 'GoPayfast' && !settings.gopayfastEnabled) {
    return NextResponse.json({ error: 'Online payment is currently unavailable' }, { status: 400 })
  }

  const MAX_QTY_PER_ITEM = 20
  for (const line of cart) {
    if (!line.slug || !Number.isInteger(line.qty) || line.qty <= 0 || line.qty > MAX_QTY_PER_ITEM) {
      return NextResponse.json({ error: 'Invalid cart line item' }, { status: 400 })
    }
  }

  const menu = await menuItemsCollection()
  const slugs = cart.map((c) => c.slug)
  const dbItems = await menu.find({ slug: { $in: slugs } }).toArray()
  const dbItemBySlug = new Map(dbItems.map((it) => [it.slug, it]))

  const orderItems: OrderItem[] = []
  let subtotal = 0
  for (const line of cart) {
    const dbItem = dbItemBySlug.get(line.slug)
    if (!dbItem || !dbItem.isAvailable) {
      return NextResponse.json({ error: `Item unavailable: ${line.slug}` }, { status: 400 })
    }
    orderItems.push({ name: dbItem.name, qty: line.qty, price: dbItem.price })
    subtotal += dbItem.price * line.qty
  }

  if (subtotal < settings.minOrderAmount) {
    return NextResponse.json({ error: `Minimum order amount is Rs. ${settings.minOrderAmount}` }, { status: 400 })
  }

  const deliveryFee = subtotal >= settings.freeDeliveryThreshold ? 0 : settings.deliveryFee
  const tax = Math.round((subtotal * settings.taxPercent) / 100)
  const total = subtotal + deliveryFee + tax

  const orderId = generateOrderId()

  const order: Order = {
    id: orderId,
    userId: user.id,
    customerName,
    customerEmail,
    customerPhone,
    address,
    items: orderItems,
    total,
    status: 'Pending',
    paymentMethod,
    paymentStatus: paymentMethod === 'Cash on delivery' ? 'Pending' : 'Pending',
    placedAt: new Date().toISOString(),
  }

  const orders = await ordersCollection()
  await orders.insertOne(order)

  if (paymentMethod === 'Cash on delivery') {
    return NextResponse.json({ order, redirectUrl: `/checkout/success?order=${orderId}` })
  }

  // GoPayfast: the order is created as Pending; the client then calls
  // /api/payments/gopayfast/initiate with the chosen instrument to start the card/wallet flow.
  return NextResponse.json({ order })
}
