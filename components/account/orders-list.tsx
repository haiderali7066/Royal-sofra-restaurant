'use client'

import Link from 'next/link'
import useSWR from 'swr'
import { PackageSearch } from 'lucide-react'
import { fetcher } from '@/lib/fetcher'
import { money, statusTone } from '@/lib/format'
import type { Order, OrderStatus } from '@/lib/types'

const activeStatuses: OrderStatus[] = ['Pending', 'Confirmed', 'Preparing', 'Out for delivery']

export function AccountOrdersList({ scope }: { scope: 'all' | 'active' }) {
  const { data, isLoading } = useSWR<{ orders: Order[] }>('/api/orders', fetcher)
  const orders = data?.orders ?? []
  const filtered = scope === 'active' ? orders.filter((order) => activeStatuses.includes(order.status)) : orders

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading orders…</p>
  }

  if (filtered.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-10 text-center">
        <PackageSearch className="mx-auto text-muted-foreground" />
        <p className="mt-4 font-serif text-xl">{scope === 'active' ? 'No active orders right now.' : 'No orders yet.'}</p>
        <Link href="/menu" className="mt-4 inline-block text-sm font-semibold text-primary">
          Browse the menu &rarr;
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {filtered.map((order) => (
        <div key={order.id} className="rounded-2xl border border-border bg-card p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-serif text-lg">{order.id}</p>
              <p className="text-sm text-muted-foreground">{new Date(order.placedAt).toLocaleString()}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(order.status)}`}>{order.status}</span>
            <span className="font-semibold text-primary">{money(order.total)}</span>
            <Link
              href={`/account/tracking?order=${encodeURIComponent(order.id)}`}
              className="rounded-full border border-border px-4 py-1.5 text-xs font-semibold hover:bg-secondary"
            >
              Track order
            </Link>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
            {order.items.map((item, index) => (
              <span key={`${order.id}-${index}`} className="rounded-full bg-secondary px-2.5 py-1">
                {item.qty}&times; {item.name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
