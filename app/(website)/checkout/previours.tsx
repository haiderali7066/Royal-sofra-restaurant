'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import { PageHeading } from '@/components/page-heading'
import { useCart } from '@/components/cart-context'
import { UseMyLocationButton } from '@/components/use-my-location-button'
import { useSession } from '@/lib/auth-client'
import { fetcher } from '@/lib/fetcher'
import { money } from '@/lib/format'
import type { SiteSettings } from '@/lib/types'

export default function CheckoutPage() {
  const { cart, total: subtotal, clearCart } = useCart()
  const { data: session, isPending: sessionPending } = useSession()
  const { data: settingsData } = useSWR<{ settings: SiteSettings }>('/api/settings', fetcher)
  const router = useRouter()

  const settings = settingsData?.settings

  const [form, setForm] = useState({ name: '', email: '', address: '', city: '', phone: '' })
  const [paymentMethod, setPaymentMethod] = useState<'GoPayfast' | 'Cash on delivery'>('GoPayfast')
  const [instrument, setInstrument] = useState<'card' | 'easypaisa' | 'jazzcash'>('card')
  const [card, setCard] = useState({ number: '', month: '', year: '', cvv: '' })
  const [otp, setOtp] = useState('')
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (session?.user) {
      setForm((current) => ({ ...current, name: session.user.name ?? '', email: session.user.email ?? '' }))
    }
  }, [session])

  // Once settings load, make sure the selected payment method is actually enabled.
  useEffect(() => {
    if (!settings) return
    if (paymentMethod === 'GoPayfast' && !settings.gopayfastEnabled && settings.codEnabled) {
      setPaymentMethod('Cash on delivery')
    } else if (paymentMethod === 'Cash on delivery' && !settings.codEnabled && settings.gopayfastEnabled) {
      setPaymentMethod('GoPayfast')
    }
  }, [settings, paymentMethod])

  const { deliveryFee, tax, total, belowMinimum } = useMemo(() => {
    if (!settings) return { deliveryFee: 0, tax: 0, total: subtotal, belowMinimum: false }
    const fee = subtotal >= settings.freeDeliveryThreshold ? 0 : settings.deliveryFee
    const taxAmount = Math.round((subtotal * settings.taxPercent) / 100)
    return {
      deliveryFee: fee,
      tax: taxAmount,
      total: subtotal + fee + taxAmount,
      belowMinimum: subtotal > 0 && subtotal < settings.minOrderAmount,
    }
  }, [settings, subtotal])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (cart.length === 0 || belowMinimum) return
    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart: cart.map((line) => ({ slug: line.item.slug, qty: line.qty })),
          customerName: form.name,
          customerEmail: form.email,
          customerPhone: form.phone,
          address: `${form.address}, ${form.city}`,
          paymentMethod,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong placing your order.')
        setSubmitting(false)
        return
      }

      if (paymentMethod === 'Cash on delivery') {
        clearCart()
        router.push(data.redirectUrl)
        return
      }

      // GoPayfast: order is created as Pending, now kick off the direct-API payment.
      const initiateRes = await fetch('/api/payments/gopayfast/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: data.order.id,
          instrument,
          ...(instrument === 'card'
            ? { cardNumber: card.number, cardExpiryMonth: card.month, cardExpiryYear: card.year, cardCvv: card.cvv }
            : {}),
        }),
      })
      const initiateData = await initiateRes.json()

      if (!initiateRes.ok) {
        setError(initiateData.error || 'Could not start the payment. Please try again.')
        setSubmitting(false)
        return
      }

      if (initiateData.paid) {
        clearCart()
        router.push(`/checkout/success?order=${data.order.id}`)
        return
      }

      // Gateway requires an OTP - hold the order id and show the OTP entry step.
      setPendingOrderId(data.order.id)
      setSubmitting(false)
    } catch {
      setError('Network error. Please try again.')
      setSubmitting(false)
    }
  }

  const handleVerifyOtp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!pendingOrderId || !otp) return
    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/payments/gopayfast/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: pendingOrderId, otp }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Incorrect OTP. Please try again.')
        setSubmitting(false)
        return
      }

      clearCart()
      router.push(`/checkout/success?order=${pendingOrderId}`)
    } catch {
      setError('Network error. Please try again.')
      setSubmitting(false)
    }
  }

  if (pendingOrderId) {
    return (
      <section className="mx-auto max-w-md px-5 py-14 md:px-8 md:py-24">
        <PageHeading
          eyebrow="Checkout"
          title="Enter your OTP."
          copy="GoPayfast sent a one-time code to confirm this payment. Enter it below to complete your order."
        />
        <form onSubmit={handleVerifyOtp} className="mt-8 space-y-4">
          {error && <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}
          <input
            required
            inputMode="numeric"
            placeholder="One-time code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-center text-lg tracking-widest"
          />
          <button
            type="submit"
            disabled={submitting || !otp}
            className="w-full rounded-full bg-cta py-3.5 text-sm font-semibold text-cta-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {submitting ? 'Verifying…' : 'Verify & pay'}
          </button>
        </form>
      </section>
    )
  }

  if (!sessionPending && !session?.user) {
    return (
      <section className="mx-auto max-w-md px-5 py-14 text-center md:px-8 md:py-24">
        <PageHeading eyebrow="Checkout" title="Sign in to check out." copy="Create a free account or sign in to place your order and track it from your account." />
        <button
          onClick={() => router.push('/login?redirect=/checkout')}
          className="mt-8 w-full rounded-full bg-cta py-3.5 text-sm font-semibold text-cta-foreground transition-transform hover:-translate-y-0.5"
        >
          Sign in to continue
        </button>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-5xl px-5 py-14 md:px-8 md:py-20">
      <PageHeading eyebrow="Checkout" title="Almost at the table." copy="Enter your details below to confirm your order." />
      <div className="mt-10 grid gap-8 md:grid-cols-[1fr_0.7fr]">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}
          <input
            required
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-xl border border-input bg-background px-4 py-3"
          />
          <input
            required
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-xl border border-input bg-background px-4 py-3"
          />
          <div>
            <input
              required
              placeholder="Delivery address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full rounded-xl border border-input bg-background px-4 py-3"
            />
            <UseMyLocationButton
              className="mt-2"
              onResolved={({ address, city }) =>
                setForm((current) => ({
                  ...current,
                  address: address || current.address,
                  city: city || current.city,
                }))
              }
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              required
              placeholder="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full rounded-xl border border-input bg-background px-4 py-3"
            />
            <input
              required
              placeholder="Phone number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full rounded-xl border border-input bg-background px-4 py-3"
            />
          </div>
          <fieldset className="rounded-xl border border-border p-4">
            <legend className="px-1 text-sm font-semibold">Payment method</legend>
            {settings?.gopayfastEnabled !== false && (
              <label className="mt-2 flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'GoPayfast'}
                  onChange={() => setPaymentMethod('GoPayfast')}
                />
                GoPayfast (card / EasyPaisa / JazzCash)
              </label>
            )}
            {settings?.codEnabled !== false && (
              <label className="mt-2 flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'Cash on delivery'}
                  onChange={() => setPaymentMethod('Cash on delivery')}
                />
                Cash on delivery
              </label>
            )}

            {paymentMethod === 'GoPayfast' && (
              <div className="mt-4 space-y-3 border-t border-border pt-4">
                <div className="grid grid-cols-3 gap-2">
                  {(['card', 'easypaisa', 'jazzcash'] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setInstrument(option)}
                      className={`rounded-lg border px-2 py-2 text-xs font-medium capitalize transition-colors ${
                        instrument === option
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-input text-muted-foreground hover:border-primary/50'
                      }`}
                    >
                      {option === 'card' ? 'Debit / Credit card' : option}
                    </button>
                  ))}
                </div>
                {instrument === 'card' && (
                  <div className="space-y-2">
                    <input
                      required
                      inputMode="numeric"
                      placeholder="Card number"
                      value={card.number}
                      onChange={(e) => setCard({ ...card, number: e.target.value })}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm"
                    />
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        required
                        inputMode="numeric"
                        placeholder="MM"
                        maxLength={2}
                        value={card.month}
                        onChange={(e) => setCard({ ...card, month: e.target.value })}
                        className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm"
                      />
                      <input
                        required
                        inputMode="numeric"
                        placeholder="YY"
                        maxLength={2}
                        value={card.year}
                        onChange={(e) => setCard({ ...card, year: e.target.value })}
                        className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm"
                      />
                      <input
                        required
                        inputMode="numeric"
                        placeholder="CVV"
                        maxLength={4}
                        value={card.cvv}
                        onChange={(e) => setCard({ ...card, cvv: e.target.value })}
                        className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm"
                      />
                    </div>
                  </div>
                )}
                {(instrument === 'easypaisa' || instrument === 'jazzcash') && (
                  <p className="text-xs text-muted-foreground">
                    You&apos;ll enter your {instrument === 'easypaisa' ? 'EasyPaisa' : 'JazzCash'} mobile account number
                    on the next step, then confirm with the OTP sent to your phone.
                  </p>
                )}
              </div>
            )}
          </fieldset>
          <button
            type="submit"
            disabled={cart.length === 0 || submitting || belowMinimum}
            className="w-full rounded-full bg-cta py-3.5 text-sm font-semibold text-cta-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {submitting ? 'Placing order…' : `Place order · ${money(total)}`}
          </button>
        </form>
        <aside className="h-fit rounded-2xl border border-border bg-card p-6">
          <h3 className="font-serif text-xl">Order summary</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {cart.map((line) => (
              <li key={line.item.id} className="flex justify-between text-muted-foreground">
                <span>{line.qty} &times; {line.item.name}</span>
                <span>{money(line.item.price * line.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1.5 border-t border-border pt-4 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{money(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Delivery fee</span>
              <span>{deliveryFee === 0 ? 'Free' : money(deliveryFee)}</span>
            </div>
            {tax > 0 && (
              <div className="flex justify-between text-muted-foreground">
                <span>Tax</span>
                <span>{money(tax)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-border pt-3 font-semibold">
              <span>Total</span>
              <span className="text-primary">{money(total)}</span>
            </div>
          </div>
          {settings && subtotal > 0 && subtotal < settings.freeDeliveryThreshold && (
            <p className="mt-3 text-xs text-muted-foreground">
              Add {money(settings.freeDeliveryThreshold - subtotal)} more for free delivery.
            </p>
          )}
          {belowMinimum && settings && (
            <p className="mt-3 text-xs text-destructive">Minimum order amount is {money(settings.minOrderAmount)}.</p>
          )}
        </aside>
      </div>
    </section>
  )
}
