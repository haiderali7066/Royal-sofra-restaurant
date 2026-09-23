'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { MapPin, Plus, Star, Trash2, X } from 'lucide-react'
import { AccountPageHeading } from '@/components/account-page-heading'
import { UseMyLocationButton } from '@/components/use-my-location-button'
import { fetcher, mutate as mutateApi } from '@/lib/fetcher'
import type { Address } from '@/lib/types'

const emptyForm = { label: '', line1: '', city: '', phone: '' }

export default function SavedAddressesPage() {
  const { data, mutate } = useSWR<{ addresses: Address[] }>('/api/account/addresses', fetcher)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const addresses = data?.addresses ?? []

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSaving(true)
    try {
      await mutateApi('/api/account/addresses', 'POST', form)
      await mutate()
      setForm(emptyForm)
      setShowForm(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save address')
    } finally {
      setSaving(false)
    }
  }

  const makeDefault = async (address: Address) => {
    await mutateApi(`/api/account/addresses/${address.id}`, 'PATCH', { isDefault: true })
    await mutate()
  }

  const removeAddress = async (address: Address) => {
    await mutateApi(`/api/account/addresses/${address.id}`, 'DELETE')
    await mutate()
  }

  return (
    <div className="space-y-6">
      <AccountPageHeading
        title="Saved Addresses"
        description="Manage the delivery addresses on your account."
        action={
          <button
            onClick={() => setShowForm((value) => !value)}
            className="inline-flex items-center gap-2 rounded-full bg-cta px-5 py-2.5 text-sm font-semibold text-cta-foreground"
          >
            {showForm ? <X size={16} /> : <Plus size={16} />} {showForm ? 'Cancel' : 'Add address'}
          </button>
        }
      />

      {showForm && (
        <form onSubmit={handleCreate} className="grid gap-4 rounded-2xl border border-border bg-card p-6 sm:grid-cols-2">
          {error && <p className="col-span-full text-sm text-destructive">{error}</p>}
          <input
            required
            placeholder="Label, e.g. Home"
            value={form.label}
            onChange={(event) => setForm({ ...form, label: event.target.value })}
            className="rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
          />
          <input
            required
            placeholder="Phone number"
            value={form.phone}
            onChange={(event) => setForm({ ...form, phone: event.target.value })}
            className="rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
          />
          <div className="col-span-full">
            <input
              required
              placeholder="Street address"
              value={form.line1}
              onChange={(event) => setForm({ ...form, line1: event.target.value })}
              className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
            />
            <UseMyLocationButton
              className="mt-2"
              onResolved={({ address, city }) =>
                setForm((current) => ({
                  ...current,
                  line1: address || current.line1,
                  city: city || current.city,
                }))
              }
            />
          </div>
          <input
            required
            placeholder="City"
            value={form.city}
            onChange={(event) => setForm({ ...form, city: event.target.value })}
            className="col-span-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm sm:col-span-1"
          />
          <button
            type="submit"
            disabled={saving}
            className="col-span-full rounded-full bg-cta py-2.5 text-sm font-semibold text-cta-foreground disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save address'}
          </button>
        </form>
      )}

      {addresses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center">
          <MapPin className="mx-auto text-muted-foreground" />
          <p className="mt-4 font-serif text-xl">You haven&apos;t saved any addresses yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <div key={address.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-serif text-lg leading-tight">{address.label}</p>
                  {address.isDefault && (
                    <span className="mt-1 inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                      Default
                    </span>
                  )}
                </div>
                <button
                  aria-label="Delete address"
                  onClick={() => removeAddress(address)}
                  className="rounded-full border border-border p-2 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 size={15} />
                </button>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{address.line1}</p>
              <p className="text-sm text-muted-foreground">{address.city}</p>
              <p className="mt-1 text-sm text-muted-foreground">{address.phone}</p>
              {!address.isDefault && (
                <button
                  onClick={() => makeDefault(address)}
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary"
                >
                  <Star size={13} /> Set as default
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
