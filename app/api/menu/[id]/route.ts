import { NextRequest, NextResponse } from 'next/server'
import { menuItemsCollection } from '@/lib/collections'
import { getApiAdmin } from '@/lib/session'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const menu = await menuItemsCollection()
  const item = await menu.findOne({ $or: [{ id }, { slug: id }] })
  if (!item) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json({ item })
}

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

  const allowedFields = ['name', 'category', 'description', 'price', 'image', 'tag', 'spiceLevel', 'isAvailable', 'isFeatured', 'slug']
  const update: Record<string, unknown> = {}
  for (const field of allowedFields) {
    if (field in body) update[field] = body[field]
  }
  if (update.price !== undefined) update.price = Number(update.price)

  const menu = await menuItemsCollection()
  const result = await menu.findOneAndUpdate({ id }, { $set: update }, { returnDocument: 'after' })
  if (!result) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json({ item: result })
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getApiAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const menu = await menuItemsCollection()
  const result = await menu.deleteOne({ id })
  if (result.deletedCount === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json({ ok: true })
}
