import { Clock3, MapPin, Phone } from 'lucide-react'
import { PageHeading } from '@/components/page-heading'
import { brand } from '@/lib/mock-data'

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
      <PageHeading
        eyebrow="Come say salaam"
        title="Your table is waiting."
        copy="Find us in the heart of the city, where the grills are always warm and the chai is always pouring."
      />
      <div className="mt-16 grid gap-8 md:grid-cols-[0.9fr_1.1fr]">
        <div className="grid gap-4 sm:grid-cols-1">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 text-primary"><MapPin /></div>
            <h3 className="font-serif text-xl">Visit us</h3>
            <p className="mt-1 text-sm text-muted-foreground">{brand.address}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 text-primary"><Clock3 /></div>
            <h3 className="font-serif text-xl">Opening hours</h3>
            <p className="mt-1 text-sm text-muted-foreground">{brand.hours}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 text-primary"><Phone /></div>
            <h3 className="font-serif text-xl">Call us</h3>
            <p className="mt-1 text-sm text-muted-foreground">{brand.phone}</p>
          </div>
        </div>
        <form className="space-y-4 rounded-2xl border border-border bg-card p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <input required placeholder="Full name" className="w-full rounded-xl border border-input bg-background px-4 py-3" />
            <input required type="email" placeholder="Email address" className="w-full rounded-xl border border-input bg-background px-4 py-3" />
          </div>
          <input placeholder="Subject" className="w-full rounded-xl border border-input bg-background px-4 py-3" />
          <textarea required placeholder="Your message" rows={5} className="w-full rounded-xl border border-input bg-background px-4 py-3" />
          <button type="submit" className="rounded-full bg-cta px-6 py-3 text-sm font-semibold text-cta-foreground">
            Send message
          </button>
        </form>
      </div>
    </section>
  )
}
