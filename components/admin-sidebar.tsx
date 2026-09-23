'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAdminOrderAlert } from '@/components/admin-order-alert'
import {
  Bell,
  Boxes,
  ChefHat,
  FileText,
  LayoutDashboard,
  ListOrdered,
  MessageSquareText,
  Settings,
  ShieldCheck,
  Tag,
  Users,
  Warehouse,
} from 'lucide-react'

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Orders', icon: ListOrdered },
  { href: '/admin/menu', label: 'Menu items', icon: ChefHat },
  { href: '/admin/categories', label: 'Categories', icon: Boxes },
  { href: '/admin/deals', label: 'Deals & promos', icon: Tag },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/staff', label: 'Staff & roles', icon: ShieldCheck },
  { href: '/admin/blogs', label: 'Blogs', icon: FileText },
  { href: '/admin/reviews', label: 'Reviews', icon: MessageSquareText },
  { href: '/admin/inventory', label: 'Inventory', icon: Warehouse },
  { href: '/admin/reports', label: 'Reports', icon: LayoutDashboard },
  { href: '/admin/notifications', label: 'Notifications', icon: Bell },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { count } = useAdminOrderAlert()

  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-card lg:flex lg:flex-col">
      <div className="flex h-20 items-center gap-3 border-b border-border px-6">
        <span className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground">
          <ChefHat size={17} />
        </span>
        <div>
          <p className="font-serif text-lg leading-none">Royal Sofra</p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Admin panel</p>
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
              <span className="flex-1">{link.label}</span>
              {link.href === '/admin/orders' && count > 0 && (
                <span className="grid size-5 place-items-center rounded-full bg-destructive text-[10px] font-bold text-primary-foreground">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-border p-4">
        <Link href="/" className="text-xs font-semibold text-muted-foreground hover:text-primary">
          &larr; Back to website
        </Link>
      </div>
    </aside>
  )
}
