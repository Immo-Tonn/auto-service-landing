'use client'

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, usePathname } from '@/i18n/navigation'

// ─── Types ────────────────────────────────────────────────────────────────────

const LOCALES = ['ru', 'de', 'en'] as const
type Locale = (typeof LOCALES)[number]

const NAV_ITEMS = [
  { key: 'home',     href: '#hero'     },
  { key: 'services', href: '#services' },
  { key: 'about',    href: '#about'    },
  { key: 'contact',  href: '#contact'  },
] as const

// ─── SVG Icons ────────────────────────────────────────────────────────────────

function ClockIcon() {
  return (
    <svg className="w-4 h-4 shrink-0 text-yellow-400" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg className="w-4 h-4 shrink-0 text-yellow-400" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.64 3.38 2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.09a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function BurgerIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
      <line x1="3" y1="6"  x2="21" y2="6"  />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

function TelegramIcon() {
  return (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

// ─── Logo ─────────────────────────────────────────────────────────────────────

function Logo({ small = false }: { small?: boolean }) {
  return (
    <div
      className={`
        border-2 border-yellow-400 text-yellow-400 font-black tracking-widest uppercase
        ${small ? 'px-2 py-0.5 text-base' : 'px-3 py-1 text-lg'}
      `}
    >
      AutoService
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Header() {
  const t       = useTranslations('nav')
  const locale  = useLocale()
  const router  = useRouter()
  const pathname = usePathname()

  const [menuOpen, setMenuOpen] = useState(false)

  // Close menu when viewport becomes desktop-sized
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 900) setMenuOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const switchLocale = (next: Locale) => {
    router.push(pathname, { locale: next })
    setMenuOpen(false)
  }

  return (
    <>
      {/* ── TOP INFO BAR (scrolls away with page) ─────────────────────────── */}
      <div className="bg-zinc-800 text-slate-300 text-xs sm:text-sm py-2">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-1">

          <span className="flex items-center gap-2">
            <ClockIcon />
            {t('workHours')}
          </span>

          <div className="flex gap-4 sm:gap-8">
            {['+49 123 45678901', '+49 123 98765401'].map((phone, i) => (
              <a
                key={i}
                href={`tel:${phone.replace(/\s/g, '')}`}
                className="flex items-center gap-2 hover:text-yellow-400 transition-colors"
              >
                <PhoneIcon />
                {phone}
              </a>
            ))}
          </div>

        </div>
      </div>

      {/* ── STICKY NAV HEADER ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-zinc-900 border-b border-zinc-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-6">

          {/* Logo */}
          <a href={`#hero`} aria-label="AutoService — zur Startseite">
            <Logo />
          </a>

          {/* Desktop navigation — visible at ≥900px */}
          <nav className="hidden min-[900px]:flex items-center gap-8 flex-1 justify-center">
            {NAV_ITEMS.map(({ key, href }) => (
              <a
                key={key}
                href={href}
                className="
                  relative text-slate-200 hover:text-yellow-400
                  font-semibold uppercase text-sm tracking-wider
                  transition-colors duration-200
                  after:absolute after:left-0 after:-bottom-0.5
                  after:h-[2px] after:w-0 after:bg-yellow-400
                  after:transition-all after:duration-300
                  hover:after:w-full
                "
              >
                {t(key)}
              </a>
            ))}
          </nav>

          {/* Desktop language switcher — visible at ≥900px */}
          <div className="hidden min-[900px]:flex items-center gap-0.5 text-sm font-medium shrink-0">
            {LOCALES.map((loc, i) => (
              <span key={loc} className="flex items-center">
                <button
                  onClick={() => switchLocale(loc)}
                  className={`
                    px-1.5 py-0.5 uppercase tracking-wider transition-colors duration-200
                    ${locale === loc
                      ? 'text-yellow-400 font-bold'
                      : 'text-slate-400 hover:text-slate-200'}
                  `}
                >
                  {loc}
                </button>
                {i < LOCALES.length - 1 && (
                  <span className="text-zinc-600 select-none">|</span>
                )}
              </span>
            ))}
          </div>

          {/* Burger button — visible below 900px */}
          <button
            className="min-[900px]:hidden text-slate-200 hover:text-yellow-400 transition-colors p-1"
            onClick={() => setMenuOpen(true)}
            aria-label="Menü öffnen"
          >
            <BurgerIcon />
          </button>

        </div>
      </header>

      {/* ── MOBILE MENU ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[60] bg-black/60 "
              onClick={() => setMenuOpen(false)}
            />

            {/* Slide-in panel */}
            <motion.aside
              key="panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
              className="
                fixed top-0 right-0 h-auto w-72
                z-[70] bg-[#1c1408]
                rounded-l-2xl shadow-2xl
                flex flex-col p-6
                border-l border-yellow-900/40
              "
            >
              {/* Panel header */}
              <div className="flex items-start justify-between mb-10">
                <Logo small />
                <button
                  onClick={() => setMenuOpen(false)}
                  className="
                    text-slate-400 hover:text-yellow-400
                    transition-colors text-3xl leading-none mt-[-2px]
                  "
                  aria-label="Menü schließen"
                >
                  ×
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex flex-col gap-5 flex-1">
                {NAV_ITEMS.map(({ key, href }, i) => (
                  <motion.a
                    key={key}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i + 0.1 }}
                    className="
                      text-slate-200 hover:text-yellow-400
                      text-base font-medium
                      transition-colors duration-200
                      border-b border-zinc-800 pb-4
                    "
                  >
                    {t(key)}
                  </motion.a>
                ))}
              </nav>

              {/* Language switcher */}
              <motion.div
                className="flex gap-5 mt-6 mb-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {LOCALES.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => switchLocale(loc)}
                    className={`
                      font-bold uppercase text-sm tracking-widest transition-colors duration-200
                      ${locale === loc
                        ? 'text-yellow-400'
                        : 'text-slate-500 hover:text-slate-300'}
                    `}
                  >
                    {loc}
                  </button>
                ))}
              </motion.div>

              {/* Social icons */}
              <motion.div
                className="flex gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
              >
                {[
                  { Icon: TelegramIcon,  href: '#', label: 'Telegram'  },
                  { Icon: InstagramIcon, href: '#', label: 'Instagram' },
                  { Icon: FacebookIcon,  href: '#', label: 'Facebook'  },
                ].map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="
                      w-10 h-10 rounded-full
                      bg-yellow-500/15 text-yellow-500
                      flex items-center justify-center
                      hover:bg-yellow-500/30 hover:text-yellow-300
                      transition-colors duration-200
                    "
                  >
                    <Icon />
                  </a>
                ))}
              </motion.div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
