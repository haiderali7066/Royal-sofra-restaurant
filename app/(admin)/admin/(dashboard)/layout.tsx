import { AdminSidebar } from '@/components/admin-sidebar'
import { AdminTopbar } from '@/components/admin-topbar'
import { AdminOrderAlertProvider } from '@/components/admin-order-alert'
import { requireAdmin } from '@/lib/session'

// The entire admin dashboard depends on a live session + database lookups,
// so it must never be statically prerendered.
export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin()

  return (
    <AdminOrderAlertProvider>
      <div className="flex min-h-screen bg-background text-foreground">
        <AdminSidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <AdminTopbar adminName={admin.name || admin.email} />
          <main className="flex-1 space-y-6 px-5 py-8 lg:px-8">{children}</main>
        </div>
      </div>
    </AdminOrderAlertProvider>
  )
}
