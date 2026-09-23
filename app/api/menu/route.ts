import { NextRequest, NextResponse } from 'next/server'
import { menuItemsCollection } from '@/lib/collections'
import { getApiAdmin } from '@/lib/session'
import type { MenuItem } from '@/lib/types'

export async function GET() {
  const menu = await menuItemsCollection()
  const items = await menu.find({}).toArray()
  return NextResponse.json({ items })
}

export async function POST(request: NextRequest) {
  const admin = await getApiAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  if (!body?.name || !body?.category || !body?.price || !body?.slug) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const menu = await menuItemsCollection()
  const existing = await menu.findOne({ slug: body.slug })
  if (existing) {
    return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })
  }

  const item: MenuItem = {
    id: `itm-${Date.now()}`,
    slug: body.slug,
    name: body.name,
    category: body.category,
    description: body.description || '',
    price: Number(body.price),
    image: body.image || '',
    tag: body.tag || '',
    spiceLevel: body.spiceLevel || 1,
    isAvailable: body.isAvailable ?? true,
    isFeatured: body.isFeatured ?? false,
  }

  await menu.insertOne(item)
  return NextResponse.json({ item }, { status: 201 })
}
