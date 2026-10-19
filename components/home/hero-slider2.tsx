'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock } from 'lucide-react'
import { brand } from '@/lib/mock-data'

const HERO_IMAGES = [
  'https://res.cloudinary.com/dvu9vmcqd/image/upload/v1790684288/WhatsApp_Image_2026-09-29_at_9.09.29_AM_nrxt8q.jpg',
  'https://res.cloudinary.com/dvu9vmcqd/image/upload/v1790684289/WhatsApp_Image_2026-09-29_at_9.09.09_AM_gciz3w.jpg',
  'https://res.cloudinary.com/dvu9vmcqd/image/upload/v1790701760/WhatsApp_Image_2026-09-29_at_10.08.57_PM_sybiks.jpg',
  
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
    <>
      {/* HERO */}
      <section className="relative w-full bg-ink">
        {/* 1920 × 650 aspect ratio */}
        <div className="relative aspect-[1920/650] w-full overflow-hidden">
          {HERO_IMAGES.map((src, index) => (
            <div
              key={src}
              className={`absolute inset-0 h-full w-full transition-opacity duration-[1500ms] ease-in-out ${
                index === currentIndex
                  ? 'z-0 opacity-100'
                  : 'z-0 opacity-0'
              }`}
            >
              <Image
                src={src}
                alt="Royal Sofra signature dishes"
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-contain object-center"
              />
            </div>
          ))}

          {/* Overlay */}
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-ink/90 via-ink/35 to-black/30" />

          {/* Hero Content */}
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 text-center">
            <span className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-primary drop-shadow-md sm:mb-4 sm:text-xs md:text-sm">
              {brand.tagline}
            </span>

            <h1 className="text-balance text-4xl font-light leading-[0.95] tracking-tight text-ink-foreground drop-shadow-xl sm:text-5xl md:text-7xl lg:text-[7rem]">
              A CULINARY
              <br />
              <span className="font-serif italic font-medium text-primary">
                Symphony
              </span>
            </h1>
          </div>

          {/* Slider Dots */}
          <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 gap-2 sm:bottom-6 sm:gap-3 md:bottom-8">
            {HERO_IMAGES.map((src, idx) => (
              <button
                key={src}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  idx === currentIndex
                    ? 'w-8 bg-primary'
                    : 'w-2 bg-ink-foreground/50 hover:bg-ink-foreground'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* RESERVATION / TABLE SECTION */}
      <div className="relative z-30 mx-auto w-[94%] max-w-[1000px] overflow-hidden border border-border bg-cream/95 p-4 shadow-[0_20px_40px_rgba(43,27,18,0.15)] backdrop-blur-md sm:w-[92%] sm:p-5 md:-mt-12 md:translate-y-1/2 md:p-6 lg:p-8">
  <div className="flex min-w-0 flex-col gap-5 sm:gap-6 md:flex-row md:items-center md:justify-between">

    {/* Details */}
    <div className="grid w-full min-w-0 grid-cols-2 gap-3 sm:gap-6 md:w-auto md:flex md:items-center">

      {/* Reserve */}
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <Calendar
          size={20}
          className="h-5 w-5 shrink-0 text-primary sm:h-6 sm:w-6"
        />

        <div className="flex min-w-0 flex-col overflow-hidden">
          <span className="truncate text-[10px] font-bold uppercase tracking-wider text-foreground sm:text-xs">
            Reserve
          </span>

          <span className="truncate text-xs font-light text-muted-foreground sm:text-sm">
            Book a table
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="hidden h-10 w-px shrink-0 bg-border md:block" />

      {/* Hours */}
      <div className="flex min-w-0 items-center gap-2 overflow-hidden sm:gap-3">
        <Clock
          size={20}
          className="h-5 w-5 shrink-0 text-primary sm:h-6 sm:w-6"
        />

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <span className="text-[10px] font-bold uppercase tracking-wider text-foreground sm:text-xs">
            Hours
          </span>

          <span className="block truncate text-xs font-light text-muted-foreground sm:text-sm">
            {brand.hours}
          </span>
        </div>
      </div>

    </div>

    {/* Button */}
    <Link
      href="/contact"
      className="flex w-full shrink-0 items-center justify-center overflow-hidden bg-ink px-5 py-3.5 text-center text-[11px] font-bold uppercase tracking-[0.18em] text-ink-foreground transition-colors duration-300 hover:bg-primary sm:py-4 sm:text-xs md:w-auto md:min-w-[180px] md:px-8"
    >
      Find a table
    </Link>

  </div>
</div>
    </>
  )
}
