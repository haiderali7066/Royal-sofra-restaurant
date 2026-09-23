import Image from 'next/image'

export function AppDownload() {
  return (
    <section className="mx-auto w-full max-w-[1400px] px-4 py-16 sm:px-6 md:py-24 lg:px-8">
      {/* Gold gradient card intentionally bypasses the (now dark) --primary token
          and uses explicit gold hexes -- this is the one bright, celebratory
          surface on the page, meant to pop against the ink CTAs elsewhere. */}
      <div className="relative flex flex-col-reverse items-center justify-between gap-10 overflow-visible rounded-[2rem] border border-accent/50 bg-gradient-to-br from-[#E8C87A] via-accent to-[#B8862B] p-8 shadow-[0_20px_50px_rgba(201,151,74,0.25)] sm:p-10 md:flex-row md:rounded-[3rem] md:p-16">
        <div className="z-20 mt-16 flex w-full justify-center md:absolute md:-bottom-12 md:left-12 md:mt-0 md:w-5/12">
          <div className="relative flex h-[480px] w-[240px] -rotate-0 items-center justify-center overflow-hidden rounded-[2.5rem] border-[8px] border-ink bg-ink shadow-[20px_20px_60px_rgba(0,0,0,0.3)] transition-transform duration-700 ease-out hover:rotate-0 md:h-[560px] md:w-[280px] md:rotate-3 md:rounded-[3rem] md:border-[10px]">
            <div className="absolute top-0 z-30 h-6 w-1/2 rounded-b-2xl bg-ink" />
            <Image src="/app-mockup.png" alt="Royal Sofra app interface" fill className="z-20 object-cover" />
          </div>
        </div>

        <div className="z-10 flex w-full flex-col gap-5 text-ink md:ml-auto md:w-6/12">
          <div className="w-fit rounded-full border border-background/60 bg-cream/80 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-ink shadow-sm backdrop-blur-md">
            The Royal App
          </div>

          <h2 className="text-4xl font-black leading-[1.05] tracking-tight drop-shadow-sm sm:text-5xl md:text-6xl">
            Dining Luxury, <br />
            <span className="font-serif italic font-normal">In Your Pocket.</span>
          </h2>

          <p className="mb-4 max-w-lg text-base font-medium leading-relaxed text-ink/80 md:text-lg">
            Elevate your dining experience. Download our companion mobile app to explore the menu, book tables, and
            order your royal feast seamlessly.
          </p>

          <div className="mt-2 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <a
              href="#"
              className="flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-ink px-6 text-ink-foreground shadow-lg transition-colors hover:bg-[#241a12] sm:w-auto"
            >
              <svg className="size-6 fill-current" viewBox="0 0 24 24">
                <path d="M17.523 15.3414C17.5193 11.4507 20.6757 9.53767 20.8179 9.44474C18.9959 6.8152 16.1472 6.42531 15.1979 6.30232C13.208 6.09673 11.3129 7.45862 10.2974 7.45862C9.28182 7.45862 7.72895 6.33125 6.07998 6.36395C3.93175 6.39665 1.95427 7.59392 0.852431 9.48911C-1.39763 13.315 0.280145 18.9748 2.47454 22.0911C3.54142 23.6067 4.79373 25.3262 6.42398 25.2608C7.99462 25.1954 8.60447 24.2612 10.5147 24.2612C12.4249 24.2612 12.9752 25.2608 14.6055 25.2281C16.2953 25.1954 17.3622 23.672 18.429 22.1238C19.6644 20.3473 20.1706 18.636 20.2033 18.5381C20.1415 18.5054 17.5267 17.5303 17.523 15.3414ZM14.1795 4.26027C15.0348 3.24227 15.6171 1.8398 15.4606 0.437317C14.2813 0.486355 12.7849 1.22687 11.8969 2.21206C11.1144 3.06734 10.4137 4.51086 10.603 5.88902C11.921 5.98709 13.3242 5.27836 14.1795 4.26027Z" />
              </svg>
              <div className="flex flex-col items-start leading-none">
                <span className="text-[10px] font-medium text-ink-foreground/80">Download on the</span>
                <span className="text-sm font-bold tracking-wide">App Store</span>
              </div>
            </a>

            <a
              href="#"
              className="flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-ink px-6 text-ink-foreground shadow-lg transition-colors hover:bg-[#241a12] sm:w-auto"
            >
              <svg className="size-6 fill-current" viewBox="0 0 512 512">
                <path d="M99.617 8.057a50.191 50.191 0 00-38.815-6.713l230.932 230.933 74.846-74.846L99.617 8.057zM32.139 20.116c-6.441 8.563-10.148 19.077-10.148 30.199v411.358c0 11.123 3.708 21.636 10.148 30.199l235.877-235.877L32.139 20.116zM464.261 212.087l-67.266-37.637-81.544 81.545 81.548 81.548 67.273-37.64c16.117-9.014 25.738-25.442 25.738-43.908s-9.621-34.894-25.749-43.908zM291.733 279.711L60.815 510.629c3.158.836 6.345 1.305 9.512 1.305 26.559 0 52.819-15.342 68.329-33.003l153.077-199.22z" />
              </svg>
              <div className="flex flex-col items-start leading-none">
                <span className="text-[10px] font-medium text-ink-foreground/80">GET IT ON</span>
                <span className="text-sm font-bold tracking-wide">Google Play</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
