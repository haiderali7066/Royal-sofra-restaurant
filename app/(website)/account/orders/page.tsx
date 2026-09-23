import { AccountPageHeading } from '@/components/account-page-heading'
import { AccountOrdersList } from '@/components/account/orders-list'

export default function MyOrdersPage() {
  return (
    <div className="space-y-6">
      <AccountPageHeading title="My Orders" description="Your complete order history with Royal Sofra." />
      <AccountOrdersList scope="all" />
    </div>
  )
}
