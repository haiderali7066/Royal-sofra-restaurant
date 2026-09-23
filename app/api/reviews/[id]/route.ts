import { NextRequest, NextResponse } from 'next/server'
import { reviewsCollection } from '@/lib/collections'
import { getApiAdmin } from '@/lib/session'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getApiAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json().catch(() => null)
  const status = body?.status
  if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const reviews = await reviewsCollection()
  const result = await reviews.findOneAndUpdate({ id }, { $set: { status } }, { returnDocument: 'after' })
  if (!result) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json({ review: result })
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getApiAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const reviews = await reviewsCollection()
  await reviews.deleteOne({ id })
  return NextResponse.json({ ok: true })
}
