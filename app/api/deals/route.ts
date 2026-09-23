import { NextRequest, NextResponse } from 'next/server'
import { dealsCollection } from '@/lib/collections'
import { getApiAdmin } from '@/lib/session'
import type { Deal } from '@/lib/types'

export async function GET() {
  const deals = await dealsCollection()
  const results = await deals.find({}).toArray()
  return NextResponse.json({ deals: results })
}

export async function POST(request: NextRequest) {
  const admin = await getApiAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  if (!body?.title || !body?.code || body?.discountPercent === undefined) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const deals = await dealsCollection()
  const existing = await deals.findOne({ code: body.code })
  if (existing) {
    return NextResponse.json({ error: 'Deal code already exists' }, { status: 409 })
  }

  const deal: Deal = {
    id: `deal-${Date.now()}`,
    title: body.title,
    description: body.description || '',
    discountPercent: Number(body.discountPercent),
    code: body.code,
    active: body.active ?? true,
    expiresOn: body.expiresOn || new Date().toISOString().slice(0, 10),
  }

  await deals.insertOne(deal)
  return NextResponse.json({ deal }, { status: 201 })
}
