// src/components/cookie/consent.ts
// Shared helpers around vanilla-cookieconsent: config constants, a React
// subscription to consent changes and toggling single categories.

import * as CC from 'vanilla-cookieconsent'

export const CONSENT_REVISION = 1
export const CONSENT_COOKIE = 'autoservice_cookie_consent'

/** Category for third-party embeds that need consent (Google Maps). */
export const EXTERNAL = 'external'

/** For useSyncExternalStore: re-render on any consent event. */
export function subscribeConsent(cb: () => void) {
  const events = ['cc:onConsent', 'cc:onChange'] as const
  events.forEach((e) => window.addEventListener(e, cb))
  return () => events.forEach((e) => window.removeEventListener(e, cb))
}

export function isAccepted(category: string) {
  try {
    return CC.acceptedCategory(category)
  } catch {
    return false
  }
}

/** Grant or withdraw one category, keeping all other choices as they are. */
export function setCategory(category: string, granted: boolean) {
  const current = CC.validConsent() ? CC.getUserPreferences().acceptedCategories : []
  const next = granted
    ? Array.from(new Set([...current, category]))
    : current.filter((c) => c !== category)
  CC.acceptCategory(next)
  CC.hide() // a choice made via the map also answers the banner
}
