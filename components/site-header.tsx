'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  BookOpen,
  Info,
  LayoutGrid,
  Loader2,
  LocateFixed,
  MapPin,
  PackageSearch,
  Phone,
  PhoneCall,
  ShieldCheck,
  ShoppingCart,
  Store,
  User,
  X,
} from 'lucide-react'
import { brand } from '@/lib/mock-data'
import { useCart } from '@/components/cart-context'
import { authClient, useSession } from '@/lib/auth-client'

export function SiteHeader() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [deliveryMode, setDeliveryMode] = useState<'delivery' | 'pickup'>('delivery')
  const [locationText, setLocationText] = useState('Get current location')
  const [locating, setLocating] = useState(false)
  const { count, openDrawer } = useCart()
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? 'hidden' : 'unset'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isSidebarOpen])

  const handleSignOut = async () => {
    await authClient.signOut()
    setIsSidebarOpen(false)
    router.push('/')
    router.refresh()
  }

  const handleGetLocation = () => {
    if (!('geolocation' in navigator)) {
      setLocationText('Location not supported')
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          const res = await fetch(`/api/geocode/reverse?lat=${latitude}&lon=${longitude}`)
          const data = await res.json()
          if (res.ok && (data.city || data.address)) {
            setLocationText([data.address, data.city].filter(Boolean).join(', '))
          } else {
            setLocationText('Could not find location')
          }
        } catch {
          setLocationText('Could not find location')
        } finally {
          setLocating(false)
        }
      },
      () => {
        setLocating(false)
        setLocationText('Location access denied')
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  const navLinks = [
    { label: 'Explore Menu', href: '/menu', icon: LayoutGrid },
    { label: 'About Us', href: '/about', icon: Info },
    { label: 'Contact Us', href: '/contact', icon: PhoneCall },
    { label: 'Track Order', href: '/track-order', icon: PackageSearch },
  ]

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background shadow-sm">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex shrink-0 items-center gap-3 md:gap-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="group flex flex-col gap-1.5 rounded-full p-2 transition-colors hover:bg-secondary focus:outline-none"
                aria-label="Open menu"
              >
                <span className="h-[2px] w-6 bg-foreground transition-all group-hover:w-7 group-hover:bg-primary" />
                <span className="h-[2px] w-5 bg-foreground transition-all group-hover:w-7 group-hover:bg-primary" />
                <span className="h-[2px] w-4 bg-foreground transition-all group-hover:w-7 group-hover:bg-primary" />
              </button>

              <Link href="/" className="flex items-center gap-2.5">
                <div className="relative size-10 shrink-0 overflow-hidden rounded-full border border-border bg-secondary shadow-sm md:size-11">
                  <Image src="/logo-royal-sofra.png" alt={`${brand.name} logo`} fill className="object-cover" />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-xl font-black tracking-tight text-foreground md:text-2xl">{brand.name}</span>
                  <span className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-primary">Premium Cuisine</span>
                </div>
              </Link>
            </div>

            <div className="mx-4 hidden flex-1 items-center justify-center gap-4 lg:flex">
              <div className="flex shrink-0 rounded-full border border-border bg-secondary p-1">
                <button
                  onClick={() => setDeliveryMode('delivery')}
                  className={`flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                    deliveryMode === 'delivery' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <MapPin size={15} /> DELIVERY
                </button>
                <button
                  onClick={() => setDeliveryMode('pickup')}
                  className={`flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                    deliveryMode === 'pickup' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Store size={15} /> PICK-UP
                </button>
              </div>

              <button
                onClick={handleGetLocation}
                disabled={locating}
                className="flex max-w-[250px] items-center gap-2 rounded-full border border-border bg-background px-5 py-2 shadow-sm transition-colors hover:border-primary hover:bg-secondary disabled:opacity-70"
              >
                {locating ? (
                  <Loader2 size={16} className="shrink-0 animate-spin text-primary" />
                ) : (
                  <LocateFixed size={16} className="shrink-0 text-primary" />
                )}
                <span className="truncate text-sm font-bold text-foreground">{locationText}</span>
              </button>
            </div>

            <div className="hidden shrink-0 items-center gap-3 lg:flex">
              <Link
                href="/menu"
                className="flex items-center gap-2 rounded-full border border-transparent px-5 py-2.5 text-sm font-bold text-foreground transition-all hover:border-border hover:bg-secondary"
              >
                <LayoutGrid size={18} className="text-primary" />
                Menu
              </Link>

              {session?.user ? (
                <Link
                  href="/account"
                  className="flex items-center gap-2 rounded-full border border-primary px-6 py-2.5 text-sm font-bold text-foreground shadow-sm transition-colors hover:bg-secondary"
                >
                  <User size={18} className="text-primary" />
                  ACCOUNT
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 rounded-full border border-primary px-6 py-2.5 text-sm font-bold text-foreground shadow-sm transition-colors hover:bg-secondary"
                >
                  <User size={18} className="text-primary" />
                  LOGIN
                </Link>
              )}

              <button
                onClick={openDrawer}
                className="relative flex items-center gap-2 rounded-full bg-cta px-6 py-2.5 text-sm font-bold text-cta-foreground shadow-sm transition-colors hover:bg-[#241a12]"
              >
                <ShoppingCart size={18} />
                CART
                <span className="absolute -right-1.5 -top-1.5 flex size-[22px] items-center justify-center rounded-full border-2 border-background bg-primary text-[10px] font-bold text-primary-foreground">
                  {count}
                </span>
              </button>
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={openDrawer}
                className="relative flex items-center gap-1.5 rounded-full bg-cta px-4 py-2.5 text-xs font-bold text-cta-foreground shadow-sm transition-colors hover:bg-[#241a12]"
                aria-label="Open cart"
              >
                <ShoppingCart size={16} />
                CART
                <span className="absolute -right-1.5 -top-1.5 flex size-[18px] items-center justify-center rounded-full border-2 border-background bg-primary text-[9px] font-bold text-primary-foreground">
                  {count}
                </span>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2 sm:flex-row lg:hidden">
            <div className="flex w-full rounded-full border border-border bg-secondary p-1 sm:w-auto">
              <button
                onClick={() => setDeliveryMode('delivery')}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2 text-[11px] font-bold transition-all sm:flex-none ${
                  deliveryMode === 'delivery' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground'
                }`}
              >
                <MapPin size={14} /> DELIVERY
              </button>
              <button
                onClick={() => setDeliveryMode('pickup')}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2 text-[11px] font-bold transition-all sm:flex-none ${
                  deliveryMode === 'pickup' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground'
                }`}
              >
                <Store size={14} /> PICK-UP
              </button>
            </div>

            <button
              onClick={handleGetLocation}
              disabled={locating}
              className="flex flex-1 items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-2 shadow-sm transition-colors hover:bg-secondary disabled:opacity-70"
            >
              {locating ? (
                <Loader2 size={14} className="shrink-0 animate-spin text-primary" />
              ) : (
                <LocateFixed size={14} className="shrink-0 text-primary" />
              )}
              <span className="truncate text-xs font-bold text-foreground">{locationText}</span>
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm transition-opacity duration-300 ${
          isSidebarOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <aside
        className={`fixed left-0 top-0 z-50 flex h-[100dvh] w-[85%] max-w-[340px] transform flex-col border-r border-border bg-cream shadow-2xl transition-transform duration-300 ease-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="absolute right-4 top-4 z-10 rounded-full bg-secondary p-2 text-foreground transition-colors hover:bg-border"
          aria-label="Close menu"
        >
          <X size={18} />
        </button>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6 flex items-center gap-4 pt-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-border bg-secondary text-primary">
              <User size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-muted-foreground">
                {session?.user ? `Welcome back` : `Welcome to ${brand.name}`}
              </span>
              <span className="text-base font-black text-foreground">{session?.user?.name || 'Taste Royalty'}</span>
            </div>
          </div>

          <div className="mb-6 flex gap-3">
            {session?.user ? (
              <button
                onClick={handleSignOut}
                className="flex-1 rounded-full bg-cta py-3 text-xs font-bold tracking-wide text-cta-foreground shadow-sm transition-colors hover:bg-[#241a12]"
              >
                SIGN OUT
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsSidebarOpen(false)}
                className="flex-1 rounded-full bg-cta py-3 text-center text-xs font-bold tracking-wide text-cta-foreground shadow-sm transition-colors hover:bg-[#241a12]"
              >
                LOGIN
              </Link>
            )}
            <button
              onClick={() => {
                setIsSidebarOpen(false)
                openDrawer()
              }}
              className="relative flex size-12 items-center justify-center rounded-full border border-border bg-secondary text-foreground transition-colors hover:bg-border"
              aria-label="Open cart"
            >
              <ShoppingCart size={20} />
              <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full border-2 border-cream bg-ink text-[10px] font-bold text-ink-foreground">
                {count}
              </span>
            </button>
          </div>

          <hr className="mb-6 border-border" />

          <nav className="mb-6 flex flex-col space-y-2">
            {navLinks.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsSidebarOpen(false)}
                className="flex items-center gap-3 rounded-2xl px-3 py-3 font-bold text-foreground transition-colors hover:bg-secondary hover:text-primary"
              >
                <Icon size={20} className="text-primary" />
                {label}
              </Link>
            ))}
            {session?.user && (
              <Link
                href="/account"
                onClick={() => setIsSidebarOpen(false)}
                className="flex items-center gap-3 rounded-2xl px-3 py-3 font-bold text-foreground transition-colors hover:bg-secondary hover:text-primary"
              >
                <User size={20} className="text-primary" />
                My Account
              </Link>
            )}
          </nav>

          <hr className="mb-6 border-border" />

          <nav className="flex flex-col space-y-2">
            <Link
              href="/blogs"
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center gap-3 rounded-full px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <BookOpen size={16} />
              Blog & Stories
            </Link>
            <Link
              href="/privacy"
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center gap-3 rounded-full px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <ShieldCheck size={16} />
              Privacy Policy
            </Link>
          </nav>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-border bg-ink p-5">
          <div className="flex flex-col">
            <span className="text-sm font-extrabold uppercase tracking-wide text-primary">Royal Hotline</span>
            <span className="text-[10px] font-medium text-ink-foreground/80">Every meal served like royalty</span>
          </div>
          <a
            href={brand.phoneHref}
            className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform hover:scale-105"
            aria-label="Call hotline"
          >
            <Phone size={20} />
          </a>
        </div>
      </aside>
    </>
  )
}
