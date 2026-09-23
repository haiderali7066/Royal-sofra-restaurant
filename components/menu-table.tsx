'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import {
  Check,
  ChevronDown,
  Edit3,
  Search,
  Star,
  Utensils,
  X,
} from 'lucide-react'
import { money } from '@/lib/format'

type MenuItem = {
  id: string
  name: string
  slug: string
  category: string
  description: string
  price: number
  image: string
  tag: string
  spiceLevel: number
  isAvailable: boolean
  isFeatured: boolean
}

type Props = {
  items: MenuItem[]
}

export function MenuTable({ items }: Props) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState('all')

  const categories = useMemo(() => {
    return Array.from(new Set(items.map((item) => item.category))).sort()
  }, [items])

  const stats = useMemo(() => {
    return {
      total: items.length,
      available: items.filter((item) => item.isAvailable).length,
      unavailable: items.filter((item) => !item.isAvailable).length,
      featured: items.filter((item) => item.isFeatured).length,
    }
  }, [items])

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase()

    return items.filter((item) => {
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)

      const matchesCategory =
        category === 'all' || item.category === category

      const matchesStatus =
        status === 'all' ||
        (status === 'available' && item.isAvailable) ||
        (status === 'unavailable' && !item.isAvailable) ||
        (status === 'featured' && item.isFeatured)

      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [items, search, category, status])

  return (
    <div className="space-y-5">

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Total items"
          value={stats.total}
          icon={<Utensils size={18} />}
        />

        <StatCard
          label="Available"
          value={stats.available}
          icon={<Check size={18} />}
        />

        

        <StatCard
          label="Featured"
          value={stats.featured}
          icon={<Star size={18} />}
        />
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex flex-col gap-3 lg:flex-row">

          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search dishes, categories..."
              className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm outline-none transition focus:border-primary"
            />
          </div>

          {/* Category */}
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-11 min-w-[190px] appearance-none rounded-xl border border-border bg-background px-4 pr-10 text-sm outline-none focus:border-primary"
            >
              <option value="all">All categories</option>

              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <ChevronDown
              size={15}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
            />
          </div>

          {/* Status */}
          <div className="relative">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-11 min-w-[160px] appearance-none rounded-xl border border-border bg-background px-4 pr-10 text-sm outline-none focus:border-primary"
            >
              <option value="all">All status</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
              <option value="featured">Featured</option>
            </select>

            <ChevronDown
              size={15}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
            />
          </div>

        </div>

        <div className="mt-3 text-xs text-muted-foreground">
          Showing {filteredItems.length} of {items.length} menu items
        </div>
      </div>

      {/* Table */}
      {filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <Utensils
            size={28}
            className="mx-auto mb-3 text-muted-foreground"
          />

          <h3 className="font-serif text-lg">
            No menu items found
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Try changing your search or filters.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">

          {/* Desktop table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/40 text-left">
                  <th className="px-5 py-4 font-medium">
                    Item
                  </th>

                  <th className="px-5 py-4 font-medium">
                    Category
                  </th>

                  <th className="px-5 py-4 font-medium">
                    Price
                  </th>

                  <th className="px-5 py-4 font-medium">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right font-medium">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-border last:border-0 hover:bg-secondary/20"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">

                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-secondary">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <Utensils
                                size={18}
                                className="text-muted-foreground"
                              />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="truncate font-semibold">
                              {item.name}
                            </p>

                            {item.isFeatured && (
                              <Star
                                size={13}
                                className="shrink-0 fill-current text-primary"
                              />
                            )}
                          </div>

                          {item.tag && (
                            <span className="mt-1 inline-block text-[10px] font-semibold uppercase tracking-wider text-primary">
                              {item.tag}
                            </span>
                          )}
                        </div>

                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-secondary px-3 py-1 text-xs">
                        {item.category}
                      </span>
                    </td>

                    <td className="px-5 py-4 font-semibold">
                      {money(item.price)}
                    </td>

                    <td className="px-5 py-4">
                      {item.isAvailable ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">
                          <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                          Unavailable
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/menu/${item.id}/edit`}
                        className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold transition hover:bg-secondary"
                      >
                        <Edit3 size={14} />
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="divide-y divide-border md:hidden">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 p-4"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-secondary">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Utensils
                        size={18}
                        className="text-muted-foreground"
                      />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold">
                        {item.name}
                      </h3>

                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {item.category}
                      </p>
                    </div>

                    <span className="shrink-0 text-sm font-semibold">
                      {money(item.price)}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    {item.isAvailable ? (
                      <span className="text-xs font-medium text-emerald-600">
                        ● Available
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-destructive">
                        ● Unavailable
                      </span>
                    )}

                    <Link
                      href={`/admin/menu/${item.id}/edit`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold"
                    >
                      <Edit3 size={13} />
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  )
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string
  value: number
  icon: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {label}
        </span>

        <span className="rounded-lg bg-secondary p-2">
          {icon}
        </span>
      </div>

      <p className="mt-3 text-2xl font-semibold">
        {value}
      </p>
    </div>
  )
}