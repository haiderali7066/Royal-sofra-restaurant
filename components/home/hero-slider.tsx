'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock } from 'lucide-react'
import { brand } from '@/lib/mock-data'

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=2000&q=85',
  'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=2000&q=85',
  'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=2000&q=85',
]

export function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative flex h-[90vh] min-h-[600px] w-full flex-col justify-between bg-ink">
      {HERO_IMAGES.map((src, index) => (
        <div
          key={src}
          className={`absolute inset-0 h-full w-full transition-opacity duration-[1500ms] ease-in-out ${
            index === currentIndex ? 'z-0 opacity-100' : 'z-0 opacity-0'
          }`}
        >
          <Image
            src={src}
            alt="Royal Sofra signature dishes"
            fill
            priority={index === 0}
            sizes="100vw"
            className="scale-105 object-cover object-center"
          />
        </div>
      ))}

      <div className="absolute inset-0 z-10 bg-gradient-to-t from-ink via-ink/40 to-black/40" />

      <div className="absolute inset-0 z-20 mt-10 flex flex-col items-center justify-center px-4 text-center md:mt-16">
        <span className="mb-4 text-xs font-bold uppercase tracking-[0.4em] text-primary drop-shadow-md sm:text-sm md:mb-6">
          {brand.tagline}
        </span>
        <h1 className="text-balance text-5xl font-light leading-[0.95] tracking-tight text-ink-foreground drop-shadow-xl md:text-7xl lg:text-[7rem]">
          A CULINARY <br />
          <span className="font-serif italic font-medium text-primary">Symphony</span>
        </h1>
      </div>

      <div className="absolute bottom-32 left-1/2 z-30 flex -translate-x-1/2 gap-2 sm:gap-3 md:bottom-40">
        {HERO_IMAGES.map((src, idx) => (
          <button
            key={src}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              idx === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-ink-foreground/50 hover:bg-ink-foreground'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      <div className="absolute bottom-0 left-1/2 z-30 flex w-[92%] max-w-[1000px] -translate-x-1/2 translate-y-1/2 flex-col items-center justify-between gap-4 border border-border bg-cream/95 p-4 shadow-[0_20px_40px_rgba(43,27,18,0.15)] backdrop-blur-md sm:p-6 md:flex-row md:gap-6 lg:p-8">
        <div className="flex w-full flex-row justify-between gap-4 sm:gap-8 md:w-auto">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Calendar size={20} className="shrink-0 text-primary" />
            <div className="flex flex-col text-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-foreground sm:text-xs">Reserve</span>
              <span className="whitespace-nowrap text-xs font-light sm:text-sm">Book a table</span>
            </div>
          </div>
          <div className="h-10 w-px bg-border" />
          <div className="flex items-center gap-3 text-muted-foreground">
            <Clock size={20} className="shrink-0 text-primary" />
            <div className="flex flex-col text-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-foreground sm:text-xs">Hours</span>
              <span className="whitespace-nowrap text-xs font-light sm:text-sm">{brand.hours}</span>
            </div>
          </div>
        </div>
        <Link
          href="/contact"
          className="w-full whitespace-nowrap bg-ink px-8 py-3.5 text-center text-xs font-bold uppercase tracking-[0.2em] text-ink-foreground transition-all duration-500 hover:bg-primary sm:py-4 md:w-auto"
        >
          Find a table
        </Link>
      </div>
    </section>
  )
}
