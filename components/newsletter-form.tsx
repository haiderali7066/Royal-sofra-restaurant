'use client'

import { useState } from 'react'
import { ArrowRight, Check, Loader2 } from 'lucide-react'

export function NewsletterForm({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [error, setError] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!email || status === 'loading') return
    setStatus('loading')
    setError('')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
        setStatus('error')
        return
      }
      setStatus('done')
      setEmail('')
    } catch {
      setError('Network error. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <p
        className={`flex items-center justify-center gap-2 text-sm font-semibold ${variant === 'dark' ? 'text-primary' : 'text-primary'}`}
      >
        <Check size={16} /> You&apos;re subscribed. Welcome to the table.
      </p>
    )
  }

  if (variant === 'dark') {
    return (
      <div>
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex w-full max-w-[28rem] items-center rounded-full border border-ink-foreground/20 bg-ink-foreground/5 p-1.5 backdrop-blur-sm transition-all duration-500 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/20"
        >
          <input
            type="email"
            required
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full flex-1 border-none bg-transparent px-6 text-sm font-light text-ink-foreground placeholder-ink-foreground/50 outline-none"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            aria-label="Subscribe to newsletter"
            className="group flex size-11 shrink-0 items-center justify-center rounded-full bg-ink-foreground text-ink transition-all duration-300 hover:bg-primary hover:text-ink-foreground disabled:opacity-70"
          >
            {status === 'loading' ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <ArrowRight size={20} strokeWidth={2} className="transition-transform group-hover:translate-x-0.5" />
            )}
          </button>
        </form>
        {error && <p className="mt-2 text-center text-xs text-destructive">{error}</p>}
      </div>
    )
  }

  return (
    <div className="w-full max-w-lg">
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          placeholder="Enter Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="min-h-[50px] w-full flex-1 rounded-md border-2 border-border bg-cream px-5 py-4 text-sm text-foreground shadow-sm placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-0 md:text-base"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="min-h-[50px] w-full whitespace-nowrap rounded-md bg-cta px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-cta-foreground shadow-[0_4px_14px_rgba(28,19,13,0.25)] transition-all duration-300 active:scale-95 disabled:opacity-70 sm:w-auto"
        >
          {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
        </button>
      </form>
      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
    </div>
  )
}
