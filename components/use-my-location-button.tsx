'use client'

import { useState } from 'react'
import { Loader2, LocateFixed } from 'lucide-react'

export function UseMyLocationButton({
  onResolved,
  className,
}: {
  onResolved: (result: { address: string; city: string }) => void
  className?: string
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleClick = () => {
    setError('')
    if (!('geolocation' in navigator)) {
      setError('Location access is not supported on this device.')
      return
    }

    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          const res = await fetch(`/api/geocode/reverse?lat=${latitude}&lon=${longitude}`)
          const data = await res.json()
          if (!res.ok) {
            setError(data.error || 'Could not resolve your location.')
            return
          }
          onResolved({ address: data.address, city: data.city })
        } catch {
          setError('Could not resolve your location.')
        } finally {
          setLoading(false)
        }
      },
      (geoError) => {
        setLoading(false)
        setError(
          geoError.code === geoError.PERMISSION_DENIED
            ? 'Location access was denied. You can enter your address manually.'
            : 'Could not get your location. You can enter your address manually.',
        )
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-opacity hover:opacity-80 disabled:opacity-60"
      >
        {loading ? <Loader2 className="animate-spin" size={15} /> : <LocateFixed size={15} />}
        Use my current location
      </button>
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  )
}
