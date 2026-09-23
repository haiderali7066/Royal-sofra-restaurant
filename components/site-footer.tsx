import Link from 'next/link'
import { Mail, MapPin, Phone } from 'lucide-react'
import { brand } from '@/lib/mock-data'
import { NewsletterForm } from '@/components/newsletter-form'

// lucide-react dropped brand/social marks (Facebook, Instagram, Youtube) in
// recent major versions, so these are rendered as small inline glyphs instead.
type IconProps = React.SVGProps<SVGSVGElement> & { size?: number }

function FacebookIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" {...props}>
      <path d="M13.5 21v-7.02h2.36l.36-2.73h-2.72V9.4c0-.79.22-1.33 1.35-1.33h1.44V5.65c-.25-.03-1.1-.11-2.1-.11-2.08 0-3.5 1.27-3.5 3.6v2.11H8.27v2.73h2.36V21h2.87Z" />
    </svg>
  )
}

function InstagramIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function YoutubeIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" {...props}>
      <path d="M21.6 7.2s-.2-1.5-.8-2.1c-.8-.8-1.7-.8-2.1-.9C15.9 4 12 4 12 4h0s-3.9 0-6.7.2c-.4.1-1.3.1-2.1.9-.6.6-.8 2.1-.8 2.1S2.2 9 2.2 10.7v1.5c0 1.8.2 3.5.2 3.5s.2 1.5.8 2.1c.8.8 1.8.8 2.3.9 1.7.2 7.5.2 7.5.2s3.9 0 6.7-.2c.4-.1 1.3-.1 2.1-.9.6-.6.8-2.1.8-2.1s.2-1.7.2-3.5v-1.5c0-1.7-.2-3.5-.2-3.5ZM9.9 14.6V9l6 2.8-6 2.8Z" />
    </svg>
  )
}

const exploreLinks = [
  { label: 'About', href: '/about' },
  { label: 'Menu', href: '/menu' },
  { label: 'Blogs', href: '/blogs' },
]

const helpLinks = [
  { label: 'Track order', href: '/track-order' },
  { label: 'Contact', href: '/contact' },
  { label: 'Admin', href: '/admin' },
]

const brandWords = brand.name.toUpperCase().split(' ')

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-primary/10 bg-gradient-to-b from-ink to-[#150d08] px-6 pb-8 pt-24 text-ink-foreground selection:bg-primary selection:text-primary-foreground sm:px-12">
      <div className="mx-auto flex max-w-[1400px] flex-col items-center">
        <div className="relative z-10 mb-24 w-full max-w-2xl text-center">
          <h2 className="mb-6 text-balance text-4xl font-light leading-tight tracking-wide md:text-5xl lg:text-[3.25rem]">
            Tastes, tales, and <span className="font-serif italic text-primary">Treats</span>{' '}
            <br className="hidden sm:block" />
            straight to your <span className="font-serif italic text-primary">Inbox</span>!
          </h2>
          <p className="mb-10 text-sm font-light text-ink-foreground/90 md:text-base">
            Join our newsletter for exclusive tasting menus and event updates.
          </p>
          <NewsletterForm variant="dark" />
        </div>

        <div className="z-10 mb-16 grid w-full grid-cols-1 gap-16 px-4 text-sm md:mb-24 lg:grid-cols-[1fr_auto_1fr] lg:gap-12">
          <nav className="flex flex-col justify-center gap-10 text-left sm:flex-row sm:gap-20 lg:justify-end lg:pr-12">
            <ul className="flex flex-col space-y-6 font-semibold tracking-[0.15em] text-ink-foreground">
              {exploreLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex items-center gap-3 uppercase transition-all duration-300 hover:text-primary"
                  >
                    <span className="h-[1px] w-0 bg-primary transition-all duration-300 group-hover:w-4" />
                    <span className="transition-transform duration-300 group-hover:translate-x-1">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="flex flex-col space-y-6 font-semibold tracking-[0.15em] text-ink-foreground">
              {helpLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex items-center gap-3 uppercase transition-all duration-300 hover:text-primary"
                  >
                    <span className="h-[1px] w-0 bg-primary transition-all duration-300 group-hover:w-4" />
                    <span className="transition-transform duration-300 group-hover:translate-x-1">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden min-h-[160px] w-[1px] self-center bg-gradient-to-b from-transparent via-ink-foreground/20 to-transparent lg:block" />

          <div className="flex flex-col justify-center gap-12 text-left sm:flex-row sm:gap-20 lg:justify-start lg:pl-12">
            <address className="flex flex-col space-y-6 font-light not-italic text-ink-foreground/80">
              <a href={`mailto:${brand.email}`} className="group flex items-center gap-4 transition-colors hover:text-primary">
                <span className="flex size-8 items-center justify-center rounded-full bg-ink-foreground/5 transition-colors group-hover:bg-primary/10">
                  <Mail size={14} className="text-primary" />
                </span>
                {brand.email}
              </a>
              <a href={brand.phoneHref} className="group flex items-center gap-4 text-lg font-medium transition-colors hover:text-primary">
                <span className="flex size-8 items-center justify-center rounded-full bg-ink-foreground/5 transition-colors group-hover:bg-primary/10">
                  <Phone size={14} className="text-primary" />
                </span>
                {brand.phone}
              </a>
              <div className="flex items-start gap-4">
                <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-ink-foreground/5">
                  <MapPin size={14} className="text-primary" />
                </span>
                <p className="max-w-[200px] pt-2 text-xs font-medium uppercase leading-relaxed tracking-widest text-ink-foreground/60">
                  {brand.address}
                </p>
              </div>
            </address>

            <div className="flex flex-col items-center justify-center space-y-6 sm:items-start">
              <p className="border-b border-ink-foreground/20 pb-2 text-xs font-semibold uppercase tracking-[0.15em] text-ink-foreground">
                Follow Us
              </p>
              <ul className="flex gap-4">
                {[
                  { Icon: FacebookIcon, label: 'Facebook' },
                  { Icon: InstagramIcon, label: 'Instagram' },
                  { Icon: YoutubeIcon, label: 'Youtube' },
                ].map(({ Icon, label }) => (
                  <li key={label}>
                    <a
                      href="#"
                      className="flex size-10 items-center justify-center rounded-full bg-ink-foreground/5 transition-all duration-300 hover:-translate-y-1 hover:bg-primary hover:text-ink"
                      aria-label={label}
                    >
                      <Icon size={18} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex w-full select-none flex-col overflow-hidden pb-4 pointer-events-none">
          {brandWords.map((word, idx) => (
            <span
              key={word + idx}
              className={`bg-gradient-to-b from-ink-foreground to-ink-foreground/30 bg-clip-text text-[clamp(5rem,15vw,17rem)] font-serif leading-[0.8] tracking-tighter text-transparent ${
                idx % 2 === 0 ? 'text-left' : '-mt-[2%] text-right sm:-mt-[4%]'
              }`}
            >
              {word}
            </span>
          ))}
        </div>

        <div className="relative z-10 mt-8 flex w-full flex-col items-center justify-between gap-4 border-t border-ink-foreground/10 px-4 pt-6 text-xs font-light tracking-wider text-ink-foreground/50 md:flex-row">
          <p>© {new Date().getFullYear()} {brand.name}. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="/privacy" className="transition-colors hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-primary">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
