import { settingsCollection } from '@/lib/collections'
import type { SiteSettings } from '@/lib/types'

export const DEFAULT_SETTINGS: SiteSettings = {
  id: 'site',
  deliveryFee: 250,
  freeDeliveryThreshold: 3000,
  taxPercent: 0,
  minOrderAmount: 500,
  codEnabled: true,
  gopayfastEnabled: true,
}

// Settings are stored as a single document (id: "site"). Falls back to
// defaults when the document hasn't been created yet, so callers never have
// to deal with a missing-settings state.
export async function getSiteSettings(): Promise<SiteSettings> {
  const settings = await settingsCollection()
  const doc = await settings.findOne({ id: 'site' })
  return doc ? { ...DEFAULT_SETTINGS, ...doc } : DEFAULT_SETTINGS
}
