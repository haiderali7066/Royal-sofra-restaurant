'use client'

import useSWR from 'swr'
import { Bell, CheckCircle2, Clock, PackageCheck, Truck, XCircle } from 'lucide-react'
import { AccountPageHeading } from '@/components/account-page-heading'
import { fetcher } from '@/lib/fetcher'
import type { Order, OrderStatus } from '@/lib/types'

const iconByStatus: Record<OrderStatus, typeof Bell> = {
  Pending: Clock,
  Confirmed: CheckCircle2,
  Preparing: Clock,
  'Out for delivery': Truck,
  Delivered: PackageCheck,
  Cancelled: XCircle,
}

const messageByStatus: Record<OrderStatus, string> = {
  Pending: 'is awaiting confirmation.',
  Confirmed: 'has been confirmed by the kitchen.',
  Preparing: 'is being prepared.',
  'Out for delivery': 'is out for delivery.',
  Delivered: 'has been delivered. Enjoy your meal!',
  Cancelled: 'was cancelled.',
}

export default function NotificationsPage() {
  const { data, isLoading } = useSWR<{ orders: Order[] }>('/api/orders', fetcher)
  const orders = [...(data?.orders ?? [])].sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime())

  return (
    <div className="space-y-6">
      <AccountPageHeading title="Notifications" description="Updates on your order activity." />

      {isLoading && <p className="text-sm text-muted-foreground">Loading notifications…</p>}

      {!isLoading && orders.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center">
          <Bell className="mx-auto text-muted-foreground" />
          <p className="mt-4 font-serif text-xl">No notifications yet.</p>
        </div>
      )}

      <div className="space-y-3">
        {orders.map((order) => {
          const Icon = iconByStatus[order.status]
          return (
            <div key={order.id} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary text-primary">
                <Icon size={16} />
              </span>
              <div>
                <p className="text-sm">
                  Order <span className="font-semibold">{order.id}</span> {messageByStatus[order.status]}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{new Date(order.placedAt).toLocaleString()}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
