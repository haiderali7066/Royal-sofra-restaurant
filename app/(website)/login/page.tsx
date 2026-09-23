'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChefHat, Loader2 } from 'lucide-react'
import { authClient } from '@/lib/auth-client'

function isSafeRedirect(path: string | null): path is string {
  return !!path && path.startsWith('/') && !path.startsWith('//')
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectParam = searchParams.get('redirect')
  const destination = isSafeRedirect(redirectParam) ? redirectParam : '/account'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    const { error: signInError } = await authClient.signIn.email({ email, password })
    setLoading(false)
    if (signInError) {
      setError('Invalid email or password.')
      return
    }
    router.push(destination)
    router.refresh()
  }

  const handleGoogle = async () => {
    await authClient.signIn.social({ provider: 'google', callbackURL: destination })
  }

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-14 md:px-8">
      <span className="mx-auto grid size-12 place-items-center rounded-full bg-primary text-primary-foreground">
        <ChefHat size={22} />
      </span>
      <h1 className="mt-6 text-center font-serif text-4xl">Welcome back</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">Sign in to track orders and manage your account.</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {error && <p className="rounded-xl bg-destructive/10 px-4 py-2.5 text-sm text-destructive">{error}</p>}
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
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
          className="flex w-full items-center justify-center gap-2 rounded-full bg-cta py-3.5 text-sm font-semibold text-cta-foreground disabled:opacity-60"
        >
          {loading && <Loader2 className="animate-spin" size={16} />}
          Sign in
        </button>
      </form>
      <button
        type="button"
        onClick={handleGoogle}
        className="mt-3 w-full rounded-full border border-border py-3.5 text-sm font-semibold"
      >
        Continue with Google
      </button>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        New here?{' '}
        <Link
          href={isSafeRedirect(redirectParam) ? `/register?redirect=${encodeURIComponent(redirectParam)}` : '/register'}
          className="font-semibold text-primary"
        >
          Create an account
        </Link>
      </p>
    </section>
  )
}
