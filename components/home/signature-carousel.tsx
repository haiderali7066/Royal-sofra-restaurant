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
    <section className="relative flex min-h-[72svh] w-full flex-col justify-center overflow-hidden bg-ink py-8 text-ink-foreground sm:min-h-[76svh] sm:py-10 md:min-h-0 md:block md:py-16 lg:py-20">
      {/* Designed background layer */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* fine hairline texture */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(115deg,currentColor_0px,currentColor_1px,transparent_1px,transparent_88px)] text-primary/[0.06]" />
        {/* soft directional wash */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.08] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-tl from-accent/[0.06] via-transparent to-transparent" />
        {/* offset rings echoing the frame around the dish photo */}
        <div className="absolute -right-24 -top-24 h-[340px] w-[340px] rounded-full border border-primary/10 sm:h-[440px] sm:w-[440px] lg:-right-32 lg:-top-32 lg:h-[560px] lg:w-[560px]" />
        <div className="absolute -bottom-16 -left-16 h-[220px] w-[220px] rounded-full border border-accent/10 sm:h-[280px] sm:w-[280px] lg:-bottom-24 lg:-left-24 lg:h-[360px] lg:w-[360px]" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-6 px-5 sm:gap-10 sm:px-6 lg:grid-cols-12 lg:gap-0 lg:px-8">
        <div className="z-10 order-2 flex flex-col gap-4 lg:order-1 lg:col-span-5 lg:gap-8 lg:pr-12">
          <h2 className="text-[2.5rem] font-light uppercase leading-[0.9] tracking-tighter sm:text-6xl lg:text-[5.5rem]">
            MOST <br />
            <span className="font-serif italic font-normal normal-case text-primary drop-shadow-lg lg:ml-2">Popular</span>
          </h2>

          <div className="min-h-0 border-l border-primary/30 pl-4 sm:pl-6 md:mt-2 md:min-h-[120px]">
            <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-accent sm:mb-4 sm:text-xs">
              Chef&apos;s recommendation
            </span>
            <h3 className="mb-2 font-serif text-xl sm:text-3xl md:mb-4">{dish.title}</h3>
            <p className="max-w-sm text-sm font-light leading-relaxed text-ink-foreground/70 md:text-base">{dish.description}</p>
          </div>

          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6 md:mt-4">
            <Link
              href={`/menu/${dish.slug}`}
              className="w-full border border-primary px-8 py-3 text-center text-xs font-bold uppercase tracking-[0.2em] text-primary transition-colors hover:bg-primary hover:text-ink sm:w-auto sm:py-3.5"
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

        <div className="relative order-1 aspect-[4/3] max-h-[28vh] w-full sm:max-h-[34vh] md:aspect-[4/3] md:max-h-none lg:order-2 lg:col-span-7 lg:-mr-[10vw] lg:aspect-square">
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