'use client'

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import useSWR from 'swr'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Check, ChevronRight, Eye, Heart, Loader2, Plus, Search, ShoppingBag, X } from 'lucide-react'
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

// Shared grid: 1 col mobile, 2 tablet, 3 laptop, 4 desktop, 5 ultra-wide
const GRID = 'grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'

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

  const renderCard = (item: MenuItem, index: number) => (
    <MenuCard
      key={item.id}
      item={item}
      index={index}
      isFavorite={favorites.includes(item.id)}
      onToggleFavorite={() => toggleFavorite(item.id)}
      onAdd={addToCart}
    />
  )

  const searchBox = (
    <div className="group/search flex items-center gap-3 border-b border-[#3E2415]/15 pb-3 transition-all duration-300 focus-within:border-[#C8963E] lg:rounded-full lg:border lg:border-white/15 lg:bg-white/10 lg:px-5 lg:py-3.5 lg:backdrop-blur-sm lg:focus-within:border-[#C8963E] lg:focus-within:bg-white/15 lg:focus-within:shadow-[0_0_0_4px_rgba(200,150,62,0.18)]">
      <Search
        size={20}
        className="shrink-0 text-[#3E2415] transition-transform duration-300 group-focus-within/search:scale-110 lg:text-[#E8C98A]"
        strokeWidth={2.5}
      />
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
          className="shrink-0 rounded-full p-1 text-[#3E2415]/50 transition-all hover:rotate-90 hover:text-[#3E2415] lg:text-white/60 lg:hover:text-white"
        >
          <X size={18} />
        </button>
      )}
    </div>
  )

  return (
    <section className={`min-h-screen bg-[#FAF5EC] ${cartCount > 0 ? 'pb-32' : 'pb-16'}`}>
      {/* Keyframes */}
      <style>{`
        @keyframes heartPop { 0% { transform: scale(1) } 40% { transform: scale(1.35) } 100% { transform: scale(1) } }
        @keyframes badgePop { 0% { transform: scale(1) } 45% { transform: scale(1.5) } 100% { transform: scale(1) } }
        @keyframes barIn { from { opacity: 0; transform: translateY(40px) scale(.96) } to { opacity: 1; transform: translateY(0) scale(1) } }
        @keyframes heroIn { from { opacity: 0; transform: translateY(18px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes floatSlow { 0%,100% { transform: translateY(-50%) rotate(0deg) } 50% { transform: translateY(-52%) rotate(6deg) } }
        @keyframes sectionIn { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: translateY(0) } }
        @media (prefers-reduced-motion: reduce) {
          .menu-motion, .menu-motion * { animation: none !important; transition: none !important; }
        }
      `}</style>

      {/* Desktop hero */}
      <div className="relative hidden overflow-hidden bg-[#1F120B] lg:block">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -right-32 top-1/2 h-[420px] w-[420px] animate-[floatSlow_14s_ease-in-out_infinite] rounded-full border border-[#C8963E]/15" />
          <div className="absolute -right-16 top-1/2 h-[300px] w-[300px] animate-[floatSlow_10s_ease-in-out_infinite_reverse] rounded-full border border-[#C8963E]/15" />
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#C8963E]/10 blur-3xl" />
        </div>
        <div className="menu-motion relative mx-auto flex max-w-[1600px] items-center justify-between gap-10 px-8 py-10">
          <div className="animate-[heroIn_.7s_ease-out_both]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#C8963E]">The Menu</p>
            <h1 className="mt-2 text-5xl font-light leading-[1.02] tracking-tight text-[#FAF5EC]">
              Come hungry.{' '}
              <span className="font-serif font-medium italic text-[#E8C98A]">Leave royal.</span>
            </h1>
          </div>
          <div className="w-full max-w-md animate-[heroIn_.7s_.15s_ease-out_both]">{searchBox}</div>
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
      <div className="menu-motion mx-auto max-w-[1600px] px-4 pt-6 md:px-6 lg:grid lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-8 lg:px-8 lg:pt-10">
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
                    className={`group/cat relative flex w-full items-center justify-between overflow-hidden rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all duration-300 ${
                      active
                        ? 'bg-[#3E2415] text-[#FAF5EC] shadow-[0_6px_14px_rgba(62,36,21,0.25)]'
                        : 'text-[#3E2415]/80 hover:translate-x-1 hover:bg-[#F3E9D6] hover:text-[#3E2415]'
                    }`}
                  >
                    {!active && (
                      <span className="absolute inset-y-2 left-0 w-[3px] origin-center scale-y-0 rounded-r-full bg-[#C8963E] transition-transform duration-300 group-hover/cat:scale-y-100" />
                    )}
                    <span>{item}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold transition-colors duration-300 ${
                        active
                          ? 'bg-[#C8963E] text-white'
                          : 'bg-[#F3E9D6] text-[#3E2415]/70 group-hover/cat:bg-[#C8963E] group-hover/cat:text-white'
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
                    <SectionHeading title={cat} />
                    <div className={`mt-4 ${GRID}`}>{items.map((item, i) => renderCard(item, i))}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div key={`${category}-${query}`} className="animate-[sectionIn_.4s_ease-out_both]">
                {category !== 'All' && <SectionHeading title={category} />}
                <div className={`mt-4 ${GRID}`}>{filtered.map((item, i) => renderCard(item, i))}</div>
              </div>
            ))}
        </div>
      </div>

      {/* Floating cart bar - same on every screen size */}
      {cartCount > 0 && (
        <div className="menu-motion pointer-events-none fixed inset-x-0 bottom-4 z-40 px-4">
          <div className="pointer-events-auto mx-auto flex max-w-xl animate-[barIn_.5s_cubic-bezier(.2,.8,.2,1)_both] items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-[#1F120B] to-[#4A2C1B] px-4 py-3 text-[#FAF5EC] shadow-[0_10px_30px_rgba(31,18,11,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(31,18,11,0.55)]">
            <div className="flex items-center gap-4">
              <div className="relative">
                <ShoppingBag size={26} className="text-[#E8C98A]" />
                <span
                  key={cartCount}
                  className="absolute -right-2 -top-2 grid h-5 min-w-5 animate-[badgePop_.35s_ease-out] place-items-center rounded-full bg-[#C8963E] px-1 text-[11px] font-bold text-white shadow"
                >
                  {cartCount}
                </span>
              </div>
              <span key={total} className="animate-[sectionIn_.3s_ease-out] text-lg font-bold tracking-tight">
                {money(total)}
              </span>
            </div>
            <Link
              href="/cart"
              className="group/view relative flex items-center gap-2 overflow-hidden rounded-xl bg-[#C8963E] px-5 py-2.5 text-sm font-bold text-white shadow-[0_4px_12px_rgba(200,150,62,0.45)] transition-all duration-300 hover:bg-[#B5852F] hover:shadow-[0_6px_18px_rgba(200,150,62,0.6)] active:scale-95"
            >
              <span className="absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-white/25 transition-transform duration-700 group-hover/view:translate-x-[400%]" />
              <span className="relative">View Cart</span>
              <ArrowRight size={16} className="relative transition-transform duration-300 group-hover/view:translate-x-1" />
            </Link>
          </div>
        </div>
      )}
    </section>
  )
}

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="group/heading flex items-center gap-4">
      <h2 className="text-[22px] font-bold tracking-tight text-[#24140C] md:text-2xl">{title}</h2>
      <span className="hidden h-px flex-1 origin-left bg-gradient-to-r from-[#C8963E]/60 to-transparent md:block" />
    </div>
  )
}

