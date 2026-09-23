import { Check, X } from 'lucide-react'
import type { OrderStatus } from '@/lib/types'

const pipeline: OrderStatus[] = ['Pending', 'Confirmed', 'Preparing', 'Out for delivery', 'Delivered']

export function AdminOrderTimeline({ status }: { status: OrderStatus }) {
  if (status === 'Cancelled') {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-destructive text-primary-foreground">
          <X size={16} />
        </span>
        <p className="text-sm font-semibold text-destructive">This order was cancelled.</p>
      </div>
    )
  }

  const currentIndex = pipeline.indexOf(status)

  return (
    <ol className="flex flex-col gap-0">
      {pipeline.map((step, index) => {
        const done = index <= currentIndex
        const isLast = index === pipeline.length - 1
        return (
          <li key={step} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={`grid size-8 shrink-0 place-items-center rounded-full text-xs font-bold ${
                  done ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                }`}
              >
                {done ? <Check size={15} /> : index + 1}
              </span>
              {!isLast && <span className={`w-px flex-1 ${index < currentIndex ? 'bg-primary' : 'bg-border'}`} style={{ minHeight: 24 }} />}
            </div>
            <div className={`pb-6 ${isLast ? 'pb-0' : ''}`}>
              <p className={`text-sm font-medium ${done ? 'text-foreground' : 'text-muted-foreground'}`}>{step}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
