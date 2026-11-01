'use client'

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import useSWR from 'swr'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ChevronRight, Heart, Loader2, Plus, Search, ShoppingBag, X } from 'lucide-react'
import { menuCategories } from '@/lib/mock-data'
import { money } from '@/lib/format'
import { fetcher } from '@/lib/fetcher'
import { useCart } from '@/components/cart-context'
import type { MenuItem } from '@/lib/types'

/* Palette
   espresso  #1F120B  hero / tab strip / cart bar start
   brown     #3E2415  main buttons, active states
   brown-dk  #2A180E  hover
   gold      #C8963E  accents, price pill, badges, active underline
   gold-lt   #E8C98A  light accents on dark
   cream     #FAF5EC  page background
   line      #E8DCC6  borders
*/

const FAVORITES_KEY = 'menu-favorites'

function MenuContent() {
  const searchParams = useSearchParams()
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [favorites, setFavorites] = useState<string[]>([])
  const { cart, total, addToCart } = useCart()
  const railRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const requested = searchParams.get('category')
    if (requested && (menuCategories as string[]).includes(requested)) {
      setCategory(requested)
    }
  }, [searchParams])

  useEffect(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY)
      if (saved) setFavorites(JSON.parse(saved))
    } catch {
      /* ignore */
    }
  }, [])

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((current) => {
      const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id]
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(next))
      } catch {
        /* ignore */
      }
      return next
    })
  }, [])

  useEffect(() => {
    const el = railRef.current?.querySelector<HTMLElement>(`[data-tab="${CSS.escape(category)}"]`)
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [category])

  const { data, isLoading, error } = useSWR<{ items: MenuItem[] }>('/api/menu', fetcher)
  const menuItems = data?.items ?? []

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return menuItems.filter((item) => {
      const inCategory = category === 'All' || item.category === category
      const inQuery =
        q === '' || item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)
      return inCategory && inQuery
    })
  }, [menuItems, category, query])

  const grouped = useMemo(() => {
    if (category !== 'All' || query.trim() !== '') return null
    const map = new Map<string, MenuItem[]>()
    for (const cat of menuCategories) {
      const items = menuItems.filter((item) => item.category === cat)
      if (items.length > 0) map.set(cat, items)
    }
    return map
  }, [menuItems, category, query])

  const counts = useMemo(() => {
    const map = new Map<string, number>()
    for (const item of menuItems) map.set(item.category, (map.get(item.category) ?? 0) + 1)
    return map
  }, [menuItems])

  const cartCount = cart.reduce((sum, line) => sum + line.qty, 0)
  const scrollRail = () => railRef.current?.scrollBy({ left: 200, behavior: 'smooth' })

  const renderCard = (item: MenuItem) => (
    <MenuCard
      key={item.id}
      item={item}
      isFavorite={favorites.includes(item.id)}
      onToggleFavorite={() => toggleFavorite(item.id)}
      onAdd={addToCart}
    />
  )

  const searchBox = (
    <div className="flex items-center gap-3 border-b border-[#3E2415]/15 pb-3 lg:rounded-full lg:border lg:border-white/15 lg:bg-white/10 lg:px-5 lg:py-3.5 lg:backdrop-blur-sm">
      <Search size={20} className="shrink-0 text-[#3E2415] lg:text-[#E8C98A]" strokeWidth={2.5} />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for"
        className="w-full bg-transparent text-[15px] text-[#24140C] placeholder:text-[#3E2415]/45 focus:outline-none lg:text-white lg:placeholder:text-white/50 [&::-webkit-search-cancel-button]:hidden"
      />
      {query && (
        <button
          onClick={() => setQuery('')}
          aria-label="Clear search"
          className="shrink-0 rounded-full p-1 text-[#3E2415]/50 hover:text-[#3E2415] lg:text-white/60 lg:hover:text-white"
        >
          <X size={18} />
        </button>
      )}
    </div>
  )

  return (
    <section className={`min-h-screen bg-[#FAF5EC] ${cartCount > 0 ? 'pb-32 xl:pb-16' : 'pb-16'}`}>
      {/* Desktop hero */}
      <div className="relative hidden overflow-hidden bg-[#1F120B] lg:block">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -right-32 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full border border-[#C8963E]/15" />
          <div className="absolute -right-16 top-1/2 h-[300px] w-[300px] -translate-y-1/2 rounded-full border border-[#C8963E]/15" />
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#C8963E]/10 blur-3xl" />
        </div>
        <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-10 px-8 py-10">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#C8963E]">The Menu</p>
            <h1 className="mt-2 text-5xl font-light leading-[1.02] tracking-tight text-[#FAF5EC]">
              Come hungry.{' '}
              <span className="font-serif font-medium italic text-[#E8C98A]">Leave royal.</span>
            </h1>
          </div>
          <div className="w-full max-w-md">{searchBox}</div>
        </div>
      </div>

      {/* Mobile / tablet: sticky tabs + search */}
      <div className="sticky top-[169px] z-30 bg-[#FAF5EC] shadow-[0_1px_0_rgba(62,36,21,0.06)] lg:hidden">
        <div className="relative bg-[#2A1A10]">
          <div ref={railRef} className="flex overflow-x-auto pr-10" style={{ scrollbarWidth: 'none' }}>
            {['All', ...menuCategories].map((item) => {
              const active = category === item
              return (
                <button
                  key={item}
                  data-tab={item}
                  onClick={() => setCategory(item)}
                  className={`relative shrink-0 whitespace-nowrap px-5 py-4 text-[15px] font-semibold transition-colors ${
                    active ? 'text-[#E8C98A]' : 'text-[#EADBC4]/70 hover:text-[#E8C98A]'
                  }`}
                >
                  {item}
                  {active && <span className="absolute inset-x-3 bottom-0 h-[3px] rounded-t-full bg-[#C8963E]" />}
                </button>
              )
            })}
          </div>
          <button
            onClick={scrollRail}
            aria-label="Scroll categories"
            className="absolute right-0 top-0 grid h-full w-10 place-items-center bg-gradient-to-l from-[#2A1A10] via-[#2A1A10] to-transparent text-[#E8C98A]"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        <div className="px-4 py-3 md:px-6">{searchBox}</div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-7xl px-4 pt-6 md:px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-8 lg:px-8 lg:pt-10 xl:grid-cols-[220px_minmax(0,1fr)_320px]">
        {/* Desktop category sidebar */}
        <aside className="hidden lg:block">
          <nav className="sticky top-[93px] rounded-2xl border border-[#E8DCC6] bg-white p-3 shadow-[0_4px_18px_rgba(62,36,21,0.06)]">
            <p className="px-3 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#3E2415]/50">
              Categories
            </p>
            <div className="max-h-[calc(100vh-180px)] space-y-1 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
              {['All', ...menuCategories].map((item) => {
                const active = category === item
                const count = item === 'All' ? menuItems.length : counts.get(item) ?? 0
                return (
                  <button
                    key={item}
                    onClick={() => setCategory(item)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                      active
                        ? 'bg-[#3E2415] text-[#FAF5EC] shadow-sm'
                        : 'text-[#3E2415]/80 hover:bg-[#F3E9D6] hover:text-[#3E2415]'
                    }`}
                  >
                    <span>{item}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        active ? 'bg-[#C8963E] text-white' : 'bg-[#F3E9D6] text-[#3E2415]/70'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          </nav>
        </aside>

        {/* Items */}
        <div className="min-w-0">
          {isLoading && (
            <div className="mt-16 flex justify-center text-[#C8963E]">
              <Loader2 className="animate-spin" size={28} />
            </div>
          )}

          {error && (
            <p className="mt-16 text-center text-sm text-destructive">
              Could not load the menu. Please try again shortly.
            </p>
          )}

          {!isLoading && !error && filtered.length === 0 && (
            <div className="mt-16 text-center">
              <p className="text-sm text-[#3E2415]/60">No dishes match &ldquo;{query}&rdquo;.</p>
              <button
                onClick={() => setQuery('')}
                className="mt-3 text-sm font-semibold text-[#C8963E] underline-offset-4 hover:underline"
              >
                Clear search
              </button>
            </div>
          )}

          {!isLoading &&
            !error &&
            filtered.length > 0 &&
            (grouped ? (
              <div className="space-y-10">
                {Array.from(grouped.entries()).map(([cat, items]) => (
                  <div key={cat} id={cat.replace(/\s+/g, '-')} className="scroll-mt-64">
                    <div className="flex items-center gap-4">
                      <h2 className="text-[22px] font-bold tracking-tight text-[#24140C] md:text-2xl">{cat}</h2>
                      <span className="hidden h-px flex-1 bg-gradient-to-r from-[#C8963E]/50 to-transparent md:block" />
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 2xl:grid-cols-3">
                      {items.map(renderCard)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                {category !== 'All' && (
                  <div className="flex items-center gap-4">
                    <h2 className="text-[22px] font-bold tracking-tight text-[#24140C] md:text-2xl">{category}</h2>
                    <span className="hidden h-px flex-1 bg-gradient-to-r from-[#C8963E]/50 to-transparent md:block" />
                  </div>
                )}
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 2xl:grid-cols-3">
                  {filtered.map(renderCard)}
                </div>
              </div>
            ))}
        </div>

        {/* Desktop order panel */}
        <aside className="hidden xl:block">
          <div className="sticky top-[93px] overflow-hidden rounded-2xl border border-[#E8DCC6] bg-white shadow-[0_4px_18px_rgba(62,36,21,0.06)]">
            <div className="flex items-center justify-between bg-[#1F120B] px-5 py-4 text-[#FAF5EC]">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-[#E8C98A]" />
                <h3 className="text-base font-semibold">Your order</h3>
              </div>
              {cartCount > 0 && (
                <span className="grid h-6 min-w-6 place-items-center rounded-full bg-[#C8963E] px-1.5 text-xs font-bold text-white">
                  {cartCount}
                </span>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#F3E9D6] text-[#3E2415]/60">
                  <ShoppingBag size={24} />
                </div>
                <p className="mt-4 text-sm font-medium text-[#24140C]">Your cart is empty</p>
                <p className="mt-1 text-xs text-[#3E2415]/55">Add dishes from the menu to start your order.</p>
              </div>
            ) : (
              <div className="p-5">
                <ul className="max-h-[320px] space-y-3 overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
                  {cart.map((line) => (
                    <li key={line.item.id} className="flex items-start justify-between gap-3 text-sm">
                      <div className="flex min-w-0 gap-2.5">
                        <span className="mt-0.5 grid h-5 min-w-5 shrink-0 place-items-center rounded-md bg-[#F3E9D6] px-1 text-[11px] font-bold text-[#3E2415]">
                          {line.qty}
                        </span>
                        <span className="text-[#24140C]">{line.item.name}</span>
                      </div>
                      <span className="shrink-0 font-semibold text-[#3E2415]">{money(line.item.price * line.qty)}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex items-center justify-between border-t border-dashed border-[#E8DCC6] pt-4">
                  <span className="text-sm text-[#3E2415]/70">Subtotal</span>
                  <span className="text-lg font-bold text-[#3E2415]">{money(total)}</span>
                </div>

                <Link
                  href="/checkout"
                  className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#3E2415] py-3.5 text-sm font-bold text-[#FAF5EC] shadow-[0_6px_16px_rgba(62,36,21,0.3)] transition-colors hover:bg-[#2A180E]"
                >
                  Checkout
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/cart"
                  className="mt-2 block rounded-xl border border-[#E8DCC6] py-3 text-center text-sm font-semibold text-[#3E2415] transition-colors hover:bg-[#F3E9D6]"
                >
                  View Cart
                </Link>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Floating cart bar (mobile / tablet / small desktop) */}
      {cartCount > 0 && (
        <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 px-4 xl:hidden">
          <div className="pointer-events-auto mx-auto flex max-w-xl items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-[#1F120B] to-[#4A2C1B] px-4 py-3 text-[#FAF5EC] shadow-[0_10px_30px_rgba(31,18,11,0.45)]">
            <div className="flex items-center gap-4">
              <div className="relative">
                <ShoppingBag size={26} className="text-[#E8C98A]" />
                <span className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-[#C8963E] text-[11px] font-bold text-white shadow">
                  {cartCount}
                </span>
              </div>
              <span className="text-lg font-bold tracking-tight">{money(total)}</span>
            </div>
            <Link
              href="/cart"
              className="flex items-center gap-2 rounded-xl bg-[#C8963E] px-5 py-2.5 text-sm font-bold text-white shadow-[0_4px_12px_rgba(200,150,62,0.45)] transition-colors hover:bg-[#B5852F]"
            >
              View Cart
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}
    </section>
  )
}

function MenuCard({
  item,
  isFavorite,
  onToggleFavorite,
  onAdd,
}: {
  item: MenuItem
  isFavorite: boolean
  onToggleFavorite: () => void
  onAdd: (item: MenuItem) => void
}) {
  return (
    <article className="group flex gap-4 rounded-2xl border border-[#E8DCC6]/70 bg-white p-3 shadow-[0_4px_18px_rgba(62,36,21,0.07)] transition-all duration-300 md:flex-col md:gap-0 md:overflow-hidden md:p-0 md:hover:-translate-y-1 md:hover:shadow-[0_14px_34px_rgba(62,36,21,0.14)]">
      {/* Image */}
      <div className="relative h-[120px] w-[120px] shrink-0 overflow-hidden rounded-xl bg-[#3E2415] sm:h-[132px] sm:w-[132px] md:h-auto md:w-full md:rounded-none md:aspect-[4/3]">
        <Link href={`/menu/${item.slug}`} className="absolute inset-0 block">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 30vw, (max-width: 1280px) 30vw, 22vw"
          />
          <span className="absolute inset-x-0 bottom-0 hidden h-1/3 bg-gradient-to-t from-black/35 to-transparent md:block" />
        </Link>

        {item.tag && (
          <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-[#C8963E] px-3 py-0.5 text-[11px] font-semibold text-white shadow md:bottom-auto md:left-3 md:top-3 md:translate-x-0 md:py-1 md:uppercase md:tracking-wider">
            {item.tag}
          </span>
        )}

        {/* Desktop heart overlay */}
        <button
          onClick={onToggleFavorite}
          aria-label={isFavorite ? `Remove ${item.name} from favourites` : `Add ${item.name} to favourites`}
          aria-pressed={isFavorite}
          className="absolute right-3 top-3 hidden h-9 w-9 place-items-center rounded-full bg-white/90 text-[#3E2415]/50 shadow transition-colors hover:text-[#C8963E] md:grid"
        >
          <Heart size={19} className={isFavorite ? 'fill-[#C8963E] text-[#C8963E]' : ''} strokeWidth={1.8} />
        </button>

        {!item.isAvailable && (
          <span className="pointer-events-none absolute inset-0 grid place-items-center bg-white/80 text-xs font-bold uppercase tracking-wider text-[#3E2415]/60">
            Sold out
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col md:p-5">
        <Link
          href={`/menu/${item.slug}`}
          className="text-[15px] font-bold leading-snug text-[#24140C] transition-colors hover:text-[#C8963E] sm:text-base md:text-lg"
        >
          {item.name}
        </Link>

        <p className="mt-1.5 line-clamp-2 text-[13px] leading-5 text-[#3E2415]/45 md:text-sm md:leading-6 md:text-[#3E2415]/60">
          {item.description}
        </p>

        {item.options && item.options.length > 0 && (
          <p className="mt-1 line-clamp-1 text-[11px] text-[#3E2415]/45">{item.options.join(' · ')}</p>
        )}

        <span className="mt-2 w-fit rounded-md bg-[#C8963E] px-2.5 py-1 text-[13px] font-bold text-white md:hidden">
          {item.priceNote ?? money(item.price)}
        </span>

        <div className="mt-auto flex items-center justify-between gap-2 pt-3 md:pt-5">
          <span className="hidden text-lg font-bold text-[#3E2415] md:block">
            {item.priceNote ?? money(item.price)}
          </span>

          <button
            onClick={() => onAdd(item)}
            disabled={!item.isAvailable}
            aria-label={`Add ${item.name} to cart`}
            className="flex items-center gap-2 rounded-xl bg-[#3E2415] px-5 py-3 text-[13px] font-bold text-[#FAF5EC] shadow-[0_4px_12px_rgba(62,36,21,0.35)] transition active:scale-95 hover:bg-[#2A180E] disabled:cursor-not-allowed disabled:bg-[#3E2415]/20 disabled:shadow-none md:px-4 md:py-2.5"
          >
            <Plus size={15} className="hidden text-[#E8C98A] md:block" />
            Add To Cart
          </button>

          {/* Mobile heart */}
          <button
            onClick={onToggleFavorite}
            aria-label={isFavorite ? `Remove ${item.name} from favourites` : `Add ${item.name} to favourites`}
            aria-pressed={isFavorite}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[#3E2415]/30 transition-colors hover:text-[#C8963E] md:hidden"
          >
            <Heart size={22} className={isFavorite ? 'fill-[#C8963E] text-[#C8963E]' : ''} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </article>
  )
}

export default function MenuPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF5EC]" />}>
      <MenuContent />
    </Suspense>
  )
}