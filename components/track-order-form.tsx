'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, Circle, PackageSearch } from 'lucide-react'
import { statusTone } from '@/lib/format'
import type { Order } from '@/lib/types'

const trackingSteps = ['Confirmed', 'Preparing', 'Out for delivery', 'Delivered']

export function TrackOrderForm() {
  const searchParams = useSearchParams()
  const [orderId, setOrderId] = useState(searchParams.get('order') ?? '')
  const [order, setOrder] = useState<Order | null>(null)
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)

  const runSearch = useCallback(async (id: string) => {
    if (!id.trim()) return
    setLoading(true)
    setSearched(true)
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(id.trim())}`)
      if (res.ok) {
        const data = await res.json()
        setOrder(data.order)
      } else {
        setOrder(null)
      }
    } catch {
      setOrder(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const fromQuery = searchParams.get('order')
    if (fromQuery) {
      setOrderId(fromQuery)
      runSearch(fromQuery)
    }
    // Only run on initial load / when the query param changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await runSearch(orderId)
  }

  return (
    <>
      <form onSubmit={handleSearch} className="mt-10 flex gap-3">
        <input
          value={orderId}
          onChange={(event) => setOrderId(event.target.value)}
          placeholder="e.g. RS-10241"
          className="flex-1 rounded-xl border border-input bg-background px-4 py-3"
        />
        <button type="submit" disabled={loading || !orderId.trim()} className="rounded-xl bg-cta px-6 py-3 text-sm font-semibold text-cta-foreground disabled:opacity-50">
          {loading ? 'Searching…' : 'Track'}
        </button>
      </form>

      {searched && !loading && !order && (
        <div className="mt-10 rounded-2xl border border-dashed border-border p-10 text-center">
          <PackageSearch className="mx-auto text-muted-foreground" />
          <p className="mt-4 font-serif text-xl">No order found with that ID.</p>
        </div>
      )}

      {order && (
        <div className="mt-10 rounded-2xl border border-border bg-card p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Order {order.id}</p>
              <p className="font-serif text-2xl">{order.customerName}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(order.status)}`}>{order.status}</span>
          </div>
          <ol className="mt-8 space-y-4">
            {trackingSteps.map((step) => {
              const reached = trackingSteps.indexOf(step) <= trackingSteps.indexOf(order.status)
              return (
                <li key={step} className="flex items-center gap-3 text-sm">
                  {reached ? <CheckCircle2 className="text-primary" size={18} /> : <Circle className="text-muted-foreground" size={18} />}
                  <span className={reached ? 'font-medium' : 'text-muted-foreground'}>{step}</span>
                </li>
              )
            })}
          </ol>
          <div className="mt-6 border-t border-border pt-4 text-sm text-muted-foreground">
            <p>Delivering to: {order.address}</p>
            <p className="mt-1">Placed on: {new Date(order.placedAt).toLocaleString()}</p>
          </div>
        </div>
      )}
    </>
  )
}
