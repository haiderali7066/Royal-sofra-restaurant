'use client'

import Link from 'next/link'
import useSWR from 'swr'
import { Bell, ListOrdered, MapPin, Star, Truck } from 'lucide-react'
import { AccountPageHeading } from '@/components/account-page-heading'
import { useSession } from '@/lib/auth-client'
import { fetcher } from '@/lib/fetcher'
import { money, statusTone } from '@/lib/format'
import type { Address, Order, Review } from '@/lib/types'

const activeStatuses = ['Pending', 'Confirmed', 'Preparing', 'Out for delivery']

export default function AccountDashboardPage() {
  const { data: session } = useSession()
  const { data: ordersData } = useSWR<{ orders: Order[] }>('/api/orders', fetcher)
  const { data: addressesData } = useSWR<{ addresses: Address[] }>('/api/account/addresses', fetcher)
  const { data: reviewsData } = useSWR<{ reviews: Review[] }>('/api/reviews', fetcher)

  const orders = ordersData?.orders ?? []
  const activeOrders = orders.filter((order) => activeStatuses.includes(order.status))
  const addresses = addressesData?.addresses ?? []
  const identity = session?.user?.name || session?.user?.email || ''
  const myReviews = (reviewsData?.reviews ?? []).filter((review) => review.customerName === identity)

  const stats = [
    { label: 'Active orders', value: activeOrders.length, icon: Truck, href: '/account/orders/active' },
    { label: 'Total orders', value: orders.length, icon: ListOrdered, href: '/account/orders' },
    { label: 'Saved addresses', value: addresses.length, icon: MapPin, href: '/account/addresses' },
    { label: 'Reviews given', value: myReviews.length, icon: Star, href: '/account/reviews' },
  ]

  return (
    <div className="space-y-6">
      <AccountPageHeading
        title={`Welcome back${session?.user?.name ? `, ${session.user.name.split(' ')[0]}` : ''}.`}
        description="Here's a quick look at your orders, addresses and reviews."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
            >
              <span className="grid size-10 place-items-center rounded-full bg-secondary text-primary">
                <Icon size={18} />
              </span>
              <p className="mt-4 font-serif text-3xl">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </Link>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl">Recent orders</h2>
            <Link href="/account/orders" className="text-sm font-semibold text-primary">
              View all
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {orders.length === 0 && <p className="text-sm text-muted-foreground">You haven&apos;t placed any orders yet.</p>}
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-3.5">
                <div>
                  <p className="font-serif text-base">{order.id}</p>
                  <p className="text-xs text-muted-foreground">{new Date(order.placedAt).toLocaleDateString()}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(order.status)}`}>{order.status}</span>
                <span className="font-semibold text-primary">{money(order.total)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl">Quick actions</h2>
            <Bell size={18} className="text-muted-foreground" />
          </div>
          <div className="mt-4 space-y-2">
            <Link href="/account/tracking" className="block rounded-xl border border-border px-4 py-3 text-sm hover:bg-secondary">
              Track an order
            </Link>
            <Link href="/account/addresses" className="block rounded-xl border border-border px-4 py-3 text-sm hover:bg-secondary">
              Manage saved addresses
            </Link>
            <Link href="/account/reviews" className="block rounded-xl border border-border px-4 py-3 text-sm hover:bg-secondary">
              Leave a review
            </Link>
            <Link href="/account/profile" className="block rounded-xl border border-border px-4 py-3 text-sm hover:bg-secondary">
              Update your profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
