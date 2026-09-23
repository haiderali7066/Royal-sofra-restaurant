import { Suspense } from 'react'
import { PageHeading } from '@/components/page-heading'
import { TrackOrderForm } from '@/components/track-order-form'

export default function TrackOrderPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-14 md:px-8 md:py-20">
      <PageHeading eyebrow="Order tracking" title="Where's my food?" copy="Enter your order ID to see live status of your Royal Sofra order." />
      <Suspense fallback={null}>
        <TrackOrderForm />
      </Suspense>
    </section>
  )
}
