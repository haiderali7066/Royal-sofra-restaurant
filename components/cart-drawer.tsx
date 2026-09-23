'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect } from 'react'
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { useCart } from '@/components/cart-context'
import { money } from '@/lib/format'

export function CartDrawer() {
  const { cart, updateQty, removeFromCart, total, isDrawerOpen, closeDrawer } = useCart()

  // Lock body scroll while the drawer is open so the page behind it doesn't
  // scroll along with the drawer's own content on mobile.
  useEffect(() => {
    if (!isDrawerOpen) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [isDrawerOpen])

  useEffect(() => {
    if (!isDrawerOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeDrawer()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isDrawerOpen, closeDrawer])

  if (!isDrawerOpen) return null

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Shopping bag">
      <button
        aria-label="Close shopping bag"
        onClick={closeDrawer}
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm animate-in fade-in"
      />
      <div className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-background shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h2 className="font-serif text-xl">Your bag</h2>
          <button aria-label="Close" onClick={closeDrawer} className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingBag className="text-muted-foreground" size={32} />
            <p className="text-sm text-muted-foreground">Your bag is empty.</p>
            <Link
              href="/menu"
              onClick={closeDrawer}
              className="mt-2 rounded-full bg-cta px-5 py-2.5 text-sm font-semibold text-cta-foreground"
            >
              Browse the menu
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <ul className="space-y-4">
                {cart.map((line) => (
                  <li key={line.item.id} className="flex gap-3">
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-secondary">
                      {line.item.image && (
                        <Image src={line.item.image} alt={line.item.name} fill sizes="64px" className="object-cover" />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium leading-tight">{line.item.name}</p>
                        <button
                          aria-label={`Remove ${line.item.name}`}
                          onClick={() => removeFromCart(line.item.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 rounded-full border border-border px-1">
                          <button
                            aria-label="Decrease quantity"
                            onClick={() => updateQty(line.item.id, line.qty - 1)}
                            className="grid size-7 place-items-center text-muted-foreground hover:text-foreground"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="w-4 text-center text-sm">{line.qty}</span>
                          <button
                            aria-label="Increase quantity"
                            onClick={() => updateQty(line.item.id, line.qty + 1)}
                            className="grid size-7 place-items-center text-muted-foreground hover:text-foreground"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                        <span className="text-sm font-semibold">{money(line.item.price * line.qty)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-border px-6 py-5">
              <div className="mb-4 flex items-center justify-between text-sm font-medium">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-base font-semibold">{money(total)}</span>
              </div>
              <Link
                href="/checkout"
                onClick={closeDrawer}
                className="block rounded-full bg-cta py-3.5 text-center text-sm font-semibold text-cta-foreground transition-transform hover:-translate-y-0.5"
              >
                Go to checkout
              </Link>
              <Link
                href="/cart"
                onClick={closeDrawer}
                className="mt-2 block rounded-full border border-border py-3 text-center text-sm font-medium hover:bg-secondary"
              >
                View full bag
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
