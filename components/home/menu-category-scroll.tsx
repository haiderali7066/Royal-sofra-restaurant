'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'

export interface HomeCategory {
  title: string
  image: string
}

export function MenuCategoryScroll({ categories }: { categories: HomeCategory[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollMenu = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const scrollAmount = window.innerWidth > 768 ? 400 : 250
    scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' })
  }

  return (
    <section className="relative w-full overflow-hidden bg-background px-4 py-16 sm:px-6 md:py-24 lg:px-8">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-12 flex flex-col items-end justify-between gap-6 md:mb-16 md:flex-row">
          <div className="max-w-xl">
            <h2 className="text-4xl font-light leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Curated <span className="font-serif italic text-primary">Selections</span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/menu" className="mr-4 hidden items-center gap-2 text-foreground transition-colors hover:text-primary md:flex">
              <span className="text-xs font-bold uppercase tracking-[0.2em]">Full menu</span>
            </Link>
            <button
              onClick={() => scrollMenu('left')}
              aria-label="Scroll left"
              className="flex size-12 items-center justify-center rounded-full border border-border text-foreground transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground"
            >
              <ChevronLeft size={24} strokeWidth={1} />
            </button>
            <button
              onClick={() => scrollMenu('right')}
              aria-label="Scroll right"
              className="flex size-12 items-center justify-center rounded-full border border-border text-foreground transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground"
            >
              <ChevronRight size={24} strokeWidth={1} />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-8 scrollbar-hide snap-x snap-mandatory sm:mx-0 sm:px-0 md:gap-8"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((item, i) => (
            <Link
              href={`/menu?category=${encodeURIComponent(item.title)}`}
              key={item.title}
              className={`group relative w-[75vw] shrink-0 snap-center overflow-hidden sm:w-[45vw] sm:snap-start md:w-[30vw] lg:w-[22vw] ${
                i % 2 !== 0 ? 'lg:mt-12' : 'lg:mb-12'
              }`}
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-secondary">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 75vw, 25vw"
                  className="object-cover transition-transform duration-[1000ms] ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-95" />
                <div className="pointer-events-none absolute inset-4 border border-ink-foreground/20 transition-colors duration-500 group-hover:border-primary/60" />
                <div className="absolute inset-x-6 bottom-6 z-10">
                  <h3 className="mb-1 font-serif text-2xl text-ink-foreground">{item.title}</h3>
                  <span className="flex translate-y-2 items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    Discover <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-4 flex justify-center md:hidden">
          <Link href="/menu" className="border-b border-primary pb-1 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            View full menu
          </Link>
        </div>
      </div>
    </section>
  )
}
