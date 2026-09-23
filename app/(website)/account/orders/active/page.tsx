import { AccountPageHeading } from '@/components/account-page-heading'
import { AccountOrdersList } from '@/components/account/orders-list'

export default function ActiveOrdersPage() {
  return (
    <div className="space-y-6">
      <AccountPageHeading title="Active Orders" description="Orders that are still being prepared or on their way to you." />
      <AccountOrdersList scope="active" />
    </div>
  )
}
