import { notFound } from 'next/navigation'
import { AdminPageHeading } from '@/components/admin-page-heading'
import { AdminMenuItemForm } from '@/components/admin-menu-item-form'
import { menuItemsCollection } from '@/lib/collections'

export const dynamic = 'force-dynamic'

export default async function AdminEditMenuItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const menu = await menuItemsCollection()
  const item = await menu.findOne({ id })
  if (!item) notFound()

  return (
    <>
      <AdminPageHeading title={`Edit ${item.name}`} description="Update details for this menu item." />
      <AdminMenuItemForm item={item} />
    </>
  )
}
