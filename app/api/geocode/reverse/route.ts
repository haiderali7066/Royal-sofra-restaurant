import { NextRequest, NextResponse } from 'next/server'

// Server-side proxy to OpenStreetMap Nominatim reverse geocoding. Proxying
// avoids exposing raw coordinates directly to a third party from the client
// and lets us set the User-Agent header Nominatim's usage policy requires.
export async function GET(request: NextRequest) {
  const lat = request.nextUrl.searchParams.get('lat')
  const lon = request.nextUrl.searchParams.get('lon')

  const latNum = Number(lat)
  const lonNum = Number(lon)
  if (!lat || !lon || Number.isNaN(latNum) || Number.isNaN(lonNum) || latNum < -90 || latNum > 90 || lonNum < -180 || lonNum > 180) {
    return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 })
  }

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latNum}&lon=${lonNum}&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'RoyalSofra/1.0 (delivery address lookup)',
          Accept: 'application/json',
        },
      },
    )
    if (!res.ok) {
      return NextResponse.json({ error: 'Could not resolve address' }, { status: 502 })
    }

    const data = await res.json()
    const addr = data.address || {}
    const streetParts = [addr.house_number, addr.road].filter(Boolean).join(' ')
    const address = streetParts || addr.neighbourhood || addr.suburb || data.display_name || ''
    const city = addr.city || addr.town || addr.village || addr.county || ''

    return NextResponse.json({ address, city, displayName: data.display_name || '' })
  } catch {
    return NextResponse.json({ error: 'Could not resolve address' }, { status: 502 })
  }
}
