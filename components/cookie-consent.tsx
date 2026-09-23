'use client'

import { useEffect, useState } from 'react'
import { Cookie } from 'lucide-react'

const STORAGE_KEY = 'royal-sofra-cookie-consent'

type Consent = 'all' | 'necessary'

export function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const existing = window.localStorage.getItem(STORAGE_KEY)
    if (!existing) {
      setVisible(true)
    }
  }, [])

  const choose = (consent: Consent) => {
    window.localStorage.setItem(STORAGE_KEY, consent)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card px-5 py-5 shadow-[0_-8px_24px_-8px_rgba(0,0,0,0.15)] md:px-8"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
            <Cookie size={17} />
          </span>
          <p className="text-sm leading-relaxed text-muted-foreground">
            We use cookies to keep you signed in, remember your cart, and improve Royal Sofra. Choose how we can use
            them.
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          <button
            onClick={() => choose('necessary')}
            className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
          >
            Necessary only
          </button>
          <button
            onClick={() => choose('all')}
            className="rounded-full bg-cta px-5 py-2.5 text-sm font-semibold text-cta-foreground transition-transform hover:-translate-y-0.5"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  )
}
