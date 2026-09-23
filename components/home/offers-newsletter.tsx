import { NewsletterForm } from '@/components/newsletter-form'

export function OffersNewsletter() {
  return (
    <section className="relative w-full overflow-hidden bg-background pb-16 pt-20 md:pb-24 md:pt-32">
      <div className="pointer-events-none absolute inset-0 z-0 h-full w-full">
        <svg
          className="absolute top-0 w-full text-primary/10"
          viewBox="0 0 1440 320"
          fill="currentColor"
          preserveAspectRatio="none"
          style={{ height: '100%' }}
        >
          <path d="M0,96L60,112C120,128,240,160,360,149.3C480,139,600,85,720,96C840,107,960,181,1080,197.3C1200,213,1320,171,1380,149.3L1440,128L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z" />
        </svg>
        <svg
          className="absolute top-0 w-full text-accent/20"
          viewBox="0 0 1440 320"
          fill="currentColor"
          preserveAspectRatio="none"
          style={{ height: '80%' }}
        >
          <path d="M0,192L60,181.3C120,171,240,149,360,165.3C480,181,600,235,720,245.3C840,256,960,224,1080,186.7C1200,149,1320,107,1380,112L1440,117.3L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-12 px-4 text-center sm:px-6 md:flex-row md:items-end md:gap-8 md:text-left lg:px-8">
        <div className="flex w-full flex-col items-center gap-4 pb-4 md:w-1/2 md:items-start md:pb-8">
          <h2 className="text-balance text-4xl font-black uppercase leading-[1.05] tracking-tight text-primary drop-shadow-sm md:text-5xl lg:text-6xl">
            Special Offers <br className="hidden md:block" /> &amp; News
          </h2>
          <p className="mt-2 max-w-md text-sm font-medium text-muted-foreground md:text-base">
            Subscribe now for news, premium promotions, and exclusive menus delivered directly to your inbox.
          </p>

          <div className="mt-6 w-full max-w-lg">
            <NewsletterForm variant="light" />
          </div>
        </div>

        <div className="mt-4 flex w-full select-none items-end justify-center md:mt-0 md:w-1/2 md:justify-end">
          <h2 className="text-right text-[3.5rem] font-black uppercase leading-[0.85] tracking-tighter text-foreground drop-shadow-sm sm:text-6xl md:text-right lg:text-[6.5rem]">
            let&apos;s talk <br />{' '}
            <span className="pr-4 font-serif italic font-normal tracking-normal text-primary">Royal</span>
          </h2>
        </div>
      </div>
    </section>
  )
}
