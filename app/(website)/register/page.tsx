'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChefHat, Loader2 } from 'lucide-react'
import { authClient } from '@/lib/auth-client'

function isSafeRedirect(path: string | null): path is string {
  return !!path && path.startsWith('/') && !path.startsWith('//')
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  )
}

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectParam = searchParams.get('redirect')
  const destination = isSafeRedirect(redirectParam) ? redirectParam : '/account'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setLoading(true)
    const { error: signUpError } = await authClient.signUp.email({ name, email, password })
    setLoading(false)
    if (signUpError) {
      setError(signUpError.message || 'Could not create your account.')
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
      <h1 className="mt-6 text-center font-serif text-4xl">Join the table</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">Create an account for faster checkout and order history.</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {error && <p className="rounded-xl bg-destructive/10 px-4 py-2.5 text-sm text-destructive">{error}</p>}
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
          className="w-full rounded-xl border border-input bg-background px-4 py-3"
        />
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
          Create account
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
        Already have an account?{' '}
        <Link
          href={isSafeRedirect(redirectParam) ? `/login?redirect=${encodeURIComponent(redirectParam)}` : '/login'}
          className="font-semibold text-primary"
        >
          Sign in
        </Link>
      </p>
    </section>
  )
}
