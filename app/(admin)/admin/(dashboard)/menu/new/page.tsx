import { AdminPageHeading } from '@/components/admin-page-heading'
import { AdminMenuItemForm } from '@/components/admin-menu-item-form'

export default function AdminNewMenuItemPage() {
  return (
    <>
      <AdminPageHeading title="Add menu item" description="Create a new dish for your menu." />
      <AdminMenuItemForm />
    </>
  )
}
