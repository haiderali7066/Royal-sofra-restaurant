import { Suspense } from 'react'
import { AccountPageHeading } from '@/components/account-page-heading'
import { TrackOrderForm } from '@/components/track-order-form'

export default function OrderTrackingPage() {
  return (
    <div className="space-y-6">
      <AccountPageHeading title="Order Tracking" description="Enter an order ID to see its live status." />
      <Suspense fallback={<p className="text-sm text-muted-foreground">Loading tracker…</p>}>
        <TrackOrderForm />
      </Suspense>
    </div>
  )
}
