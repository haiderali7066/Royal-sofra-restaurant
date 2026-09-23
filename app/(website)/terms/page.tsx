import type { Metadata } from 'next'
import { PageHeading } from '@/components/page-heading'
import { brand } from '@/lib/mock-data'

export const metadata: Metadata = {
  title: `Terms of Service | ${brand.name}`,
  description: `The terms that apply when you order from ${brand.name}.`,
}

export default function TermsPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-14 md:px-8 md:py-20">
      <PageHeading
        eyebrow="Legal"
        title="Terms of service."
        copy="The short version of the terms that apply when you order with us online."
      />

      <div className="mt-10 space-y-8 text-sm leading-7 text-muted-foreground">
        <div>
          <h2 className="font-serif text-2xl text-foreground">Orders</h2>
          <p className="mt-2">
            Placing an order through our website is an offer to purchase, which we accept when we confirm your
            order. Menu availability, prices and delivery times may change without notice.
          </p>
        </div>
        <div>
          <h2 className="font-serif text-2xl text-foreground">Payments</h2>
          <p className="mt-2">
            We accept cash on delivery and secure online payments. Online payments are processed by our payment
            partner; we do not store your card details.
          </p>
        </div>
        <div>
          <h2 className="font-serif text-2xl text-foreground">Cancellations</h2>
          <p className="mt-2">
            Once an order has been confirmed and preparation has started, it may not be possible to cancel.
            Contact us as soon as possible if you need to change or cancel an order.
          </p>
        </div>
        <div>
          <h2 className="font-serif text-2xl text-foreground">Contact</h2>
          <p className="mt-2">
            Questions about these terms can be sent to{' '}
            <a href={`mailto:${brand.email}`} className="font-semibold text-primary">
              {brand.email}
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  )
}
