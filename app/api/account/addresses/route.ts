import { NextRequest, NextResponse } from 'next/server'
import { addressesCollection } from '@/lib/collections'
import { getApiUser } from '@/lib/session'
import type { Address } from '@/lib/types'

export async function GET() {
  const user = await getApiUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const addresses = await addressesCollection()
  const results = await addresses.find({ userId: user.id }).sort({ isDefault: -1, createdAt: -1 }).toArray()
  return NextResponse.json({ addresses: results })
}

export async function POST(request: NextRequest) {
  const user = await getApiUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  if (!body?.label || !body?.line1 || !body?.city || !body?.phone) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const addresses = await addressesCollection()
  const existingCount = await addresses.countDocuments({ userId: user.id })

  // First saved address becomes the default automatically.
  if (body.isDefault || existingCount === 0) {
    await addresses.updateMany({ userId: user.id }, { $set: { isDefault: false } })
  }

  const address: Address = {
    id: `addr-${Date.now()}`,
    userId: user.id,
    label: String(body.label),
    line1: String(body.line1),
    city: String(body.city),
    phone: String(body.phone),
    isDefault: Boolean(body.isDefault) || existingCount === 0,
    createdAt: new Date().toISOString(),
  }

  await addresses.insertOne(address)
  return NextResponse.json({ address }, { status: 201 })
}
