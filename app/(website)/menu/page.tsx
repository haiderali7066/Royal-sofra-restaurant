'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import useSWR from 'swr'
import Image from 'next/image'
import Link from 'next/link'
import { Flame, Loader2, Plus, Search, X } from 'lucide-react'
import { menuCategories } from '@/lib/mock-data'
import { money } from '@/lib/format'
import { fetcher } from '@/lib/fetcher'
import { useCart } from '@/components/cart-context'
import type { MenuItem } from '@/lib/types'

function MenuContent() {
  const searchParams = useSearchParams()
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const { addToCart } = useCart()

  // Support deep-links like /menu?category=Tandoor from the homepage and elsewhere.
  useEffect(() => {
    const requested = searchParams.get('category')

    if (requested && (menuCategories as string[]).includes(requested)) {
      setCategory(requested)
    }
  }, [searchParams])

  const { data, isLoading, error } = useSWR<{ items: MenuItem[] }>(
    '/api/menu',
    fetcher
  )

  const menuItems = data?.items ?? []

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()

    return menuItems.filter((item) => {
      const inCategory =
        category === 'All' || item.category === category

      const inQuery =
        q === '' ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)

      return inCategory && inQuery
    })
  }, [menuItems, category, query])

  const grouped = useMemo(() => {
    if (category !== 'All' || query.trim() !== '') {
      return null
    }

    const map = new Map<string, MenuItem[]>()

    for (const cat of menuCategories) {
      const items = menuItems.filter(
        (item) => item.category === cat
      )

      if (items.length > 0) {
        map.set(cat, items)
      }
    }

    return map
  }, [menuItems, category, query])

  return (
    <section className="pb-20 md:pb-24">
      {/* Dark hero banner */}
      <div className="bg-ink px-5 py-12 text-ink-foreground md:px-8 md:py-16">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
            The menu
          </p>

          <h1 className="mt-3 max-w-2xl text-balance font-serif text-4xl leading-tight tracking-tight md:text-6xl">
            Come hungry.{' '}
            <span className="italic text-primary">Leave royal.</span>
          </h1>

          <p className="mt-4 max-w-xl text-pretty text-sm leading-6 text-ink-foreground/70 md:text-base">
            Familiar favourites, signature plates and a few delicious surprises
            — search the full menu or browse by section.
          </p>
        </div>
      </div>

      {/* Sticky search + category rail */}
      <div className="sticky top-[169px] z-30 border-b border-border bg-background/95 backdrop-blur-sm lg:top-[69px]">
        <div className="mx-auto max-w-7xl px-5 py-3 md:px-8">
          <div className="relative">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dishes, e.g. karahi, kabab, shake…"
              className="w-full rounded-full border border-border bg-card py-3 pl-11 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />

            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div
            className="-mx-5 mt-3 flex gap-2 overflow-x-auto px-5 pb-1 md:-mx-8 md:px-8"
            style={{ scrollbarWidth: 'none' }}
          >
            {['All', ...menuCategories].map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  category === item
                    ? 'border-cta bg-cta text-cta-foreground'
                    : 'border-border bg-background text-muted-foreground hover:border-primary hover:text-foreground'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 pt-8 md:px-8">
        {isLoading && (
          <div className="mt-16 flex justify-center text-muted-foreground">
            <Loader2 className="animate-spin" size={24} />
          </div>
        )}

        {error && (
          <p className="mt-16 text-center text-sm text-destructive">
            Could not load the menu. Please try again shortly.
          </p>
        )}

        {!isLoading && !error && filtered.length === 0 && (
          <div className="mt-16 text-center">
            <p className="text-sm text-muted-foreground">
              No dishes match &ldquo;{query}&rdquo;.
            </p>

            <button
              onClick={() => setQuery('')}
              className="mt-3 text-sm font-semibold text-primary underline-offset-4 hover:underline"
            >
              Clear search
            </button>
          </div>
        )}

        {!isLoading &&
          !error &&
          filtered.length > 0 &&
          (grouped ? (
            <div className="space-y-12">
              {Array.from(grouped.entries()).map(([cat, items]) => (
                <div
                  key={cat}
                  id={cat.replace(/\s+/g, '-')}
                >
                  <h2 className="font-serif text-2xl tracking-tight md:text-3xl">
                    {cat}
                  </h2>

                  <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((item) => (
                      <MenuCard
                        key={item.id}
                        item={item}
                        onAdd={addToCart}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item) => (
                <MenuCard
                  key={item.id}
                  item={item}
                  onAdd={addToCart}
                />
              ))}
            </div>
          ))}
      </div>
    </section>
  )
}

function MenuCard({
  item,
  onAdd,
}: {
  item: MenuItem
  onAdd: (item: MenuItem) => void
}) {
  return (
    <article className="group flex gap-4 overflow-hidden rounded-2xl border border-border bg-card p-3 transition-shadow hover:shadow-lg sm:flex-col sm:gap-0 sm:p-0">
      <Link
        href={`/menu/${item.slug}`}
        className="relative block aspect-square w-24 shrink-0 overflow-hidden rounded-xl sm:aspect-[1.15] sm:w-full sm:rounded-none"
      >
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 30vw, 25vw"
        />

        {item.tag && (
          <span className="absolute left-2 top-2 hidden rounded-full bg-background/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider sm:block">
            {item.tag}
          </span>
        )}

        {!item.isAvailable && (
          <span className="absolute inset-0 grid place-items-center bg-background/80 text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:text-sm">
            Sold out
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col sm:p-4">
        <div className="flex items-start justify-between gap-3">
          <Link
            href={`/menu/${item.slug}`}
            className="font-serif text-base leading-tight hover:text-primary sm:text-xl"
          >
            {item.name}
          </Link>

          {item.spiceLevel > 1 && (
            <span
              className="flex shrink-0 items-center gap-0.5 text-primary"
              aria-label={`Spice level ${item.spiceLevel} of 3`}
            >
              {Array.from({ length: item.spiceLevel }).map((_, i) => (
                <Flame
                  key={i}
                  size={12}
                  className="fill-current"
                />
              ))}
            </span>
          )}
        </div>

        <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground sm:mt-2 sm:text-sm">
          {item.description}
        </p>

        {item.options && item.options.length > 0 && (
          <p className="mt-1.5 line-clamp-1 text-[11px] text-muted-foreground/80">
            {item.options.join(' · ')}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-3 sm:pt-4">
          <span className="text-sm font-semibold text-primary sm:text-base">
            {item.priceNote ?? money(item.price)}
          </span>

          <button
            onClick={() => onAdd(item)}
            disabled={!item.isAvailable}
            aria-label={`Add ${item.name} to order`}
            className="flex items-center gap-1.5 rounded-full bg-cta px-3 py-2 text-xs font-semibold text-cta-foreground transition-colors hover:bg-[#241a12] disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </article>
  )
}

export default function MenuPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <MenuContent />
    </Suspense>
  )
}
