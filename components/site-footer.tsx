'use client'

import Link from 'next/link'
import { FiMail, FiMapPin, FiPhone } from 'react-icons/fi'
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa6'

const royalSofra = {
  name: 'Royal Sofra',
  email: 'info@royalsofra.com',
  phone: '+92 345 9567444',
  phoneHref: 'tel:+923459567444',
  landline: '051-8894444',
  landlineHref: 'tel:0518894444',
  address: '5th Road Commercial Market Rd, Block D Satellite Town, Rawalpindi, 46000',
  socials: [
    { icon: FaFacebookF, label: 'Facebook', href: 'https://www.facebook.com/royalsofraofficial/' },
    { icon: FaInstagram, label: 'Instagram', href: 'https://www.instagram.com/royalsofraofficial/' },
    { icon: FaTiktok, label: 'TikTok', href: 'https://www.tiktok.com/@royalsofra' },
    { icon: FaYoutube, label: 'Youtube', href: 'https://www.youtube.com/@royalsofraofficial' },
  ],
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

function LinkColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-[#D4A24C]">{title}</h3>
      <ul className="mt-4 space-y-3 text-sm text-[#FAF7F2]/80">
        {links.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="transition-colors hover:text-[#D4A24C]">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t border-[#D4A24C]/20 bg-[#1F140D] px-5 pb-6 pt-12 text-[#FAF7F2] md:px-10 md:pt-16">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.5fr] lg:gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="font-serif text-3xl tracking-wide">
              Royal <span className="italic text-[#D4A24C]">Sofra</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-[#FAF7F2]/70">
              Dine in, order online or reserve your table. We look forward to serving you.
            </p>
            <ul className="mt-6 flex gap-3">
              {royalSofra.socials.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2B1B12] text-[#FAF7F2]/80 transition-colors hover:bg-[#D4A24C] hover:text-[#1F140D]"
                  >
                    <Icon size={16} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links: side by side on mobile */}
          <div className="grid grid-cols-2 gap-8 sm:contents">
            <LinkColumn title="Explore" links={exploreLinks} />
            <LinkColumn title="Help" links={helpLinks} />
          </div>

          {/* Contact */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-[#D4A24C]">Contact</h3>
            <address className="mt-4 space-y-3 text-sm not-italic text-[#FAF7F2]/80">
              <p className="flex items-start gap-3">
                <FiPhone size={16} className="mt-0.5 shrink-0 text-[#D4A24C]" />
                <span className="flex flex-col">
                  <a href={royalSofra.phoneHref} className="transition-colors hover:text-[#D4A24C]">
                    {royalSofra.phone}
                  </a>
                  <a href={royalSofra.landlineHref} className="transition-colors hover:text-[#D4A24C]">
                    {royalSofra.landline}
                  </a>
                </span>
              </p>
              <p className="flex items-start gap-3">
                <FiMail size={16} className="mt-0.5 shrink-0 text-[#D4A24C]" />
                <a href={`mailto:${royalSofra.email}`} className="break-all transition-colors hover:text-[#D4A24C]">
                  {royalSofra.email}
                </a>
              </p>
              <p className="flex items-start gap-3">
                <FiMapPin size={16} className="mt-0.5 shrink-0 text-[#D4A24C]" />
                <span className="max-w-xs leading-6">{royalSofra.address}</span>
              </p>
            </address>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center gap-3 border-t border-[#FAF7F2]/10 pt-6 text-xs text-[#FAF7F2]/55 md:flex-row md:justify-between">
          <p>
            © {new Date().getFullYear()} {royalSofra.name}. All rights reserved.
          </p>
          <p>
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
          <div className="flex gap-6">
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