'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export interface SignatureDish {
  slug: string
  title: string
  description: string
  image: string
}

export function SignatureCarousel({ dishes }: { dishes: SignatureDish[] }) {
  const [index, setIndex] = useState(0)
  const dish = dishes[index]

  return (
    <section className="relative w-full overflow-hidden bg-ink py-16 text-ink-foreground md:py-32">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-0 lg:px-8">
        <div className="z-10 order-2 flex flex-col gap-6 lg:order-1 lg:col-span-5 lg:pr-12 md:gap-8">
          <h2 className="text-[3rem] font-light uppercase leading-[0.9] tracking-tighter sm:text-6xl lg:text-[5.5rem]">
            MOST <br />
            <span className="font-serif italic font-normal normal-case text-primary drop-shadow-lg lg:ml-2">Popular</span>
          </h2>

          <div className="mt-2 min-h-[140px] border-l border-primary/30 pl-5 md:mt-4 md:min-h-[160px] md:pl-6">
            <span className="mb-3 block text-[10px] font-bold uppercase tracking-[0.2em] text-accent sm:mb-4 sm:text-xs">
              Chef&apos;s recommendation
            </span>
            <h3 className="mb-3 font-serif text-2xl sm:text-3xl md:mb-4">{dish.title}</h3>
            <p className="max-w-sm text-sm font-light leading-relaxed text-ink-foreground/70 md:text-base">{dish.description}</p>
          </div>

          <div className="mt-2 flex flex-col items-start gap-6 sm:flex-row sm:items-center md:mt-4">
            <Link
              href={`/menu/${dish.slug}`}
              className="w-full border border-primary px-8 py-3.5 text-center text-xs font-bold uppercase tracking-[0.2em] text-primary transition-colors hover:bg-primary hover:text-ink sm:w-auto"
            >
              Order now
            </Link>

            <div className="flex w-full justify-center gap-4 sm:w-auto sm:justify-start">
              <button
                onClick={() => setIndex((prev) => (prev === 0 ? dishes.length - 1 : prev - 1))}
                className="p-2 text-ink-foreground/70 transition-colors hover:text-primary"
                aria-label="Previous dish"
              >
                <ArrowLeft strokeWidth={1} size={28} />
              </button>
              <button
                onClick={() => setIndex((prev) => (prev + 1) % dishes.length)}
                className="p-2 text-ink-foreground/70 transition-colors hover:text-primary"
                aria-label="Next dish"
              >
                <ArrowRight strokeWidth={1} size={28} />
              </button>
            </div>
          </div>
        </div>

        <div className="relative order-1 aspect-square w-full lg:order-2 lg:col-span-7 lg:-mr-[10vw] md:aspect-[4/3]">
          {dishes.map((d, idx) => (
            <div
              key={d.slug}
              className={`absolute inset-0 transition-all duration-[1200ms] ease-in-out ${
                idx === index ? 'z-10 translate-x-0 opacity-100' : 'z-0 translate-x-8 opacity-0'
              }`}
            >
              <Image src={d.image} alt={d.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 60vw" />
              <div className="pointer-events-none absolute inset-3 border border-primary/20 md:inset-4" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
