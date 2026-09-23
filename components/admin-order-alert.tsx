'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Bell, X } from 'lucide-react'
import { money } from '@/lib/format'

interface NewOrderInfo {
  id: string
  customerName: string
  total: number
  placedAt: string
}

interface AlertContextValue {
  count: number
  dismiss: () => void
}

const AlertContext = createContext<AlertContextValue>({ count: 0, dismiss: () => {} })

export function useAdminOrderAlert() {
  return useContext(AlertContext)
}

const POLL_MS = 6000
const MAX_SOUND_MS = 30_000
const BEEP_INTERVAL_MS = 1200

// Plays a short two-tone chime using the Web Audio API instead of an audio
// file, so there is nothing to host and no autoplay-blocked <audio> element.
function playChime(ctx: AudioContext) {
  const now = ctx.currentTime
  ;[880, 660].forEach((freq, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = freq
    const start = now + i * 0.16
    gain.gain.setValueAtTime(0.0001, start)
    gain.gain.exponentialRampToValueAtTime(0.3, start + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.3)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(start)
    osc.stop(start + 0.32)
  })
}

export function AdminOrderAlertProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const onOrdersPage = pathname?.startsWith('/admin/orders') ?? false

  const sinceRef = useRef(new Date().toISOString())
  const lastAlertedIdRef = useRef<string | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const beepTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const stopTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [count, setCount] = useState(0)
  const [latestOrders, setLatestOrders] = useState<NewOrderInfo[]>([])

  // AudioContext can only be created/resumed after a user gesture, so warm
  // one up on the first click/keypress instead of waiting for the alert.
  useEffect(() => {
    const warmUp = () => {
      if (!audioCtxRef.current) {
        const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        audioCtxRef.current = new Ctor()
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume().catch(() => {})
      }
    }
    document.addEventListener('pointerdown', warmUp, { once: true })
    document.addEventListener('keydown', warmUp, { once: true })
    return () => {
      document.removeEventListener('pointerdown', warmUp)
      document.removeEventListener('keydown', warmUp)
    }
  }, [])

  const stopSound = useCallback(() => {
    if (beepTimerRef.current) {
      clearInterval(beepTimerRef.current)
      beepTimerRef.current = null
    }
    if (stopTimeoutRef.current) {
      clearTimeout(stopTimeoutRef.current)
      stopTimeoutRef.current = null
    }
  }, [])

  const startSound = useCallback(() => {
    stopSound()
    const ctx = audioCtxRef.current
    if (!ctx) return
    if (ctx.state === 'suspended') ctx.resume().catch(() => {})
    playChime(ctx)
    beepTimerRef.current = setInterval(() => playChime(ctx), BEEP_INTERVAL_MS)
    stopTimeoutRef.current = setTimeout(stopSound, MAX_SOUND_MS)
  }, [stopSound])

  const dismiss = useCallback(() => {
    sinceRef.current = new Date().toISOString()
    lastAlertedIdRef.current = null
    setCount(0)
    setLatestOrders([])
    stopSound()
  }, [stopSound])

  // Stop the chime and clear the badge the instant the admin opens Orders.
  useEffect(() => {
    if (onOrdersPage) dismiss()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onOrdersPage])

  useEffect(() => {
    if (onOrdersPage) return
    let cancelled = false

    const poll = async () => {
      try {
        const res = await fetch(`/api/orders/latest?since=${encodeURIComponent(sinceRef.current)}`)
        if (!res.ok || cancelled) return
        const data: { count: number; orders: NewOrderInfo[] } = await res.json()
        if (cancelled) return
        setCount(data.count)
        setLatestOrders(data.orders ?? [])
        const newestId = data.orders?.[0]?.id ?? null
        if (data.count > 0 && newestId && newestId !== lastAlertedIdRef.current) {
          lastAlertedIdRef.current = newestId
          startSound()
        }
      } catch {
        // Ignore transient network errors between polls.
      }
    }

    poll()
    const interval = setInterval(poll, POLL_MS)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [onOrdersPage, startSound])

  useEffect(() => stopSound, [stopSound])

  return (
    <AlertContext.Provider value={{ count, dismiss }}>
      {children}
      {count > 0 && (
        <div className="fixed bottom-5 right-5 z-50 w-[calc(100%-2.5rem)] max-w-sm rounded-2xl border border-border bg-card p-4 shadow-xl sm:w-auto">
          <div className="flex items-start gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
              <Bell size={16} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">
                {count === 1 ? 'New order received' : `${count} new orders received`}
              </p>
              {latestOrders[0] && (
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {latestOrders[0].id} &middot; {latestOrders[0].customerName} &middot; {money(latestOrders[0].total)}
                </p>
              )}
              <button
                onClick={() => {
                  dismiss()
                  router.push('/admin/orders')
                }}
                className="mt-2 rounded-full bg-cta px-3.5 py-1.5 text-xs font-semibold text-cta-foreground"
              >
                View orders
              </button>
            </div>
            <button aria-label="Dismiss" onClick={dismiss} className="shrink-0 rounded-full p-1 text-muted-foreground hover:bg-secondary">
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  )
}
