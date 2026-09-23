import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>
}) {
  const { order } = await searchParams

  return (
    <section className="mx-auto max-w-2xl px-5 py-24 text-center md:px-8">
      <CheckCircle2 className="mx-auto text-primary" size={56} />
      <h1 className="mt-6 font-serif text-4xl">Your order is confirmed.</h1>
      {order && <p className="mt-3 text-sm uppercase tracking-wider text-primary">Order {order}</p>}
      <p className="mt-4 text-pretty text-base leading-7 text-muted-foreground">
        Thank you for choosing Royal Sofra. Your kitchen ticket has been fired and a confirmation has been sent to your email.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href={order ? `/track-order?order=${encodeURIComponent(order)}` : '/track-order'}
          className="rounded-full bg-cta px-6 py-3.5 text-sm font-semibold text-cta-foreground"
        >
          Track your order
        </Link>
        <Link href="/menu" className="rounded-full border border-border px-6 py-3.5 text-sm font-semibold">
          Order more
        </Link>
      </div>
    </section>
  )
}
