'use client'

import Link from 'next/link'
import { FiMail, FiMapPin, FiPhone } from 'react-icons/fi'
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa6'
import { NewsletterForm } from '@/components/newsletter-form'

// Hardcoded restaurant info to ensure it works instantly without touching mock-data
const royalSofra = {
  name: 'Royal Sofra',
  email: 'info@royalsofra.com',
  phone: '+92 345 9567444',
  phoneHref: 'tel:+923459567444',
  address: '5th Road Commercial Market Rd, Block D Satellite Town, Rawalpindi, 46000',
  socials: [
    { icon: FaFacebookF, label: 'Facebook', href: 'https://www.facebook.com/royalsofraofficial/' },
    { icon: FaInstagram, label: 'Instagram', href: 'https://www.instagram.com/royalsofraofficial/' },
    { icon: FaTiktok, label: 'TikTok', href: 'https://www.tiktok.com/@royalsofra' },
    { icon: FaYoutube, label: 'Youtube', href: 'https://www.youtube.com/@royalsofraofficial' },
  ]
}

const exploreLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Our Menu', href: '/menu' },
  { label: 'Reservations', href: '/reservations' },
]

const helpLinks = [
  { label: 'Track Order', href: '/track-order' },
  { label: 'Contact', href: '/contact' },
  { label: 'Admin', href: '/admin' },
]

