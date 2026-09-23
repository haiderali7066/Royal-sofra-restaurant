import { NextRequest, NextResponse } from 'next/server'
import { getApiUser } from '@/lib/session'
import { ordersCollection, pendingGopayfastPaymentsCollection } from '@/lib/collections'
import { getAccessToken, postTransaction, isGopayfastConfigured, type GopayfastInstrument } from '@/lib/gopayfast'

// Step 1 of the gopayfast.com flow: exchange credentials for an access token, submit the
// instrument details, and report back whether an OTP is required. Card/wallet details are
// forwarded directly to gopayfast and never stored - only the access token + basket id are
// held server-side (in pending_gopayfast_payments) so the OTP step can be validated.
export async function POST(request: NextRequest) {
  const user = await getApiUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isGopayfastConfigured()) {
    return NextResponse.json(
      { error: 'Online payments are not configured yet. Please choose Cash on delivery instead.' },
      { status: 503 },
    )
  }

  const body = await request.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { orderId, instrument, cardNumber, cardExpiryMonth, cardExpiryYear, cardCvv } = body as {
    orderId: string
    instrument: GopayfastInstrument
    cardNumber?: string
    cardExpiryMonth?: string
    cardExpiryYear?: string
    cardCvv?: string
  }

  if (!orderId || !['card', 'easypaisa', 'jazzcash'].includes(instrument)) {
    return NextResponse.json({ error: 'Missing or invalid payment details' }, { status: 400 })
  }

  const orders = await ordersCollection()
  const order = await orders.findOne({ id: orderId, userId: user.id })
  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }
  if (order.paymentStatus === 'Paid') {
    return NextResponse.json({ error: 'This order has already been paid' }, { status: 400 })
  }
  if (instrument === 'card' && (!cardNumber || !cardExpiryMonth || !cardExpiryYear || !cardCvv)) {
    return NextResponse.json({ error: 'Missing card details' }, { status: 400 })
  }

  const baseUrl = process.env.BETTER_AUTH_URL || `${request.nextUrl.protocol}//${request.nextUrl.host}`

  try {
    const accessToken = await getAccessToken(order.id, order.total)
    const result = await postTransaction({
      accessToken,
      basketId: order.id,
      amount: order.total,
      orderId: order.id,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerMobile: order.customerPhone,
      instrument,
      successUrl: `${baseUrl}/checkout/success?order=${order.id}`,
      failUrl: `${baseUrl}/checkout/cancelled?order=${order.id}`,
      cardNumber,
      cardExpiryMonth,
      cardExpiryYear,
      cardCvv,
    })

    const pending = await pendingGopayfastPaymentsCollection()
    await pending.updateOne(
      { orderId: order.id },
      {
        $set: {
          orderId: order.id,
          accessToken,
          basketId: order.id,
          amount: order.total,
          instrument,
          createdAt: new Date().toISOString(),
        },
      },
      { upsert: true },
    )

    if (result.requiresOtp) {
      return NextResponse.json({ requiresOtp: true })
    }

    // Some instruments may complete without an OTP step.
    if (result.status === 'SUCCESS' || result.status === '00' || result.status === 'APPROVED') {
      await orders.updateOne({ id: order.id }, { $set: { paymentStatus: 'Paid', status: 'Confirmed' } })
      return NextResponse.json({ requiresOtp: false, paid: true })
    }

    return NextResponse.json({ error: result.message || 'Payment could not be initiated' }, { status: 400 })
  } catch (error) {
    console.error('[v0] gopayfast initiate failed', error)
    return NextResponse.json({ error: 'Could not reach the payment gateway. Please try again.' }, { status: 502 })
  }
}
