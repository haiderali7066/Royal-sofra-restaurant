import { Plus } from 'lucide-react'
import { AdminPageHeading } from '@/components/admin-page-heading'
import { menuCategories } from '@/lib/mock-data'
import { menuItemsCollection } from '@/lib/collections'

export const dynamic = 'force-dynamic'

export default async function AdminCategoriesPage() {
  const menu = await menuItemsCollection()
  const items = await menu.find({}).toArray()

  return (
    <>
      <AdminPageHeading
        title="Categories"
        description="Organize your menu into categories customers can browse. Add items to a category from the Menu page."
        action={
          <span className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground">
            <Plus size={16} /> Set category per item
          </span>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {menuCategories.map((category) => {
          const count = items.filter((item) => item.category === category).length
          return (
            <div key={category} className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-serif text-lg">{category}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{count} items</p>
            </div>
          )
        })}
      </div>
    </>
  )
}
