import { NextRequest, NextResponse } from 'next/server'
import { addressesCollection } from '@/lib/collections'
import { getApiUser } from '@/lib/session'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getApiUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const addresses = await addressesCollection()
  const existing = await addresses.findOne({ id, userId: user.id })
  if (!existing) {
    return NextResponse.json({ error: 'Address not found' }, { status: 404 })
  }

  if (body.isDefault === true) {
    await addresses.updateMany({ userId: user.id }, { $set: { isDefault: false } })
  }

  const update: Record<string, unknown> = {}
  for (const key of ['label', 'line1', 'city', 'phone', 'isDefault'] as const) {
    if (body[key] !== undefined) update[key] = body[key]
  }

  await addresses.updateOne({ id, userId: user.id }, { $set: update })
  const updated = await addresses.findOne({ id, userId: user.id })
  return NextResponse.json({ address: updated })
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getApiUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const addresses = await addressesCollection()
  const existing = await addresses.findOne({ id, userId: user.id })
  if (!existing) {
    return NextResponse.json({ error: 'Address not found' }, { status: 404 })
  }

  await addresses.deleteOne({ id, userId: user.id })

  if (existing.isDefault) {
    const next = await addresses.findOne({ userId: user.id }, { sort: { createdAt: -1 } })
    if (next) {
      await addresses.updateOne({ id: next.id }, { $set: { isDefault: true } })
    }
  }

  return NextResponse.json({ ok: true })
}
