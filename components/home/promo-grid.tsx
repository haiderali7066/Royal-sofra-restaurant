import Image from 'next/image'
import Link from 'next/link'

export interface PromoCard {
  title: string
  desc: string
  img: string
  href: string
}

export function PromoGrid({ promos }: { promos: PromoCard[] }) {
  return (
    <section className="border-y border-border bg-secondary">
      <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:gap-10 lg:grid-cols-3">
          {promos.map((card) => (
            <Link href={card.href} key={card.title} className="group flex flex-col gap-5">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-border bg-cream shadow-sm transition-all duration-300 group-hover:border-primary group-hover:shadow-2xl sm:aspect-square">
                <Image
                  src={card.img}
                  alt={card.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 z-10 bg-primary/0 transition-colors duration-300 group-hover:bg-primary/10" />
              </div>

              <h3 className="px-2 text-xl font-bold leading-snug text-foreground transition-colors group-hover:text-primary md:text-2xl">
                {card.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
