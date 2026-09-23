import type { Metadata } from 'next'
import { PageHeading } from '@/components/page-heading'
import { brand } from '@/lib/mock-data'

export const metadata: Metadata = {
  title: `Privacy Policy | ${brand.name}`,
  description: `How ${brand.name} collects, uses and protects your information.`,
}

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-14 md:px-8 md:py-20">
      <PageHeading
        eyebrow="Legal"
        title="Privacy policy."
        copy="We collect the minimum information needed to take your order, deliver it, and keep your account secure."
      />

      <div className="mt-10 space-y-8 text-sm leading-7 text-muted-foreground">
        <div>
          <h2 className="font-serif text-2xl text-foreground">Information we collect</h2>
          <p className="mt-2">
            When you create an account or place an order, we collect your name, email address, phone number and
            delivery address. If you use online payment, your payment is processed directly by our payment
            provider — we never store your full card details.
          </p>
        </div>
        <div>
          <h2 className="font-serif text-2xl text-foreground">How we use it</h2>
          <p className="mt-2">
            We use your information to process orders, contact you about deliveries, respond to support
            requests, and — if you subscribe — send occasional offers and updates. We do not sell your
            information to third parties.
          </p>
        </div>
        <div>
          <h2 className="font-serif text-2xl text-foreground">Location data</h2>
          <p className="mt-2">
            If you use &quot;Get current location&quot;, your coordinates are sent to our server only to resolve a
            delivery address and are not stored beyond that request.
          </p>
        </div>
        <div>
          <h2 className="font-serif text-2xl text-foreground">Your choices</h2>
          <p className="mt-2">
            You can update or delete your account details from your account settings at any time, or contact us
            at <a href={`mailto:${brand.email}`} className="font-semibold text-primary">{brand.email}</a> with
            any privacy request.
          </p>
        </div>
      </div>
    </section>
  )
}
