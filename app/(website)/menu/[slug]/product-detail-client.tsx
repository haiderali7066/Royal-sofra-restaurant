'use client'

import { Plus } from 'lucide-react'
import type { MenuItem } from '@/lib/types'
import { money } from '@/lib/format'
import { useCart } from '@/components/cart-context'

export function ProductDetailClient({ item }: { item: MenuItem }) {
  const { addToCart } = useCart()

  return (
    <div className="flex flex-col justify-center">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">{item.category}</p>
      <h1 className="mt-4 text-balance font-serif text-5xl">{item.name}</h1>
      <p className="mt-5 text-pretty text-lg leading-8 text-muted-foreground">
        {item.description} Prepared with our house blend of spices and served hot from the kitchen.
      </p>
      <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
        Spice level:
        {[1, 2, 3].map((level) => (
          <span key={level} className={`size-2.5 rounded-full ${level <= item.spiceLevel ? 'bg-primary' : 'bg-muted'}`} />
        ))}
      </div>
      {item.options && item.options.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {item.options.map((option) => (
            <span key={option} className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
              {option}
            </span>
          ))}
        </div>
      )}
      <p className="mt-8 font-serif text-3xl text-primary">{item.priceNote ?? money(item.price)}</p>
      <button
        onClick={() => addToCart(item)}
        disabled={!item.isAvailable}
        className="mt-8 w-fit rounded-full bg-cta px-7 py-3.5 text-sm font-semibold text-cta-foreground transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {item.isAvailable ? 'Add to order' : 'Sold out'} <Plus className="ml-2 inline" size={16} />
      </button>
    </div>
  )
}
