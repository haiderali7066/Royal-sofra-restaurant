'use client'

import { useState } from 'react'
import { KeyRound } from 'lucide-react'
import { AccountPageHeading } from '@/components/account-page-heading'
import { authClient } from '@/lib/auth-client'

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleChangePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setMessage('')

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.')
      return
    }

    setSaving(true)
    try {
      const { error: apiError } = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      })
      if (apiError) {
        setError(apiError.message || 'Failed to change password.')
      } else {
        setMessage('Your password has been updated.')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <AccountPageHeading title="Settings" description="Manage your account security." />

      <div className="max-w-lg rounded-2xl border border-border bg-card p-6">
        <h2 className="font-serif text-xl">Change password</h2>
        <p className="mt-1 text-sm text-muted-foreground">Choose a strong password you don&apos;t use anywhere else.</p>
        <form onSubmit={handleChangePassword} className="mt-4 space-y-3">
          <input
            type="password"
            required
            placeholder="Current password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
          />
          <input
            type="password"
            required
            placeholder="New password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
          />
          <input
            type="password"
            required
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          {message && <p className="text-sm text-primary">{message}</p>}
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-cta px-6 py-2.5 text-sm font-semibold text-cta-foreground disabled:opacity-60"
          >
            <KeyRound size={15} /> {saving ? 'Updating…' : 'Update password'}
          </button>
        </form>
      </div>
    </div>
  )
}
