'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { Plus, X } from 'lucide-react'
import { AdminPageHeading } from '@/components/admin-page-heading'
import { fetcher } from '@/lib/fetcher'
import { statusTone } from '@/lib/format'
import type { Deal } from '@/lib/types'

const emptyForm = { title: '', description: '', code: '', discountPercent: 10, expiresOn: '', active: true }

export default function AdminDealsPage() {
  const { data, mutate } = useSWR<{ deals: Deal[] }>('/api/deals', fetcher)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const deals = data?.deals ?? []

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSaving(true)
    try {
      const res = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const resData = await res.json()
      if (!res.ok) throw new Error(resData.error || 'Failed to create deal')
      await mutate()
      setForm(emptyForm)
      setShowForm(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create deal')
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (deal: Deal) => {
    await fetch(`/api/deals/${deal.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !deal.active }),
    })
    await mutate()
  }

  return (
    <>
      <AdminPageHeading
        title="Deals & promotions"
        description="Create and manage discount codes and seasonal offers."
        action={
          <button
            onClick={() => setShowForm((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full bg-cta px-5 py-2.5 text-sm font-semibold text-cta-foreground"
          >
            {showForm ? <X size={16} /> : <Plus size={16} />} {showForm ? 'Cancel' : 'New deal'}
          </button>
        }
      />

      {showForm && (
        <form onSubmit={handleCreate} className="grid gap-4 rounded-2xl border border-border bg-card p-6 sm:grid-cols-2">
          {error && <p className="col-span-full text-sm text-destructive">{error}</p>}
          <input
            required
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
          />
          <input
            required
            placeholder="Promo code e.g. FAMILY20"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
            className="rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="col-span-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
          />
          <input
            required
            type="number"
            min={1}
            max={100}
            placeholder="Discount %"
            value={form.discountPercent}
            onChange={(e) => setForm({ ...form, discountPercent: Number(e.target.value) })}
            className="rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
          />
          <input
            required
            type="date"
            value={form.expiresOn}
            onChange={(e) => setForm({ ...form, expiresOn: e.target.value })}
            className="rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
          />
          <button
            type="submit"
            disabled={saving}
            className="col-span-full rounded-full bg-cta py-2.5 text-sm font-semibold text-cta-foreground disabled:opacity-60"
          >
            {saving ? 'Creating...' : 'Create deal'}
          </button>
        </form>
      )}

      {deals.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No deals yet. Create one to get started.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {deals.map((deal) => (
            <div key={deal.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-serif text-lg leading-tight">{deal.title}</h3>
                <button
                  onClick={() => toggleActive(deal)}
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${statusTone(deal.active ? 'Active' : 'Suspended')}`}
                >
                  {deal.active ? 'Active' : 'Inactive'}
                </button>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{deal.description}</p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="rounded-full bg-secondary px-3 py-1 font-mono text-xs">{deal.code}</span>
                <span className="font-semibold text-primary">{deal.discountPercent}% off</span>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Expires {deal.expiresOn}</p>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
