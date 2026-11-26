'use client'
// src/components/cookie/CookieConsent.tsx
//
// Cookie banner (vanilla-cookieconsent), modelled on labrity.com.
// Categories: "necessary" (always on, stores the choice itself) and
// "external" (Google Maps). MapEmbed reads the same consent, so accepting
// here shows the map and withdrawing here hides it again.

import { useEffect, useRef } from 'react'
import { useLocale } from 'next-intl'
import * as CC from 'vanilla-cookieconsent'
import 'vanilla-cookieconsent/dist/cookieconsent.css'

import { COOKIE_TEXTS, type CookieLang } from './cookieConsentTexts'
import { CONSENT_COOKIE, CONSENT_REVISION, EXTERNAL } from './consent'

const LANGS = Object.keys(COOKIE_TEXTS) as CookieLang[]
const LEGACY_MAP_KEY = 'consent:google-maps' // old MapEmbed storage, replaced by this banner

const link = (href: string, label: string) => `<a href="${href}" class="cc__link">${label}</a>`

const fill = (text: string, privacy: string, legal: string) =>
  text.replace('{privacy}', privacy).replace('{legal}', legal)

const buildTranslations = () =>
  Object.fromEntries(
    LANGS.map((code) => {
      const t = COOKIE_TEXTS[code]
      const privacy = link(`/${code}/privacy`, t.privacy)
      const legal = link(`/${code}/legal-notice`, t.legal)

      return [
        code,
        {
          consentModal: {
            title: t.title,
            description: fill(t.description, privacy, legal),
            acceptAllBtn: t.acceptAll,
            acceptNecessaryBtn: t.acceptNecessary,
            showPreferencesBtn: t.showPreferences,
          },
          preferencesModal: {
            title: t.preferencesTitle,
            acceptAllBtn: t.acceptAll,
            acceptNecessaryBtn: t.acceptNecessary,
            savePreferencesBtn: t.save,
            closeIconLabel: t.close,
            sections: [
              { title: t.necessaryTitle, description: t.necessaryDescription, linkedCategory: 'necessary' },
              { title: t.externalTitle, description: t.externalDescription, linkedCategory: EXTERNAL },
              { title: t.moreTitle, description: fill(t.moreDescription, privacy, legal) },
            ],
          },
        },
      ]
    }),
  )

export default function CookieConsent() {
  const locale = useLocale() as CookieLang
  const currentLang = useRef(locale)

  useEffect(() => {
    try { localStorage.removeItem(LEGACY_MAP_KEY) } catch { /* storage unavailable */ }

    void CC.run({
      revision: CONSENT_REVISION,
      autoClearCookies: true,
      hideFromBots: true,
      disablePageInteraction: false,
      cookie: { name: CONSENT_COOKIE, expiresAfterDays: 182 },
      guiOptions: {
        consentModal: { layout: 'box inline', position: 'bottom left', equalWeightButtons: true, flipButtons: false },
        preferencesModal: { layout: 'box', equalWeightButtons: true, flipButtons: false },
      },
      categories: {
        necessary: { enabled: true, readOnly: true },
        [EXTERNAL]: {},
      },
      language: { default: locale, translations: buildTranslations() },
    })
    // Run once; locale changes are handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (currentLang.current === locale) return
    currentLang.current = locale
    void CC.setLanguage(locale)
  }, [locale])

  return null
}
