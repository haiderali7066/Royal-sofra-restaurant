import { NextRequest, NextResponse } from 'next/server'
import { blogPostsCollection } from '@/lib/collections'
import { getApiUser } from '@/lib/session'
import type { BlogPost } from '@/lib/types'

export async function GET() {
  const blogs = await blogPostsCollection()
  const posts = await blogs.find({}).sort({ date: -1 }).toArray()
  return NextResponse.json({ posts })
}

// Any signed-in user can submit a blog post (matches the site's "My Account" blog authoring feature).
// Admins can publish immediately; customer-authored posts are saved unpublished pending admin review.
export async function POST(request: NextRequest) {
  const user = await getApiUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  if (!body?.title || !body?.content) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const slug = String(body.title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .concat(`-${Date.now().toString().slice(-5)}`)

  const post: BlogPost = {
    id: `blg-${Date.now()}`,
    slug,
    title: body.title,
    excerpt: body.excerpt || String(body.content).slice(0, 150),
    content: body.content,
    category: body.category || 'General',
    author: user.name || user.email,
    date: new Date().toISOString().slice(0, 10),
    image: body.image || 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=85',
    published: user.role === 'admin' ? (body.published ?? true) : false,
  }

  const blogs = await blogPostsCollection()
  await blogs.insertOne(post)
  return NextResponse.json({ post }, { status: 201 })
}
