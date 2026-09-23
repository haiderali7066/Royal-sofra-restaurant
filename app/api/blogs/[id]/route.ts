import { NextRequest, NextResponse } from 'next/server'
import { blogPostsCollection } from '@/lib/collections'
import { getApiUser, getApiAdmin } from '@/lib/session'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const blogs = await blogPostsCollection()
  const post = await blogs.findOne({ $or: [{ id }, { slug: id }] })
  if (!post) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json({ post })
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getApiUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const blogs = await blogPostsCollection()
  const existing = await blogs.findOne({ id })
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const isOwner = existing.author === (user.name || user.email)
  if (user.role !== 'admin' && !isOwner) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const allowedFields = ['title', 'excerpt', 'content', 'category', 'image']
  const adminOnlyFields = ['published']
  const update: Record<string, unknown> = {}
  for (const field of allowedFields) {
    if (field in body) update[field] = body[field]
  }
  if (user.role === 'admin') {
    for (const field of adminOnlyFields) {
      if (field in body) update[field] = body[field]
    }
  }

  const result = await blogs.findOneAndUpdate({ id }, { $set: update }, { returnDocument: 'after' })
  return NextResponse.json({ post: result })
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getApiUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const blogs = await blogPostsCollection()
  const existing = await blogs.findOne({ id })
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const isOwner = existing.author === (user.name || user.email)
  if (user.role !== 'admin' && !isOwner) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await blogs.deleteOne({ id })
  return NextResponse.json({ ok: true })
}
