import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Mail, MapPin, Phone } from 'lucide-react'
import { AdminPageHeading } from '@/components/admin-page-heading'
import { AdminOrderStatusForm } from '@/components/admin-order-status-form'
import { AdminOrderTimeline } from '@/components/admin-order-timeline'
import { ordersCollection } from '@/lib/collections'
import { money, orderStatusTone, paymentStatusTone } from '@/lib/format'

export const dynamic = 'force-dynamic'

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const ordersCol = await ordersCollection()
  const order = await ordersCol.findOne({ id })
  if (!order) notFound()

  const itemsSubtotal = order.items.reduce((sum, item) => sum + item.price * item.qty, 0)
  const extras = order.total - itemsSubtotal

  return (
    <>
      <Link href="/admin/orders" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft size={14} /> Back to orders
      </Link>
      <AdminPageHeading
        title={`Order ${order.id}`}
        description={`Placed on ${new Date(order.placedAt).toLocaleString('en-PK')} via ${order.paymentMethod}.`}
        action={
          <div className="flex flex-wrap gap-2">
            <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${orderStatusTone(order.status)}`}>{order.status}</span>
            <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${paymentStatusTone(order.paymentStatus)}`}>
              Payment: {order.paymentStatus}
            </span>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-serif text-xl">Items</h2>
            <div className="mt-4 divide-y divide-border">
              {order.items.map((item, index) => (
                <div key={`${item.name}-${index}`} className="flex items-center justify-between py-3 text-sm">
                  <span>
                    <span className="mr-2 rounded-md bg-secondary px-1.5 py-0.5 font-mono text-xs">{item.qty}&times;</span>
                    {item.name}
                  </span>
                  <span className="font-medium">{money(item.price * item.qty)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-1.5 border-t border-border pt-4 text-sm">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Items subtotal</span>
                <span>{money(itemsSubtotal)}</span>
              </div>
              {extras !== 0 && (
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Delivery &amp; tax</span>
                  <span>{money(extras)}</span>
                </div>
              )}
              <div className="flex items-center justify-between border-t border-border pt-2 font-semibold">
                <span>Total</span>
                <span className="text-primary">{money(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-serif text-xl">Fulfillment timeline</h2>
            <div className="mt-4">
              <AdminOrderTimeline status={order.status} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-serif text-xl">Customer</h2>
            <p className="mt-3 text-sm font-medium">{order.customerName}</p>
            <div className="mt-3 space-y-2 text-sm">
              <a href={`mailto:${order.customerEmail}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                <Mail size={14} /> {order.customerEmail}
              </a>
              <a href={`tel:${order.customerPhone}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                <Phone size={14} /> {order.customerPhone}
              </a>
              <p className="flex items-start gap-2 text-muted-foreground">
                <MapPin size={14} className="mt-0.5 shrink-0" /> {order.address}
              </p>
            </div>
          </div>

          <AdminOrderStatusForm orderId={order.id} currentStatus={order.status} currentPaymentStatus={order.paymentStatus} />
        </div>
      </div>
    </>
  )
}