function MenuCard({
  item,
  index,
  isFavorite,
  onToggleFavorite,
  onAdd,
}: {
  item: MenuItem
  index: number
  isFavorite: boolean
  onToggleFavorite: () => void
  onAdd: (item: MenuItem) => void
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  const [added, setAdded] = useState(false)
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Reveal on scroll
  useEffect(() => {
    const el = wrapRef.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          observer.disconnect()
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => () => {
    if (addedTimer.current) clearTimeout(addedTimer.current)
  }, [])

  const handleAdd = () => {
    onAdd(item)
    setAdded(true)
    if (addedTimer.current) clearTimeout(addedTimer.current)
    addedTimer.current = setTimeout(() => setAdded(false), 1300)
  }

  return (
    <div
      ref={wrapRef}
      style={{ transitionDelay: shown ? `${(index % 5) * 70}ms` : '0ms' }}
      className={`transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none ${
        shown ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
    >
      <article className="group relative flex h-full gap-4 rounded-2xl border border-[#E8DCC6]/70 bg-white p-3 shadow-[0_4px_18px_rgba(62,36,21,0.07)] transition-all duration-300 md:flex-col md:gap-0 md:overflow-hidden md:p-0 md:hover:-translate-y-1.5 md:hover:border-[#C8963E]/60 md:hover:shadow-[0_18px_40px_rgba(62,36,21,0.18)]">
        {/* Image */}
        <div className="relative h-[120px] w-[120px] shrink-0 overflow-hidden rounded-xl bg-[#3E2415] sm:h-[132px] sm:w-[132px] md:aspect-[4/3] md:h-auto md:w-full md:rounded-none">
          <Link href={`/menu/${item.slug}`} className="absolute inset-0 block">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover transition duration-700 ease-out group-hover:scale-110 md:group-hover:rotate-[0.6deg]"
              sizes="(max-width: 768px) 30vw, (max-width: 1280px) 30vw, 20vw"
            />
            <span className="absolute inset-0 hidden bg-gradient-to-t from-[#1F120B]/70 via-transparent to-transparent opacity-40 transition-opacity duration-500 group-hover:opacity-100 md:block" />
            {/* View details pill (desktop hover) */}
            <span className="absolute inset-x-0 bottom-3 hidden translate-y-3 justify-center opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:flex">
              <span className="flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-semibold text-[#3E2415] shadow-lg">
                <Eye size={14} />
                View details
              </span>
            </span>
          </Link>

          {item.tag && (
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-[#C8963E] px-3 py-0.5 text-[11px] font-semibold text-white shadow md:bottom-auto md:left-3 md:top-3 md:translate-x-0 md:py-1 md:uppercase md:tracking-wider md:transition-transform md:duration-300 md:group-hover:scale-105">
              {item.tag}
            </span>
          )}

          {/* Desktop heart overlay */}
          <button
            onClick={onToggleFavorite}
            aria-label={isFavorite ? `Remove ${item.name} from favourites` : `Add ${item.name} to favourites`}
            aria-pressed={isFavorite}
            className="absolute right-3 top-3 hidden h-9 w-9 place-items-center rounded-full bg-white/90 text-[#3E2415]/50 shadow transition-all duration-300 hover:scale-110 hover:text-[#C8963E] md:grid md:translate-y-[-6px] md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
            style={isFavorite ? { opacity: 1, transform: 'none' } : undefined}
          >
            <Heart
              size={19}
              className={isFavorite ? 'animate-[heartPop_.4s_ease-out] fill-[#C8963E] text-[#C8963E]' : ''}
              strokeWidth={1.8}
            />
          </button>

          {!item.isAvailable && (
            <span className="pointer-events-none absolute inset-0 grid place-items-center bg-white/80 text-xs font-bold uppercase tracking-wider text-[#3E2415]/60">
              Sold out
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col md:p-4 xl:p-5">
          <Link
            href={`/menu/${item.slug}`}
            className="relative w-fit text-[15px] font-bold leading-snug text-[#24140C] transition-colors duration-300 hover:text-[#C8963E] sm:text-base md:text-[17px]"
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

          <div className="mt-auto flex items-center justify-between gap-2 pt-3 md:pt-4">
            <span className="hidden text-lg font-bold text-[#3E2415] transition-colors duration-300 group-hover:text-[#C8963E] md:block">
              {item.priceNote ?? money(item.price)}
            </span>

            <button
              onClick={handleAdd}
              disabled={!item.isAvailable}
              aria-label={`Add ${item.name} to cart`}
              className={`group/btn relative flex items-center gap-2 overflow-hidden rounded-xl px-5 py-3 text-[13px] font-bold text-[#FAF5EC] shadow-[0_4px_12px_rgba(62,36,21,0.35)] transition-all duration-300 active:scale-95 disabled:cursor-not-allowed disabled:bg-[#3E2415]/20 disabled:shadow-none md:px-4 md:py-2.5 md:hover:-translate-y-0.5 md:hover:shadow-[0_8px_20px_rgba(62,36,21,0.45)] ${
                added ? 'bg-[#C8963E]' : 'bg-[#3E2415] hover:bg-[#2A180E]'
              }`}
            >
              <span className="absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-white/20 transition-transform duration-700 group-hover/btn:translate-x-[400%]" />
              {added ? (
                <>
                  <Check size={15} className="relative" />
                  <span className="relative">Added</span>
                </>
              ) : (
                <>
                  <Plus
                    size={15}
                    className="relative hidden text-[#E8C98A] transition-transform duration-300 group-hover/btn:rotate-90 md:block"
                  />
                  <span className="relative">Add To Cart</span>
                </>
              )}
            </button>

            {/* Mobile heart */}
            <button
              onClick={onToggleFavorite}
              aria-label={isFavorite ? `Remove ${item.name} from favourites` : `Add ${item.name} to favourites`}
              aria-pressed={isFavorite}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[#3E2415]/30 transition-colors hover:text-[#C8963E] md:hidden"
            >
              <Heart
                size={22}
                className={isFavorite ? 'animate-[heartPop_.4s_ease-out] fill-[#C8963E] text-[#C8963E]' : ''}
                strokeWidth={1.8}
              />
            </button>
          </div>
        </div>

        {/* Gold underline that grows on hover (desktop) */}
        <span className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[3px] origin-left scale-x-0 bg-gradient-to-r from-[#C8963E] to-[#E8C98A] transition-transform duration-500 group-hover:scale-x-100 md:block" />
      </article>
    </div>
  )
}

export default function MenuPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF5EC]" />}>
      <MenuContent />
    </Suspense>
  )
}