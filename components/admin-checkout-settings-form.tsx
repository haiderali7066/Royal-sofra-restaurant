'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { SiteSettings } from '@/lib/types'

export function AdminCheckoutSettingsForm({ initialSettings }: { initialSettings: SiteSettings }) {
  const router = useRouter()
  const [settings, setSettings] = useState(initialSettings)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const bothDisabled = !settings.codEnabled && !settings.gopayfastEnabled

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save settings')
      setSettings(data.settings)
      setSaved(true)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mt-4 space-y-5">
      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField
          label="Delivery fee (Rs.)"
          value={settings.deliveryFee}
          onChange={(v) => setSettings({ ...settings, deliveryFee: v })}
        />
        <NumberField
          label="Free delivery over (Rs.)"
          value={settings.freeDeliveryThreshold}
          onChange={(v) => setSettings({ ...settings, freeDeliveryThreshold: v })}
        />
        <NumberField label="Tax (%)" value={settings.taxPercent} onChange={(v) => setSettings({ ...settings, taxPercent: v })} />
        <NumberField
          label="Minimum order (Rs.)"
          value={settings.minOrderAmount}
          onChange={(v) => setSettings({ ...settings, minOrderAmount: v })}
        />
      </div>

      <div className="flex flex-col gap-3">
        <ToggleRow
          label="Cash on delivery"
          description="Let customers pay with cash when their order arrives."
          checked={settings.codEnabled}
          onChange={(v) => setSettings({ ...settings, codEnabled: v })}
        />
        <ToggleRow
          label="GoPayfast online payment"
          description="Card, EasyPaisa and JazzCash payments via gopayfast.com."
          checked={settings.gopayfastEnabled}
          onChange={(v) => setSettings({ ...settings, gopayfastEnabled: v })}
        />
        {bothDisabled && <p className="text-sm text-destructive">At least one payment method must stay enabled.</p>}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving || bothDisabled}
          className="rounded-full bg-cta px-5 py-2.5 text-sm font-semibold text-cta-foreground disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save checkout settings'}
        </button>
        {saved && !saving && <span className="text-sm text-primary">Saved</span>}
      </div>
    </div>
  )
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-foreground">{label}</span>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
    </label>
  )
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background px-4 py-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="size-4 accent-primary" />
    </label>
  )
}
