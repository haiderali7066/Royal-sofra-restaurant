import { Plus } from 'lucide-react'
import { AdminPageHeading } from '@/components/admin-page-heading'
import { inventory } from '@/lib/mock-data'

export default function AdminInventoryPage() {
  return (
    <>
      <AdminPageHeading
        title="Inventory"
        description="Track stock levels for key ingredients and supplies."
        action={
          <button className="inline-flex items-center gap-2 rounded-full bg-cta px-5 py-2.5 text-sm font-semibold text-cta-foreground">
            <Plus size={16} /> Add stock item
          </button>
        }
      />
      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3">Item</th>
              <th className="px-5 py-3">Quantity</th>
              <th className="px-5 py-3">Reorder level</th>
              <th className="px-5 py-3">Updated</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((entry) => {
              const low = entry.quantity <= entry.reorderLevel
              return (
                <tr key={entry.id} className="border-b border-border last:border-0 hover:bg-secondary/50">
                  <td className="px-5 py-4 font-medium">{entry.name}</td>
                  <td className="px-5 py-4">{entry.quantity} {entry.unit}</td>
                  <td className="px-5 py-4 text-muted-foreground">{entry.reorderLevel} {entry.unit}</td>
                  <td className="px-5 py-4 text-muted-foreground">{entry.updatedOn}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${low ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                      {low ? 'Reorder now' : 'In stock'}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
