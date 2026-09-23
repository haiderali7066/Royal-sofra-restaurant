'use client'

import { useRouter } from 'next/navigation'
import { Bell, LogOut, Search } from 'lucide-react'
import { initials } from '@/lib/format'
import { authClient } from '@/lib/auth-client'
import { useAdminOrderAlert } from '@/components/admin-order-alert'

export function AdminTopbar({ adminName }: { adminName: string }) {
  const router = useRouter()
  const { count, dismiss } = useAdminOrderAlert()

  const handleSignOut = async () => {
    await authClient.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <header className="flex h-20 items-center justify-between gap-4 border-b border-border bg-background px-5 lg:px-8">
      <p className="text-sm text-muted-foreground">
        Welcome back, <span className="font-semibold text-foreground">{adminName}</span>
      </p>
      <div className="flex items-center gap-4">
        <label className="hidden items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground md:flex">
          <Search size={15} />
          <input placeholder="Search orders, items, customers" className="w-56 bg-transparent outline-none" />
        </label>
        <button
          aria-label={count > 0 ? `${count} new orders` : 'Notifications'}
          onClick={() => {
            dismiss()
            router.push('/admin/orders')
          }}
          className="relative rounded-full p-2.5 text-muted-foreground hover:bg-secondary"
        >
          <Bell size={19} className={count > 0 ? 'animate-bounce text-primary' : undefined} />
          {count > 0 && (
            <span className="absolute right-1.5 top-1.5 grid size-4 place-items-center rounded-full bg-destructive text-[10px] font-bold text-primary-foreground">
              {count > 9 ? '9+' : count}
            </span>
          )}
        </button>
        <span className="grid size-9 place-items-center rounded-full bg-secondary text-sm font-semibold text-primary">{initials(adminName)}</span>
        <button aria-label="Sign out" onClick={handleSignOut} className="rounded-full p-2.5 text-muted-foreground hover:bg-secondary hover:text-foreground">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  )
}
