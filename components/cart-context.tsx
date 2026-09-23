'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { CartLine, MenuItem } from '@/lib/types'

interface CartContextValue {
  cart: CartLine[]
  addToCart: (item: MenuItem) => void
  updateQty: (id: string, qty: number) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
  total: number
  count: number
  toast: string
  isDrawerOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = 'royal-sofra-cart'

function readStoredCart(): CartLine[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Cart contents are ephemeral, per-browser shopping-bag state (not account
  // data), so localStorage is the right place for it -- it just needs to
  // survive page reloads within the same browser during a shopping session.
  const [cart, setCart] = useState<CartLine[]>([])
  const [toast, setToast] = useState('')
  const [hydrated, setHydrated] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  useEffect(() => {
    setCart(readStoredCart())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
  }, [cart, hydrated])

  const addToCart = (item: MenuItem) => {
    setCart((current) => {
      const found = current.find((line) => line.item.id === item.id)
      if (found) {
        return current.map((line) => (line.item.id === item.id ? { ...line, qty: line.qty + 1 } : line))
      }
      return [...current, { item, qty: 1 }]
    })
    setToast(`${item.name} added to your bag`)
    setTimeout(() => setToast(''), 2200)
    setIsDrawerOpen(true)
  }

  const updateQty = (id: string, qty: number) => {
    setCart((current) =>
      current.map((line) => (line.item.id === id ? { ...line, qty: Math.max(0, qty) } : line)).filter((line) => line.qty > 0),
    )
  }

  const removeFromCart = (id: string) => {
    setCart((current) => current.filter((line) => line.item.id !== id))
  }

  const clearCart = () => setCart([])

  const total = useMemo(() => cart.reduce((sum, line) => sum + line.item.price * line.qty, 0), [cart])
  const count = useMemo(() => cart.reduce((sum, line) => sum + line.qty, 0), [cart])

  const openDrawer = () => setIsDrawerOpen(true)
  const closeDrawer = () => setIsDrawerOpen(false)

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQty, removeFromCart, clearCart, total, count, toast, isDrawerOpen, openDrawer, closeDrawer }}
    >
      {children}
      {toast && (
        <div role="status" className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-foreground px-5 py-3 text-sm text-background shadow-xl">
          {toast}
        </div>
      )}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
