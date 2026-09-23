'use client'

import { useEffect, useState } from 'react'
import { UserRound } from 'lucide-react'
import { AccountPageHeading } from '@/components/account-page-heading'
import { authClient, useSession } from '@/lib/auth-client'
import { initials } from '@/lib/format'

export default function ProfilePage() {
  const { data: session, isPending } = useSession()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '')
      setPhone((session.user as { phone?: string }).phone || '')
    }
  }, [session])

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      await authClient.updateUser({ name, phone })
      setMessage('Your profile has been updated.')
    } catch {
      setMessage('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (isPending || !session?.user) {
    return <p className="text-sm text-muted-foreground">Loading your profile…</p>
  }

  return (
    <div className="space-y-6">
      <AccountPageHeading title="My Profile" description="Keep your personal details up to date." />

      <div className="max-w-lg rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3">
          <span className="grid size-14 place-items-center rounded-full bg-secondary text-lg font-semibold text-primary">
            {initials(name || session.user.email)}
          </span>
          <div>
            <p className="font-serif text-xl">{name || session.user.email}</p>
            <p className="text-sm text-muted-foreground">{session.user.email}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Full name</label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Phone number</label>
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="e.g. 0300 1234567"
              className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email address</label>
            <input
              value={session.user.email}
              disabled
              className="mt-1.5 w-full rounded-xl border border-input bg-secondary px-4 py-2.5 text-sm text-muted-foreground"
            />
          </div>
          {message && <p className="text-sm text-primary">{message}</p>}
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-cta px-6 py-2.5 text-sm font-semibold text-cta-foreground disabled:opacity-60"
          >
            <UserRound size={15} /> {saving ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  )
}
