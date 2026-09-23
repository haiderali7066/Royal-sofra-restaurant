'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import {
  Bell,
  LayoutDashboard,
  ListOrdered,
  LogOut,
  MapPin,
  PackageSearch,
  Settings,
  Star,
  Truck,
  UserRound,
} from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { initials } from '@/lib/format'

const links = [
  { href: '/account', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/account/profile', label: 'My Profile', icon: UserRound },
  { href: '/account/orders', label: 'My Orders', icon: ListOrdered },
  { href: '/account/orders/active', label: 'Active Orders', icon: Truck },
  { href: '/account/tracking', label: 'Order Tracking', icon: PackageSearch },
  { href: '/account/addresses', label: 'Saved Addresses', icon: MapPin },
  { href: '/account/reviews', label: 'Reviews & Ratings', icon: Star },
  { href: '/account/notifications', label: 'Notifications', icon: Bell },
  { href: '/account/settings', label: 'Settings', icon: Settings },
]

export function AccountSidebar({ name, email }: { name: string; email: string }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    await authClient.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <aside className="hidden w-64 shrink-0 rounded-2xl border border-border bg-card lg:flex lg:flex-col">
      <div className="flex items-center gap-3 border-b border-border px-5 py-5">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-sm font-semibold text-primary">
          {initials(name || email)}
        </span>
        <div className="min-w-0">
          <p className="truncate font-serif text-base leading-tight">{name}</p>
          <p className="truncate text-xs text-muted-foreground">{email}</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {links.map((link) => {
          const active = pathname === link.href
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <Icon size={17} />
              {link.label}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-border p-3">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </aside>
  )
}

export function AccountMobileNav({ name, email }: { name: string; email: string }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    await authClient.signOut()
    router.push('/')
    router.refresh()
  }

  const current = links.find((link) => link.href === pathname)

  return (
    <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3 lg:hidden">
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wider text-primary">{current?.label ?? 'Dashboard'}</p>
        <p className="truncate text-sm text-muted-foreground">{name}</p>
      </div>
      <select
        value={pathname}
        onChange={(event) => router.push(event.target.value)}
        aria-label="Account section"
        className="rounded-xl border border-input bg-background px-3 py-2 text-sm"
      >
        {links.map((link) => (
          <option key={link.href} value={link.href}>
            {link.label}
          </option>
        ))}
      </select>
      <button
        aria-label="Logout"
        onClick={handleSignOut}
        className="shrink-0 rounded-full p-2.5 text-destructive hover:bg-destructive/10"
      >
        <LogOut size={18} />
      </button>
    </div>
  )
}
