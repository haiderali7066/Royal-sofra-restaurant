'use client'

import useSWR from 'swr'
import { Check, Star, X } from 'lucide-react'
import { AdminPageHeading } from '@/components/admin-page-heading'
import { fetcher } from '@/lib/fetcher'
import { statusTone } from '@/lib/format'
import type { Review } from '@/lib/types'

export default function AdminReviewsPage() {
  const { data, mutate } = useSWR<{ reviews: Review[] }>('/api/reviews', fetcher)
  const reviews = data?.reviews ?? []

  const updateStatus = async (id: string, status: 'Approved' | 'Rejected') => {
    await fetch(`/api/reviews/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    await mutate()
  }

  return (
    <>
      <AdminPageHeading title="Reviews" description="Moderate customer reviews before they appear publicly." />
      {reviews.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No reviews yet.
        </p>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div key={review.id} className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-border bg-card p-5">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{review.customerName}</p>
                  <span className="text-xs text-muted-foreground">on {review.itemName}</span>
                </div>
                <div className="mt-1 flex items-center gap-1 text-primary">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} size={14} className={index < review.rating ? 'fill-primary' : 'fill-none text-muted-foreground'} />
                  ))}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
                <p className="mt-2 text-xs text-muted-foreground">{review.date}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusTone(review.status)}`}>{review.status}</span>
                {review.status === 'Pending' && (
                  <>
                    <button
                      aria-label="Approve review"
                      onClick={() => updateStatus(review.id, 'Approved')}
                      className="rounded-full border border-border p-2 text-primary hover:bg-primary/10"
                    >
                      <Check size={15} />
                    </button>
                    <button
                      aria-label="Reject review"
                      onClick={() => updateStatus(review.id, 'Rejected')}
                      className="rounded-full border border-border p-2 text-destructive hover:bg-destructive/10"
                    >
                      <X size={15} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
