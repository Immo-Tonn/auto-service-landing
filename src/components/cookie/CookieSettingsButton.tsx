'use client'
// src/components/cookie/CookieSettingsButton.tsx
// Reopens the cookie preferences (used in the footer).

import { showPreferences } from 'vanilla-cookieconsent'

export default function CookieSettingsButton({ label, className }: { label: string; className?: string }) {
  return (
    <button type="button" onClick={() => showPreferences()} className={className}>
      {label}
    </button>
  )
}
