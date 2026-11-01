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

// Digits only, with country code, no "+" or spaces. e.g. 923001234567
// Set NEXT_PUBLIC_WHATSAPP_NUMBER in .env, or replace the fallback below.
const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923459567444').replace(/\D/g, '')

export default function CheckoutPage() {
  const { cart, total: subtotal, clearCart } = useCart()
  const { data: session } = useSession()
  const { data: settingsData } = useSWR<{ settings: SiteSettings }>('/api/settings', fetcher)
  const router = useRouter()

  const settings = settingsData?.settings

  const [form, setForm] = useState({ name: '', email: '', address: '', city: '', phone: '', notes: '' })
  const [error, setError] = useState('')

  // Prefill from the account when signed in (optional - guests can still order).
  useEffect(() => {
    if (session?.user) {
      setForm((current) => ({
        ...current,
        name: current.name || session.user.name || '',
        email: current.email || session.user.email || '',
      }))
    }
  }, [session])

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

  const buildMessage = () => {
    const lines = cart.map(
      (line, i) => `${i + 1}. ${line.qty} x ${line.item.name} - ${money(line.item.price * line.qty)}`,
    )

    return [
      '*New Order*',
      '',
      '*Customer*',
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      form.email ? `Email: ${form.email}` : null,
      `Address: ${form.address}, ${form.city}`,
      '',
      '*Order items*',
      ...lines,
      '',
      '*Summary*',
      `Subtotal: ${money(subtotal)}`,
      `Delivery: ${deliveryFee === 0 ? 'Free' : money(deliveryFee)}`,
      tax > 0 ? `Tax: ${money(tax)}` : null,
      `*Total: ${money(total)}*`,
      form.notes.trim() ? '' : null,
      form.notes.trim() ? `Notes: ${form.notes.trim()}` : null,
    ]
      .filter((line) => line !== null)
      .join('\n')
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (cart.length === 0 || belowMinimum) return
    setError('')

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage())}`

    // Must open synchronously inside the click handler so popup blockers allow it.
    const opened = window.open(url, '_blank', 'noopener,noreferrer')
    if (!opened) {
      // Popup blocked (common on mobile browsers) - fall back to same-tab navigation.
      window.location.href = url
      return
    }

    clearCart()
    router.push('/')
  }

  return (
    <section className="mx-auto max-w-5xl px-5 py-14 md:px-8 md:py-20">
      <PageHeading
        eyebrow="Checkout"
        title="Almost at the table."
        copy="Enter your details and we'll send your full order to us on WhatsApp to confirm."
      />
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
            type="email"
            placeholder="Email address (optional)"
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
              type="tel"
              placeholder="Phone number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full rounded-xl border border-input bg-background px-4 py-3"
            />
          </div>
          <textarea
            rows={3}
            placeholder="Order notes (optional)"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="w-full rounded-xl border border-input bg-background px-4 py-3"
          />
          <p className="text-xs text-muted-foreground">
            Payment is arranged directly with us on WhatsApp after we confirm your order.
          </p>
          <button
            type="submit"
            disabled={cart.length === 0 || belowMinimum}
            className="w-full rounded-full bg-cta py-3.5 text-sm font-semibold text-cta-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            Order on WhatsApp · {money(total)}
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