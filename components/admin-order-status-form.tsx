'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { OrderStatus, PaymentStatus } from '@/lib/types'

const statusOptions: OrderStatus[] = ['Pending', 'Confirmed', 'Preparing', 'Out for delivery', 'Delivered', 'Cancelled']
const paymentOptions: PaymentStatus[] = ['Pending', 'Paid', 'Failed']

export function AdminOrderStatusForm({
  orderId,
  currentStatus,
  currentPaymentStatus,
}: {
  orderId: string
  currentStatus: OrderStatus
  currentPaymentStatus: PaymentStatus
}) {
  const router = useRouter()
  const [status, setStatus] = useState<OrderStatus>(currentStatus)
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(currentPaymentStatus)
  const [saving, setSaving] = useState<'status' | 'payment' | null>(null)
  const [error, setError] = useState('')

  const update = async (field: 'status' | 'payment', body: Record<string, string>) => {
    setSaving(field)
    setError('')
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to update order')
      }
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order')
    } finally {
      setSaving(null)
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h2 className="font-serif text-xl">Manage order</h2>
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}

      <div className="mt-4">
        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Fulfillment status</label>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as OrderStatus)}
          className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
        >
          {statusOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <button
          onClick={() => update('status', { status })}
          disabled={saving === 'status' || status === currentStatus}
          className="mt-2 w-full rounded-full bg-cta py-2.5 text-sm font-semibold text-cta-foreground disabled:opacity-60"
        >
          {saving === 'status' ? 'Saving...' : 'Update status'}
        </button>
      </div>

      <div className="mt-5 border-t border-border pt-5">
        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Payment status</label>
        <select
          value={paymentStatus}
          onChange={(event) => setPaymentStatus(event.target.value as PaymentStatus)}
          className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
        >
          {paymentOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <button
          onClick={() => update('payment', { paymentStatus })}
          disabled={saving === 'payment' || paymentStatus === currentPaymentStatus}
          className="mt-2 w-full rounded-full bg-secondary py-2.5 text-sm font-semibold text-secondary-foreground disabled:opacity-60"
        >
          {saving === 'payment' ? 'Saving...' : 'Update payment status'}
        </button>
      </div>
    </div>
  )
}
