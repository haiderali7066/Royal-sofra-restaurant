'use client'

import { useMemo, useState } from 'react'
import useSWR from 'swr'
import { Plus, Star, X } from 'lucide-react'
import { AccountPageHeading } from '@/components/account-page-heading'
import { useSession } from '@/lib/auth-client'
import { fetcher, mutate as mutateApi } from '@/lib/fetcher'
import { statusTone } from '@/lib/format'
import type { Order, Review } from '@/lib/types'

export default function ReviewsPage() {
  const { data: session } = useSession()
  const { data: reviewsData, mutate: refetchReviews } = useSWR<{ reviews: Review[] }>('/api/reviews', fetcher)
  const { data: ordersData } = useSWR<{ orders: Order[] }>('/api/orders', fetcher)
  const [showForm, setShowForm] = useState(false)
  const [itemName, setItemName] = useState('')
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const identity = session?.user?.name || session?.user?.email || ''
  const myReviews = (reviewsData?.reviews ?? []).filter((review) => review.customerName === identity)

  const orderedItems = useMemo(() => {
    const names = new Set<string>()
    for (const order of ordersData?.orders ?? []) {
      for (const item of order.items) names.add(item.name)
    }
    return Array.from(names)
  }, [ordersData])

  const submitReview = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSaving(true)
    try {
      await mutateApi('/api/reviews', 'POST', { itemName, rating, comment })
      await refetchReviews()
      setItemName('')
      setRating(5)
      setComment('')
      setShowForm(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <AccountPageHeading
        title="Reviews & Ratings"
        description="Share your thoughts on dishes you've ordered."
        action={
          orderedItems.length > 0 ? (
            <button
              onClick={() => setShowForm((value) => !value)}
              className="inline-flex items-center gap-2 rounded-full bg-cta px-5 py-2.5 text-sm font-semibold text-cta-foreground"
            >
              {showForm ? <X size={16} /> : <Plus size={16} />} {showForm ? 'Cancel' : 'Write a review'}
            </button>
          ) : undefined
        }
      />

      {showForm && (
        <form onSubmit={submitReview} className="space-y-4 rounded-2xl border border-border bg-card p-6">
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Dish</label>
            <select
              required
              value={itemName}
              onChange={(event) => setItemName(event.target.value)}
              className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
            >
              <option value="" disabled>
                Select a dish you&apos;ve ordered
              </option>
              {orderedItems.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rating</label>
            <div className="mt-1.5 flex gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-label={`${value} star${value > 1 ? 's' : ''}`}
                  onClick={() => setRating(value)}
                  className="p-0.5"
                >
                  <Star size={22} className={value <= rating ? 'fill-primary text-primary' : 'text-muted-foreground'} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your review</label>
            <textarea
              required
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              rows={3}
              placeholder="Tell us what you thought"
              className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-cta px-6 py-2.5 text-sm font-semibold text-cta-foreground disabled:opacity-60"
          >
            {saving ? 'Submitting…' : 'Submit review'}
          </button>
        </form>
      )}

      <div className="space-y-3">
        {myReviews.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            You haven&apos;t written any reviews yet.
          </p>
        )}
        {myReviews.map((review) => (
          <div key={review.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-serif text-lg">{review.itemName}</p>
                <div className="mt-1 flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Star
                      key={value}
                      size={14}
                      className={value <= review.rating ? 'fill-primary text-primary' : 'text-muted-foreground'}
                    />
                  ))}
                </div>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(review.status)}`}>{review.status}</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{review.comment}</p>
            <p className="mt-2 text-xs text-muted-foreground">{new Date(review.date).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
