import { NextRequest, NextResponse } from 'next/server'
import { getApiUser } from '@/lib/session'
import { ordersCollection, pendingGopayfastPaymentsCollection } from '@/lib/collections'
import { validateOtp } from '@/lib/gopayfast'

// Step 2 of the gopayfast.com flow: the customer submits the OTP they received, we replay
// it against gopayfast with the access token saved during initiate, and mark the order paid
// on success.
export async function POST(request: NextRequest) {
  const user = await getApiUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { orderId, otp } = body as { orderId: string; otp: string }
  if (!orderId || !otp) {
    return NextResponse.json({ error: 'Missing order id or OTP' }, { status: 400 })
  }

  const orders = await ordersCollection()
  const order = await orders.findOne({ id: orderId, userId: user.id })
  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  const pending = await pendingGopayfastPaymentsCollection()
  const pendingPayment = await pending.findOne({ orderId })
  if (!pendingPayment) {
    return NextResponse.json({ error: 'No pending payment found for this order. Please try again.' }, { status: 400 })
  }

  try {
    const result = await validateOtp({
      accessToken: pendingPayment.accessToken,
      basketId: pendingPayment.basketId,
      otp,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.message || 'Incorrect OTP. Please try again.' }, { status: 400 })
    }

    await orders.updateOne({ id: orderId }, { $set: { paymentStatus: 'Paid', status: 'Confirmed' } })
    await pending.deleteOne({ orderId })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] gopayfast OTP verification failed', error)
    return NextResponse.json({ error: 'Could not verify OTP. Please try again.' }, { status: 502 })
  }
}
