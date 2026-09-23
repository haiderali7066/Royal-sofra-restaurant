import { NextRequest, NextResponse } from 'next/server'
import { dealsCollection } from '@/lib/collections'
import { getApiAdmin } from '@/lib/session'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getApiAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const allowedFields = ['title', 'description', 'discountPercent', 'code', 'active', 'expiresOn']
  const update: Record<string, unknown> = {}
  for (const field of allowedFields) {
    if (field in body) update[field] = body[field]
  }
  if (update.discountPercent !== undefined) update.discountPercent = Number(update.discountPercent)

  const deals = await dealsCollection()
  const result = await deals.findOneAndUpdate({ id }, { $set: update }, { returnDocument: 'after' })
  if (!result) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json({ deal: result })
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getApiAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const deals = await dealsCollection()
  await deals.deleteOne({ id })
  return NextResponse.json({ ok: true })
}
