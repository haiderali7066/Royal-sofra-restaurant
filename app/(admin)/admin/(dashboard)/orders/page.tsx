'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import { Search } from 'lucide-react'
import { AdminPageHeading } from '@/components/admin-page-heading'
import { fetcher } from '@/lib/fetcher'
import { money, orderStatusTone, paymentStatusTone } from '@/lib/format'
import type { Order, OrderStatus } from '@/lib/types'

const filterTabs: { label: string; value: OrderStatus | 'All' | 'Active' }[] = [
  { label: 'All', value: 'All' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Active', value: 'Active' },
  { label: 'Delivered', value: 'Delivered' },
  { label: 'Cancelled', value: 'Cancelled' },
]

const activeStatuses: OrderStatus[] = ['Confirmed', 'Preparing', 'Out for delivery']

function isToday(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()
}

export default function AdminOrdersPage() {
  const { data, isLoading } = useSWR<{ orders: Order[] }>('/api/orders', fetcher, { refreshInterval: 15000 })
  const [filter, setFilter] = useState<(typeof filterTabs)[number]['value']>('All')
  const [query, setQuery] = useState('')

  const orders = data?.orders ?? []

  const stats = useMemo(() => {
    const pending = orders.filter((o) => o.status === 'Pending').length
    const active = orders.filter((o) => activeStatuses.includes(o.status)).length
    const deliveredToday = orders.filter((o) => o.status === 'Delivered' && isToday(o.placedAt)).length
    const revenueToday = orders.filter((o) => isToday(o.placedAt) && o.status !== 'Cancelled').reduce((sum, o) => sum + o.total, 0)
    return { total: orders.length, pending, active, deliveredToday, revenueToday }
  }, [orders])

  const filtered = useMemo(() => {
    let list = orders
    if (filter === 'Active') list = list.filter((o) => activeStatuses.includes(o.status))
    else if (filter !== 'All') list = list.filter((o) => o.status === filter)

    const q = query.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (o) => o.id.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q) || o.customerPhone.toLowerCase().includes(q),
      )
    }
    return list
  }, [orders, filter, query])

  return (
    <>
      <AdminPageHeading title="Orders" description="Manage incoming orders and update fulfillment status." />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Total orders', value: stats.total },
          { label: 'Pending', value: stats.pending },
          { label: 'In progress', value: stats.active },
          { label: "Today's revenue", value: money(stats.revenueToday) },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-card p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{stat.label}</p>
            <p className="mt-1 font-serif text-2xl">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                filter === tab.value ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative sm:w-64">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search order, customer, phone"
            className="w-full rounded-full border border-input bg-background py-2.5 pl-10 pr-4 text-sm"
          />
        </div>
      </div>

      {isLoading ? (
        <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">Loading orders...</p>
      ) : filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          {orders.length === 0 ? 'No orders yet.' : 'No orders match your filters.'}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3">Order</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Placed</th>
                <th className="px-5 py-3">Payment</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id} className="border-b border-border last:border-0 hover:bg-secondary/50">
                  <td className="px-5 py-4">
                    <Link href={`/admin/orders/${order.id}`} className="font-semibold text-primary">
                      {order.id}
                    </Link>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-xs text-muted-foreground">{order.customerPhone}</p>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{new Date(order.placedAt).toLocaleString('en-PK')}</td>
                  <td className="px-5 py-4">
                    <p className="text-muted-foreground">{order.paymentMethod}</p>
                    <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${paymentStatusTone(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-medium">{money(order.total)}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${orderStatusTone(order.status)}`}>{order.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