const brandWords = royalSofra.name.toUpperCase().split(' ')

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-[#D4A24C]/20 bg-gradient-to-b from-[#2B1B12] to-[#110A06] px-6 pb-8 pt-20 text-[#FAF7F2] selection:bg-[#D4A24C] selection:text-white sm:px-12 md:pt-32">
      <div className="mx-auto flex max-w-[1400px] flex-col items-center">
        
        {/* --- Newsletter Section --- */}
        <div className="relative z-10 mb-20 w-full max-w-2xl text-center md:mb-28">
          <h2 className="mb-6 text-balance text-4xl font-light leading-tight tracking-wide md:text-5xl lg:text-[3.5rem]">
            Tastes, tales, and <span className="font-serif italic text-[#D4A24C]">Treats</span>{' '}
            <br className="hidden sm:block" />
            straight to your <span className="font-serif italic text-[#D4A24C]">Inbox</span>!
          </h2>
          <p className="mb-10 text-sm font-light text-[#FAF7F2]/80 md:text-base">
            Join our newsletter for exclusive tasting menus, discounts, and event updates.
          </p>
          <div className="mx-auto max-w-md">
            <NewsletterForm variant="dark" />
          </div>
        </div>

        {/* --- Main Footer Grid --- */}
        <div className="z-10 mb-16 grid w-full grid-cols-1 gap-16 px-4 text-sm md:mb-24 lg:grid-cols-[1fr_auto_1fr] lg:gap-12">
          
          {/* Navigation Links */}
          <nav className="flex flex-col items-center gap-10 text-center sm:flex-row sm:justify-center sm:gap-20 lg:justify-end lg:pr-12 lg:text-left">
            <ul className="flex flex-col space-y-6 font-semibold tracking-[0.15em] text-[#FAF7F2]">
              {exploreLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex items-center justify-center gap-3 uppercase transition-all duration-300 hover:text-[#D4A24C] lg:justify-start"
                  >
                    <span className="hidden h-[1px] w-0 bg-[#D4A24C] transition-all duration-300 group-hover:w-4 lg:block" />
                    <span className="transition-transform duration-300 lg:group-hover:translate-x-1">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="flex flex-col space-y-6 font-semibold tracking-[0.15em] text-[#FAF7F2]">
              {helpLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex items-center justify-center gap-3 uppercase transition-all duration-300 hover:text-[#D4A24C] lg:justify-start"
                  >
                    <span className="hidden h-[1px] w-0 bg-[#D4A24C] transition-all duration-300 group-hover:w-4 lg:block" />
                    <span className="transition-transform duration-300 lg:group-hover:translate-x-1">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Vertical Divider (Desktop only) */}
          <div className="hidden min-h-[160px] w-[1px] self-center bg-gradient-to-b from-transparent via-[#D4A24C]/30 to-transparent lg:block" />

          {/* Contact & Socials */}
          <div className="flex flex-col items-center gap-12 text-center lg:items-start lg:justify-start lg:pl-12 lg:text-left">
            <address className="flex flex-col items-center space-y-6 font-light not-italic text-[#FAF7F2]/80 lg:items-start">
              
              <a href={`mailto:${royalSofra.email}`} className="group flex items-center gap-4 transition-colors hover:text-[#D4A24C]">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FAF7F2]/5 transition-colors group-hover:bg-[#D4A24C]/20">
                  <FiMail size={16} className="text-[#D4A24C]" />
                </span>
                {royalSofra.email}
              </a>

              <a href={royalSofra.phoneHref} className="group flex items-center gap-4 text-base font-medium transition-colors hover:text-[#D4A24C] md:text-lg">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FAF7F2]/5 transition-colors group-hover:bg-[#D4A24C]/20">
                  <FiPhone size={16} className="text-[#D4A24C]" />
                </span>
                <div className="flex flex-col items-start leading-tight">
                  <span>+92 345 9567444</span>
                  <span className="text-sm font-light opacity-70">051-8894444</span>
                </div>
              </a>

              <div className="flex items-start gap-4 text-left">
                <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FAF7F2]/5">
                  <FiMapPin size={16} className="text-[#D4A24C]" />
                </span>
                <p className="max-w-[220px] pt-1.5 text-[11px] font-medium uppercase leading-relaxed tracking-widest text-[#FAF7F2]/60 sm:text-xs">
                  {royalSofra.address}
                </p>
              </div>

            </address>

            {/* Social Icons */}
            <div className="flex flex-col items-center justify-center space-y-6 lg:items-start">
              <p className="border-b border-[#FAF7F2]/20 pb-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#FAF7F2]">
                Follow Us
              </p>
              <ul className="flex gap-4">
                {royalSofra.socials.map(({ icon: Icon, label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FAF7F2]/5 text-[#FAF7F2]/70 transition-all duration-300 hover:-translate-y-1 hover:bg-[#D4A24C] hover:text-[#110A06]"
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

        {/* --- Massive Background Text --- */}
        <div className="flex w-full select-none flex-col overflow-hidden pb-8 pointer-events-none sm:pb-4">
          {brandWords.map((word, idx) => (
            <span
              key={word + idx}
              className={`bg-gradient-to-b from-[#FAF7F2]/80 to-[#FAF7F2]/10 bg-clip-text text-[clamp(4.5rem,14vw,17rem)] font-serif leading-[0.8] tracking-tighter text-transparent ${
                idx % 2 === 0 ? 'text-center sm:text-left' : 'mt-2 text-center sm:-mt-[4%] sm:text-right'
              }`}
            >
              {word}
            </span>
          ))}
        </div>

        {/* --- Copyright Bar --- */}
       <div className="relative z-10 mt-4 flex w-full flex-col items-center justify-between gap-4 border-t border-[#FAF7F2]/10 px-4 pt-8 text-xs font-light tracking-wider text-[#FAF7F2]/50 md:mt-8 md:flex-row md:gap-4">
  <p>© {new Date().getFullYear()} {royalSofra.name}. All rights reserved.</p>

  <p className="text-center">
    Developed by{' '}
    <a 
      href="https://devntomsolutions.com" 
      target="_blank" 
      rel="noopener noreferrer" 
      className="font-medium text-[#FAF7F2]/80 transition-colors hover:text-[#D4A24C]"
    >
      Devntom Solutions
    </a>
  </p>

  <div className="flex flex-wrap justify-center gap-6 md:gap-8">
    <Link href="/privacy" className="transition-colors hover:text-[#D4A24C]">
      Privacy Policy
    </Link>
    <Link href="/terms" className="transition-colors hover:text-[#D4A24C]">
      Terms of Service
    </Link>
  </div>
</div>

      </div>
    </footer>
  )
}