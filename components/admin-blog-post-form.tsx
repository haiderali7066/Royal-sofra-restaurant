'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Image from 'next/image'
import { Loader2, Trash2, Upload } from 'lucide-react'
import { slugify } from '@/lib/format'
import type { BlogPost } from '@/lib/types'

export function AdminBlogPostForm({ post }: { post?: BlogPost }) {
  const router = useRouter()
  const [image, setImage] = useState(post?.image || '')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'blogs')
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      setImage(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    const formData = new FormData(event.currentTarget)
    const title = String(formData.get('title') || '').trim()

    if (!image) {
      setError('Please upload a cover image for this post.')
      return
    }

    const payload = {
      title,
      slug: post?.slug || slugify(title),
      excerpt: String(formData.get('excerpt') || ''),
      content: String(formData.get('content') || ''),
      category: String(formData.get('category') || ''),
      author: String(formData.get('author') || ''),
      image,
      published: formData.get('published') === 'on',
    }

    setSaving(true)
    try {
      const res = await fetch(post ? `/api/blogs/${post.id}` : '/api/blogs', {
        method: post ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save post')
      router.push('/admin/blogs')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save post')
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!post) return
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/blogs/${post.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete post')
      router.push('/admin/blogs')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete post')
      setDeleting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
        {error && (
          <div className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">
            {error}
          </div>
        )}
        <div>
          <label htmlFor="title" className="text-sm font-medium">
            Title
          </label>
          <input
            id="title"
            name="title"
            defaultValue={post?.title}
            required
            placeholder="Post title"
            className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
          />
        </div>
        <div>
          <label htmlFor="excerpt" className="text-sm font-medium">
            Excerpt
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            defaultValue={post?.excerpt}
            required
            rows={2}
            placeholder="Short summary shown on the blog listing"
            className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
          />
        </div>
        <div>
          <label htmlFor="content" className="text-sm font-medium">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            defaultValue={post?.content}
            required
            rows={8}
            placeholder="Write the full story"
            className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
          />
        </div>
      </div>
      <div className="space-y-4">
        <div className="rounded-2xl border border-border bg-card p-6">
          <label htmlFor="category" className="text-sm font-medium">
            Category
          </label>
          <input
            id="category"
            name="category"
            defaultValue={post?.category}
            required
            placeholder="e.g. Kitchen notes"
            className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
          />
          <label htmlFor="author" className="mt-4 block text-sm font-medium">
            Author
          </label>
          <input
            id="author"
            name="author"
            defaultValue={post?.author}
            required
            placeholder="Author name"
            className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
          />
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <label htmlFor="cover-upload" className="text-sm font-medium">
            Cover image
          </label>
          {image ? (
            <div className="relative mt-2 aspect-[16/10] overflow-hidden rounded-xl">
              <Image src={image} alt="Preview" fill className="object-cover" />
              <button
                type="button"
                onClick={() => setImage('')}
                aria-label="Remove image"
                className="absolute right-2 top-2 rounded-full bg-background/90 p-1.5 text-destructive"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ) : (
            <label
              htmlFor="cover-upload"
              className="mt-2 flex aspect-[16/10] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-secondary text-xs text-muted-foreground"
            >
              {uploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
              {uploading ? 'Uploading...' : 'Click to upload image'}
            </label>
          )}
          <input
            id="cover-upload"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleImageChange}
            disabled={uploading}
            className="sr-only"
          />
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <label className="flex items-center justify-between text-sm font-medium">
            Published
            <input type="checkbox" name="published" defaultChecked={post?.published ?? true} className="size-4" />
          </label>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving || uploading}
            className="flex-1 rounded-full bg-cta py-3 text-sm font-semibold text-cta-foreground disabled:opacity-60"
          >
            {saving ? 'Saving...' : post ? 'Save changes' : 'Publish post'}
          </button>
          {post && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-full border border-border p-3 text-destructive hover:bg-destructive/10 disabled:opacity-60"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    </form>
  )
}
