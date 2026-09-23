'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'
import { brand } from '@/lib/mock-data'
import { authClient } from '@/lib/auth-client'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    const { data, error: signInError } = await authClient.signIn.email({ email, password })
    if (signInError) {
      setError('Invalid email or password.')
      setLoading(false)
      return
    }

    const role = (data?.user as unknown as { role?: string })?.role
    if (role !== 'admin') {
      await authClient.signOut()
      setError('This account does not have admin access.')
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-muted px-5 py-14">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
        <span className="grid size-12 place-items-center rounded-full bg-primary text-primary-foreground">
          <ShieldCheck size={22} />
        </span>
        <h1 className="mt-6 font-serif text-3xl">Admin sign in</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Restricted access for {brand.name} staff. Sign in with your admin credentials.
        </p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error && <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Work email"
            className="w-full rounded-xl border border-input bg-background px-4 py-3"
          />
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-xl border border-input bg-background px-4 py-3"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-cta py-3.5 text-sm font-semibold text-cta-foreground disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign in to dashboard'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Not an admin?{' '}
          <Link href="/login" className="font-semibold text-primary">
            Go to customer sign in
          </Link>
        </p>
      </div>
    </section>
  )
}
