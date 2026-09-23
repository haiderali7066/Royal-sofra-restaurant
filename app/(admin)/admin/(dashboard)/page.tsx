import { ArrowUpRight, ChefHat, ShoppingBag, TrendingUp, Users } from 'lucide-react'
import { AdminPageHeading } from '@/components/admin-page-heading'
import { ordersCollection, dealsCollection } from '@/lib/collections'
import { getDb } from '@/lib/mongodb'
import { money, statusTone } from '@/lib/format'

export const dynamic = 'force-dynamic'

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default async function AdminDashboardPage() {
  const ordersCol = await ordersCollection()
  const dealsCol = await dealsCollection()
  const db = await getDb()
  const usersCol = db.collection('user')

  const [orders, deals, customerCount] = await Promise.all([
    ordersCol.find({}).sort({ placedAt: -1 }).limit(200).toArray(),
    dealsCol.find({}).toArray(),
    usersCol.countDocuments({ role: { $ne: 'admin' } }),
  ])

  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const recentOrders = orders.filter((order) => new Date(order.placedAt) >= sevenDaysAgo)

  const revenueByDay = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(sevenDaysAgo.getTime() + i * 24 * 60 * 60 * 1000)
    const dayOrders = recentOrders.filter((order) => new Date(order.placedAt).toDateString() === date.toDateString())
    return { day: DAY_NAMES[date.getDay()], revenue: dayOrders.reduce((sum, o) => sum + o.total, 0) }
  })

  const totalRevenue = revenueByDay.reduce((sum, day) => sum + day.revenue, 0)
  const activeDeals = deals.filter((deal) => deal.active).length
  const maxRevenue = Math.max(1, ...revenueByDay.map((day) => day.revenue))

  const stats = [
    { label: 'Revenue this week', value: money(totalRevenue), icon: TrendingUp },
    { label: 'Orders (last 7 days)', value: recentOrders.length.toString(), icon: ShoppingBag },
    { label: 'Total customers', value: customerCount.toString(), icon: Users },
    { label: 'Active deals', value: activeDeals.toString(), icon: ChefHat },
  ]

  return (
    <>
      <AdminPageHeading title="Dashboard" description="Overview of Royal Sofra's orders, revenue and activity." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="grid size-10 place-items-center rounded-full bg-secondary text-primary">
                <stat.icon size={18} />
              </span>
              <ArrowUpRight className="text-muted-foreground" size={16} />
            </div>
            <p className="mt-4 font-serif text-2xl">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-serif text-xl">Revenue this week</h2>
          <div className="mt-6 flex items-end gap-3">
            {revenueByDay.map((day, index) => (
              <div key={`${day.day}-${index}`} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-lg bg-primary/80"
                  style={{ height: `${Math.max(12, (day.revenue / maxRevenue) * 160)}px` }}
                />
                <span className="text-xs text-muted-foreground">{day.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-serif text-xl">Recent orders</h2>
          {orders.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">No orders yet.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between gap-3 text-sm">
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-xs text-muted-foreground">{order.customerName}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusTone(order.status)}`}>{order.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
