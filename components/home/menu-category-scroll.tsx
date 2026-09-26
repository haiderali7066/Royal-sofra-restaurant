'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'

export interface HomeCategory {
  title: string
  image: string
}

export function MenuCategoryScroll({
  categories,
}: {
  categories: HomeCategory[]
}) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollMenu = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return

    const scrollAmount = window.innerWidth > 768 ? 400 : 220

    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  return (
    <section className="relative w-full overflow-hidden bg-background px-4 py-2 sm:px-6 sm:py-16 md:py-24 lg:px-8">
      <div className="mx-auto max-w-[1400px]">

        {/* Heading + Buttons */}
        <div className="mb-8 flex items-center justify-between gap-3 sm:mb-12 md:mb-16 px-1">
          <div className="min-w-0">
            <h2 className="text-3xl font-light leading-[1.1] tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
              Curated{' '}
              <span className="font-serif italic text-primary">
                Selections
              </span>
            </h2>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <Link
              href="/menu"
              className="mr-2 hidden items-center gap-2 text-foreground transition-colors hover:text-primary md:flex"
            >
              <span className="text-xs font-bold uppercase tracking-[0.2em]">
                View Full menu
              </span>
            </Link>

            <button
              onClick={() => scrollMenu('left')}
              aria-label="Scroll left"
              className="flex size-10 items-center justify-center rounded-full border border-border text-foreground transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground sm:size-12"
            >
              <ChevronLeft size={20} strokeWidth={1} className="sm:size-6" />
            </button>

            <button
              onClick={() => scrollMenu('right')}
              aria-label="Scroll right"
              className="flex size-10 items-center justify-center rounded-full border border-border text-foreground transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground sm:size-12"
            >
              <ChevronRight size={20} strokeWidth={1} className="sm:size-6" />
            </button>
          </div>
        </div>

        {/* Categories */}
        <div
          ref={scrollRef}
          className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-6 scrollbar-hide snap-x snap-mandatory sm:mx-0 sm:gap-4 sm:px-0 sm:pb-8 md:gap-8"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {categories.map((item, i) => (
            <Link
              href={`/menu?category=${encodeURIComponent(item.title)}`}
              key={item.title}
              className={`group relative w-[65vw] shrink-0 snap-center overflow-hidden sm:w-[45vw] sm:snap-start md:w-[30vw] lg:w-[22vw] ${
                i % 2 !== 0
                  ? 'lg:mt-12'
                  : 'lg:mb-12'
              }`}
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-secondary">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 65vw, (max-width: 768px) 45vw, 25vw"
                  className="object-cover transition-transform duration-[1000ms] ease-out group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-95" />

                <div className="pointer-events-none absolute inset-3 border border-ink-foreground/20 transition-colors duration-500 group-hover:border-primary/60 sm:inset-4" />

                <div className="absolute inset-x-4 bottom-4 z-10 sm:inset-x-6 sm:bottom-6">
                  <h3 className="mb-1 font-serif text-xl text-ink-foreground sm:text-2xl">
                    {item.title}
                  </h3>

                  <span className="flex translate-y-2 items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    Discover
                    <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile Full Menu */}
        <div className="mt-2 flex justify-center sm:mt-4 md:hidden">
          <Link
            href="/menu"
            className="border-b border-primary pb-1 text-xs font-bold uppercase tracking-[0.2em] text-primary"
          >
            View full menu
          </Link>
        </div>

      </div>
    </section>
  )
}
