'use client'
// src/components/MapEmbed.tsx
//
// Google Maps behind a click (two-click solution for DSGVO):
// nothing is requested from Google until the visitor clicks "Karte laden".
// "Künftig automatisch laden" grants the "external" category of the cookie
// banner; "Karte ausblenden" withdraws it (withdrawal as easy as consent).
//
// Uses the official Maps Embed API when NEXT_PUBLIC_GOOGLE_MAPS_KEY is set
// (free, unlimited; restrict the key to your domains in Google Cloud),
// otherwise falls back to the keyless embed URL.

import { useEffect, useState, useSyncExternalStore } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { EXTERNAL, isAccepted, setCategory, subscribeConsent } from './cookie/consent'

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY

function mapSrc(address: string, locale: string) {
  const q = encodeURIComponent(address)
  return API_KEY
    ? `https://www.google.com/maps/embed/v1/place?key=${API_KEY}&q=${q}&zoom=16&language=${locale}`
    : `https://www.google.com/maps?q=${q}&z=16&hl=${locale}&output=embed`
}

const readConsent = () => isAccepted(EXTERNAL)

interface Props {
  address: string
  title: string
  /** Extra classes for the placeholder (e.g. padding to avoid an overlay). */
  placeholderClassName?: string
}

export default function MapEmbed({ address, title, placeholderClassName = '' }: Props) {
  const t = useTranslations('contactSection')
  const locale = useLocale()
  // Consent from the cookie banner (server snapshot = false, so SSR always renders the placeholder)
  const remembered = useSyncExternalStore(subscribeConsent, readConsent, () => false)
  // Consent for this visit only
  const [loadedNow, setLoadedNow] = useState(false)
  const [remember, setRemember] = useState(false)
  const loaded = remembered || loadedNow

  // Consent withdrawn in the cookie settings: also drop the one-off load
  useEffect(() => {
    const onChange = () => { if (!readConsent()) setLoadedNow(false) }
    window.addEventListener('cc:onChange', onChange)
    return () => window.removeEventListener('cc:onChange', onChange)
  }, [])

  const load = () => {
    if (remember) setCategory(EXTERNAL, true)
    setLoadedNow(true)
  }

  const hide = () => {
    if (remembered) setCategory(EXTERNAL, false)
    setRemember(false)
    setLoadedNow(false)
  }

  if (loaded) {
    return (
      <>
        <iframe
          src={mapSrc(address, locale)}
          className="w-full h-full border-0"
          title={title}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
        <button
          type="button"
          onClick={hide}
          className="absolute top-3 right-3 z-10 bg-zinc-900/90 text-slate-300 hover:text-yellow-400 text-xs font-semibold uppercase tracking-wider px-3 py-2 rounded border border-zinc-700 transition-colors"
        >
          {t('mapHide')}
        </button>
      </>
    )
  }

  return (
    <div
      className={`
        w-full h-full flex flex-col items-center
        justify-center
        px-6 text-center
        bg-zinc-900
        bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)]
        bg-[size:40px_40px]
        ${placeholderClassName}
      `}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/icons/pin.svg" alt="" width={40} height={40} className="mb-4 opacity-80" />
      <p className="text-slate-200 font-semibold mb-1">{address}</p>
      <p className="text-slate-400 text-sm max-w-md mb-5 leading-relaxed">
        {t('mapConsentText')}{' '}
        <Link href="/privacy#maps" className="underline hover:text-yellow-400">
          {t('mapPrivacyLink')}
        </Link>
      </p>
      <button
        type="button"
        onClick={load}
        className="border-2 border-yellow-400 text-yellow-400 font-bold px-8 py-3 text-sm uppercase tracking-wider hover:bg-yellow-400 hover:text-zinc-900 transition-colors duration-200"
      >
        {t('mapLoad')}
      </button>
      <label className="mt-4 flex items-center gap-2 text-xs text-slate-400 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={remember}
          onChange={(e) => setRemember(e.target.checked)}
          className="accent-yellow-400 size-4"
        />
        {t('mapRemember')}
      </label>
    </div>
  )
}
