'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { Plus, X, Pencil, Trash2 } from 'lucide-react'
import { AdminPageHeading } from '@/components/admin-page-heading'
import { fetcher } from '@/lib/fetcher'
import { initials, statusTone } from '@/lib/format'
import type { StaffMember } from '@/lib/types'

const roles: StaffMember['role'][] = ['Owner', 'Manager', 'Chef', 'Rider', 'Support']

const emptyForm = { name: '', email: '', role: 'Support' as StaffMember['role'], status: 'Active' as StaffMember['status'] }

export default function AdminStaffPage() {
  const { data, mutate } = useSWR<{ staff: StaffMember[] }>('/api/staff', fetcher)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState('')

  const staff = data?.staff ?? []

  const openCreateForm = () => {
    setEditingId(null)
    setForm(emptyForm)
    setError('')
    setShowForm(true)
  }

  const openEditForm = (member: StaffMember) => {
    setEditingId(member.id)
    setForm({ name: member.name, email: member.email, role: member.role, status: member.status })
    setError('')
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
    setError('')
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSaving(true)
    try {
      const res = await fetch(editingId ? `/api/staff/${editingId}` : '/api/staff', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const resData = await res.json()
      if (!res.ok) throw new Error(resData.error || 'Failed to save staff member')
      await mutate()
      closeForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save staff member')
    } finally {
      setSaving(false)
    }
  }

  const toggleStatus = async (member: StaffMember) => {
    await fetch(`/api/staff/${member.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: member.status === 'Active' ? 'Suspended' : 'Active' }),
    })
    await mutate()
  }

  const handleDelete = async (member: StaffMember) => {
    if (!confirm(`Remove ${member.name} from staff?`)) return
    setDeletingId(member.id)
    try {
      await fetch(`/api/staff/${member.id}`, { method: 'DELETE' })
      await mutate()
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
      <AdminPageHeading
        title="Staff & roles"
        description="Manage staff accounts, roles and access permissions."
        action={
          <button
            onClick={showForm ? closeForm : openCreateForm}
            className="inline-flex items-center gap-2 rounded-full bg-cta px-5 py-2.5 text-sm font-semibold text-cta-foreground"
          >
            {showForm ? <X size={16} /> : <Plus size={16} />} {showForm ? 'Cancel' : 'Add staff'}
          </button>
        }
      />

      {showForm && (
        <form onSubmit={handleSubmit} className="grid gap-4 rounded-2xl border border-border bg-card p-6 sm:grid-cols-2">
          {error && <p className="col-span-full text-sm text-destructive">{error}</p>}
          <input
            required
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
          />
          <input
            required
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
          />
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value as StaffMember['role'] })}
            className="rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as StaffMember['status'] })}
            className="rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
          >
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
          </select>
          <button
            type="submit"
            disabled={saving}
            className="col-span-full rounded-full bg-cta py-2.5 text-sm font-semibold text-cta-foreground disabled:opacity-60"
          >
            {saving ? 'Saving...' : editingId ? 'Save changes' : 'Add staff member'}
          </button>
        </form>
      )}

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3">Staff member</th>
              <th className="px-5 py-3">Role</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-sm text-muted-foreground">
                  No staff members yet. Add one to get started.
                </td>
              </tr>
            )}
            {staff.map((member) => (
              <tr key={member.id} className="border-b border-border last:border-0 hover:bg-secondary/50">
                <td className="flex items-center gap-3 px-5 py-4">
                  <span className="grid size-9 place-items-center rounded-full bg-secondary text-xs font-semibold text-primary">{initials(member.name)}</span>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.email}</p>
                  </div>
                </td>
                <td className="px-5 py-4">{member.role}</td>
                <td className="px-5 py-4">
                  <button
                    onClick={() => toggleStatus(member)}
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusTone(member.status)}`}
                  >
                    {member.status}
                  </button>
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="inline-flex items-center gap-1">
                    <button
                      aria-label={`Edit ${member.name}`}
                      onClick={() => openEditForm(member)}
                      className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      aria-label={`Remove ${member.name}`}
                      disabled={deletingId === member.id}
                      onClick={() => handleDelete(member)}
                      className="rounded-full p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
