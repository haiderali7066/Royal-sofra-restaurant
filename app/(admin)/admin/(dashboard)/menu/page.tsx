import Link from 'next/link'
import { Plus } from 'lucide-react'
import { AdminPageHeading } from '@/components/admin-page-heading'
import { menuItemsCollection } from '@/lib/collections'
import { MenuTable } from '@/components/menu-table'

export const dynamic = 'force-dynamic'

export default async function AdminMenuPage() {
  const menu = await menuItemsCollection()

  const items = await menu.find({}).sort({ category: 1, name: 1 }).toArray()

  const serializedItems = items.map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    category: item.category,
    description: item.description || '',
    price: item.price,
    image: item.image || '',
    tag: item.tag || '',
    spiceLevel: item.spiceLevel || 1,
    isAvailable: item.isAvailable ?? true,
    isFeatured: item.isFeatured ?? false,
  }))

  return (
    <div className="space-y-6">
      <AdminPageHeading
        title="Menu"
        description="Manage dishes, pricing, categories and availability."
        action={
          <Link
            href="/admin/menu/new"
            className="inline-flex items-center gap-2 rounded-full bg-cta px-5 py-2.5 text-sm font-semibold text-cta-foreground transition hover:opacity-90"
          >
            <Plus size={16} />
            Add item
          </Link>
        }
      />

      <MenuTable items={serializedItems} />
    </div>
  )
}