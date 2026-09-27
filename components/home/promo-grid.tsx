import Image from 'next/image'
import Link from 'next/link'

const promoCards = [
  {
    title: 'The Royal Tasting',
    img: 'https://res.cloudinary.com/dvu9vmcqd/image/upload/v1790527847/WhatsApp_Image_2026-09-27_at_8.41.02_PM_fku39l.jpg',
    href: '/menu?category=Special%20Karahi',
  },
  {
    title: 'Shinwari Nights',
    img: 'https://res.cloudinary.com/dvu9vmcqd/image/upload/v1790527847/WhatsApp_Image_2026-09-27_at_6.47.00_PM_nnildz.jpg',
    href: '/menu?category=Royal%20Shinwari',
  },
  {
    title: 'Midnight Grill',
    img: 'https://res.cloudinary.com/dvu9vmcqd/image/upload/v1790527847/WhatsApp_Image_2026-09-27_at_6.46.32_PM_zaiuqo.jpg',
    href: '/menu?category=Royal%20BBQ',
  },
]

export function PromoGrid() {
  return (
    <section className="relative overflow-hidden border-y border-border bg-[#eee7dc]">
      
      {/* Premium Background Decoration */}
      <div className="pointer-events-none absolute inset-0 z-0">
        
        {/* --- Top Multi-Layer Fluid Wave --- */}
        <div className="absolute left-0 top-0 w-full overflow-hidden leading-[0]">
          <svg
            className="relative block h-[60px] w-[150%] max-w-none text-primary/15 md:h-[120px] md:w-full"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              opacity=".4"
              className="fill-current"
            />
            <path
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
              opacity=".7"
              className="fill-current"
            />
            <path
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
              className="fill-current"
            />
          </svg>
        </div>

        {/* Fluid horizontal glow stretching like water */}
        <div className="absolute left-1/2 top-0 h-[250px] w-[150%] -translate-x-1/2 rounded-[100%] bg-primary/10 blur-[100px] md:h-[400px]" />
        
        {/* Soft bottom-right counter glow */}
        <div className="absolute -bottom-40 -right-32 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />

        {/* Fine premium mesh pattern */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.5) 1px, transparent 1px)
            `,
            backgroundSize: '70px 70px',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-4 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-28 md:pb-24 lg:px-8">
        
        {/* Section heading */}
        <div className="mb-10 text-center sm:mb-14 md:mb-16">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.35em] text-primary">
            Royal Sofra
          </p>

          <h2 className="text-3xl font-light tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
            A taste of
            <span className="ml-2 font-serif italic text-primary">
              royalty
            </span>
          </h2>

          <div className="mx-auto mt-5 h-px w-16 bg-primary/50" />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {promoCards.map((card) => (
            <Link
              href={card.href}
              key={card.title}
              aria-label={card.title}
              className="group relative block aspect-square overflow-hidden rounded-2xl border border-black/10 bg-secondary shadow-lg transition-all duration-500 hover:-translate-y-1 hover:border-primary/60 hover:shadow-2xl sm:rounded-[20px]"
            >
              <Image
                src={card.img}
                alt={card.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
              />

              {/* Soft hover overlay */}
              <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />

              {/* Inner premium frame */}
              <div className="pointer-events-none absolute inset-3 rounded-xl border border-white/0 transition-all duration-700 group-hover:inset-5 group-hover:border-white/50" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}