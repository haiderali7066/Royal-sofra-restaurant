'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Image from 'next/image'
import { Loader2, Trash2, Upload } from 'lucide-react'
import { menuCategories } from '@/lib/mock-data'
import { slugify } from '@/lib/format'
import type { MenuItem } from '@/lib/types'

export function AdminMenuItemForm({ item }: { item?: MenuItem }) {
  const router = useRouter()
  const [image, setImage] = useState(item?.image || '')
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
      formData.append('folder', 'menu')
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

    const form = event.currentTarget
    const formData = new FormData(form)
    const name = String(formData.get('name') || '').trim()

    if (!image) {
      setError('Please upload an image for this item.')
      return
    }

    const payload = {
      name,
      slug: item?.slug || slugify(name),
      description: String(formData.get('description') || ''),
      category: String(formData.get('category') || menuCategories[0]),
      price: Number(formData.get('price') || 0),
      tag: String(formData.get('tag') || ''),
      spiceLevel: Number(formData.get('spiceLevel') || 1),
      image,
      isAvailable: formData.get('isAvailable') === 'on',
      isFeatured: formData.get('isFeatured') === 'on',
    }

    setSaving(true)
    try {
      const res = await fetch(item ? `/api/menu/${item.id}` : '/api/menu', {
        method: item ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save item')
      router.push('/admin/menu')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save item')
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!item) return
    if (!confirm(`Delete "${item.name}"? This cannot be undone.`)) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/menu/${item.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete item')
      router.push('/admin/menu')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item')
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
          <label htmlFor="name" className="text-sm font-medium">
            Item name
          </label>
          <input
            id="name"
            name="name"
            defaultValue={item?.name}
            required
            placeholder="e.g. Royal Handi Karahi"
            className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
          />
        </div>
        <div>
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            defaultValue={item?.description}
            required
            rows={3}
            placeholder="Short, appetising description"
            className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="category" className="text-sm font-medium">
              Category
            </label>
            <select
              id="category"
              name="category"
              defaultValue={item?.category ?? menuCategories[0]}
              className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
            >
              {menuCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="price" className="text-sm font-medium">
              Price (Rs.)
            </label>
            <input
              id="price"
              name="price"
              defaultValue={item?.price}
              required
              type="number"
              min={0}
              className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="tag" className="text-sm font-medium">
              Tag
            </label>
            <input
              id="tag"
              name="tag"
              defaultValue={item?.tag}
              placeholder="e.g. Chef selection"
              className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
            />
          </div>
          <div>
            <label htmlFor="spiceLevel" className="text-sm font-medium">
              Spice level
            </label>
            <select
              id="spiceLevel"
              name="spiceLevel"
              defaultValue={item?.spiceLevel ?? 1}
              className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
            >
              <option value={1}>Mild</option>
              <option value={2}>Medium</option>
              <option value={3}>Hot</option>
            </select>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="rounded-2xl border border-border bg-card p-6">
          <label htmlFor="image-upload" className="text-sm font-medium">
            Image
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
              htmlFor="image-upload"
              className="mt-2 flex aspect-[16/10] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-secondary text-xs text-muted-foreground"
            >
              {uploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
              {uploading ? 'Uploading...' : 'Click to upload image'}
            </label>
          )}
          <input
            id="image-upload"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleImageChange}
            disabled={uploading}
            className="sr-only"
          />
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <label className="flex items-center justify-between text-sm font-medium">
            Available on menu
            <input type="checkbox" name="isAvailable" defaultChecked={item?.isAvailable ?? true} className="size-4" />
          </label>
          <label className="mt-3 flex items-center justify-between text-sm font-medium">
            Feature on homepage
            <input type="checkbox" name="isFeatured" defaultChecked={item?.isFeatured ?? false} className="size-4" />
          </label>
        </div>
        <button
          type="submit"
          disabled={saving || uploading}
          className="w-full rounded-full bg-cta py-3 text-sm font-semibold text-cta-foreground disabled:opacity-60"
        >
          {saving ? 'Saving...' : item ? 'Save changes' : 'Create item'}
        </button>
        {item && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="w-full rounded-full border border-destructive/30 py-3 text-sm font-semibold text-destructive disabled:opacity-60"
          >
            {deleting ? 'Deleting...' : 'Delete item'}
          </button>
        )}
      </div>
    </form>
  )
}
