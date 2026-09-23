import { NextRequest, NextResponse } from 'next/server'
import { newsletterSubscribersCollection } from '@/lib/collections'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }

  const subscribers = await newsletterSubscribersCollection()
  await subscribers.updateOne(
    { email },
    { $setOnInsert: { email, subscribedAt: new Date().toISOString() } },
    { upsert: true },
  )

  return NextResponse.json({ ok: true })
}
