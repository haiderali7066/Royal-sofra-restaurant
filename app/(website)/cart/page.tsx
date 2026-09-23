'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { PageHeading } from '@/components/page-heading'
import { useCart } from '@/components/cart-context'
import { money } from '@/lib/format'

export default function CartPage() {
  const { cart, updateQty, removeFromCart, total } = useCart()

  return (
    <section className="mx-auto max-w-4xl px-5 py-14 md:px-8 md:py-20">
      <PageHeading eyebrow="Your order" title="A table for your favourites." copy="Review your selection before we get cooking." />
      {cart.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-border p-10 text-center">
          <ShoppingBag className="mx-auto text-muted-foreground" />
          <p className="mt-4 font-serif text-2xl">Your bag is waiting.</p>
          <Link href="/menu" className="mt-5 inline-block rounded-full bg-cta px-6 py-3 text-sm font-semibold text-cta-foreground">
            Browse menu
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-10 space-y-3">
            {cart.map((line) => (
              <div key={line.item.id} className="flex items-center gap-4 rounded-2xl border border-border p-4">
                <div className="relative size-20 shrink-0 overflow-hidden rounded-xl">
                  <Image src={line.item.image} alt={line.item.name} fill className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-serif text-xl">{line.item.name}</h3>
                  <p className="text-sm text-muted-foreground">{money(line.item.price)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button aria-label="Decrease quantity" onClick={() => updateQty(line.item.id, line.qty - 1)} className="rounded-full border border-border p-1">
                    <Minus size={14} />
                  </button>
                  <span className="w-4 text-center">{line.qty}</span>
                  <button aria-label="Increase quantity" onClick={() => updateQty(line.item.id, line.qty + 1)} className="rounded-full border border-border p-1">
                    <Plus size={14} />
                  </button>
                </div>
                <button aria-label="Remove item" onClick={() => removeFromCart(line.item.id)} className="text-muted-foreground hover:text-destructive">
                  <Trash2 size={17} />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-8 flex items-center justify-between rounded-2xl bg-secondary p-6">
            <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Total</span>
            <span className="font-serif text-2xl text-primary">{money(total)}</span>
          </div>
          <Link
            href="/checkout"
            className="mt-6 block w-full rounded-full bg-cta py-3.5 text-center text-sm font-semibold text-cta-foreground transition-transform hover:-translate-y-0.5"
          >
            Proceed to checkout
          </Link>
        </>
      )}
    </section>
  )
}
