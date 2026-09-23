import { Download } from 'lucide-react'
import { AdminPageHeading } from '@/components/admin-page-heading'
import { customers, orders, revenueByDay } from '@/lib/mock-data'
import { money } from '@/lib/format'

export default function AdminReportsPage() {
  const totalRevenue = revenueByDay.reduce((sum, day) => sum + day.revenue, 0)
  const avgOrderValue = Math.round(totalRevenue / Math.max(1, orders.length))

  const reportCards = [
    { label: 'Weekly revenue', value: money(totalRevenue) },
    { label: 'Average order value', value: money(avgOrderValue) },
    { label: 'Total customers', value: customers.length.toString() },
  ]

  const exportOptions = ['Sales report (CSV)', 'Orders report (Excel)', 'Customer report (CSV)']

  return (
    <>
      <AdminPageHeading title="Reports" description="Financial performance and exportable business reports." />
      <div className="grid gap-4 sm:grid-cols-3">
        {reportCards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-border bg-card p-5">
            <p className="font-serif text-2xl">{card.value}</p>
            <p className="text-sm text-muted-foreground">{card.label}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-serif text-xl">Export reports</h2>
        <div className="mt-4 space-y-3">
          {exportOptions.map((option) => (
            <div key={option} className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm">
              <span>{option}</span>
              <button className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                <Download size={14} /> Export
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
