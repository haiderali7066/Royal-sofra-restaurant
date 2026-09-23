import { NextRequest, NextResponse } from 'next/server'
import { reviewsCollection } from '@/lib/collections'
import { getApiUser } from '@/lib/session'
import type { Review } from '@/lib/types'

export async function GET() {
  const reviews = await reviewsCollection()
  const results = await reviews.find({}).sort({ date: -1 }).toArray()
  return NextResponse.json({ reviews: results })
}

export async function POST(request: NextRequest) {
  const user = await getApiUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  if (!body?.itemName || !body?.rating || !body?.comment) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const rating = Number(body.rating)
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Invalid rating' }, { status: 400 })
  }

  const review: Review = {
    id: `rev-${Date.now()}`,
    customerName: user.name || user.email,
    itemName: body.itemName,
    rating: rating as 1 | 2 | 3 | 4 | 5,
    comment: body.comment,
    date: new Date().toISOString().slice(0, 10),
    status: 'Pending',
  }

  const reviews = await reviewsCollection()
  await reviews.insertOne(review)
  return NextResponse.json({ review }, { status: 201 })
}
