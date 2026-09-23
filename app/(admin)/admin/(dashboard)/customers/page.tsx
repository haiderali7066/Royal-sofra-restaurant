import { AdminPageHeading } from '@/components/admin-page-heading'
import { customers } from '@/lib/mock-data'
import { initials, money } from '@/lib/format'

export default function AdminCustomersPage() {
  return (
    <>
      <AdminPageHeading title="Customers" description="View customer profiles, order history and lifetime spend." />
      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Contact</th>
              <th className="px-5 py-3">Orders</th>
              <th className="px-5 py-3">Total spent</th>
              <th className="px-5 py-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-b border-border last:border-0 hover:bg-secondary/50">
                <td className="flex items-center gap-3 px-5 py-4">
                  <span className="grid size-9 place-items-center rounded-full bg-secondary text-xs font-semibold text-primary">{initials(customer.name)}</span>
                  {customer.name}
                </td>
                <td className="px-5 py-4 text-muted-foreground">
                  <p>{customer.email}</p>
                  <p>{customer.phone}</p>
                </td>
                <td className="px-5 py-4">{customer.orders}</td>
                <td className="px-5 py-4 font-medium">{money(customer.totalSpent)}</td>
                <td className="px-5 py-4 text-muted-foreground">{customer.joinedOn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
