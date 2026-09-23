import { NextRequest, NextResponse } from 'next/server'
import { settingsCollection } from '@/lib/collections'
import { getApiAdmin } from '@/lib/session'
import { getSiteSettings } from '@/lib/settings'

// GET is intentionally public: checkout needs the delivery fee, tax and
// enabled payment methods before an order is placed.
export async function GET() {
  const settings = await getSiteSettings()
  return NextResponse.json({ settings })
}

export async function PATCH(request: NextRequest) {
  const admin = await getApiAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const numericFields = ['deliveryFee', 'freeDeliveryThreshold', 'taxPercent', 'minOrderAmount'] as const
  const booleanFields = ['codEnabled', 'gopayfastEnabled'] as const

  const update: Partial<Record<string, number | boolean>> = {}
  for (const field of numericFields) {
    if (field in body) {
      const value = Number(body[field])
      if (!Number.isFinite(value) || value < 0) {
        return NextResponse.json({ error: `Invalid value for ${field}` }, { status: 400 })
      }
      update[field] = value
    }
  }
  for (const field of booleanFields) {
    if (field in body) update[field] = Boolean(body[field])
  }

  const current = await getSiteSettings()
  const merged = { ...current, ...update }
  if (!merged.codEnabled && !merged.gopayfastEnabled) {
    return NextResponse.json({ error: 'At least one payment method must remain enabled' }, { status: 400 })
  }

  const settings = await settingsCollection()
  const result = await settings.findOneAndUpdate(
    { id: 'site' },
    { $set: { ...merged, id: 'site' } },
    { upsert: true, returnDocument: 'after' },
  )

  return NextResponse.json({ settings: result })
}
