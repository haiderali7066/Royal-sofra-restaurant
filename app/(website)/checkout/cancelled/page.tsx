import Link from 'next/link'
import { XCircle } from 'lucide-react'

export default async function CheckoutCancelledPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>
}) {
  const { order } = await searchParams

  return (
    <section className="mx-auto max-w-2xl px-5 py-24 text-center md:px-8">
      <XCircle className="mx-auto text-destructive" size={56} />
      <h1 className="mt-6 font-serif text-4xl">Payment cancelled.</h1>
      {order && <p className="mt-3 text-sm uppercase tracking-wider text-muted-foreground">Order {order}</p>}
      <p className="mt-4 text-pretty text-base leading-7 text-muted-foreground">
        Your payment was not completed and your order has not been confirmed. You can try again or choose cash on delivery instead.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/checkout" className="rounded-full bg-cta px-6 py-3.5 text-sm font-semibold text-cta-foreground">
          Try again
        </Link>
        <Link href="/menu" className="rounded-full border border-border px-6 py-3.5 text-sm font-semibold">
          Back to menu
        </Link>
      </div>
    </section>
  )
}
