import { AdminPageHeading } from '@/components/admin-page-heading'
import { notifications } from '@/lib/mock-data'

export default function AdminNotificationsPage() {
  return (
    <>
      <AdminPageHeading title="Notifications" description="Stay on top of orders, stock alerts and reviews." />
      <div className="divide-y divide-border rounded-2xl border border-border bg-card">
        {notifications.map((notification) => (
          <div key={notification.id} className="flex items-start justify-between gap-4 px-5 py-4">
            <div>
              <p className="font-medium">{notification.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{notification.detail}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {!notification.read && <span className="size-2 rounded-full bg-primary" />}
              <span className="text-xs text-muted-foreground">{notification.time}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
