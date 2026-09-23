import type { ReactNode } from 'react'
import { AccountMobileNav, AccountSidebar } from '@/components/account-sidebar'
import { requireUser } from '@/lib/session'

export const dynamic = 'force-dynamic'

export default async function AccountLayout({ children }: { children: ReactNode }) {
  const user = await requireUser()
  const name = user.name || user.email
  const email = user.email

  return (
    <section className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-14">
      <AccountMobileNav name={name} email={email} />
      <div className="flex gap-8">
        <AccountSidebar name={name} email={email} />
        <main className="min-w-0 flex-1 space-y-6">{children}</main>
      </div>
    </section>
  )
}
