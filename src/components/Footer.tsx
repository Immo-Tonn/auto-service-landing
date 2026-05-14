import { useTranslations } from 'next-intl'
import Link from 'next/link'

// ─── SVG Icons ────────────────────────────────────────────────────────────────

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

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Footer() {
  const t = useTranslations('footer')
  const year = new Date().getFullYear()

  const navLinks = [
    { key: 'home',     href: '#hero'     },
    { key: 'services', href: '#services' },
    { key: 'about',    href: '#about'    },
    { key: 'contact',  href: '#contact'  },
  ]

  const legalLinks = [
    { key: 'privacy',      href: '/privacy'       },
    { key: 'legalNotice',  href: '/legal-notice'  },
  ]

  const socialLinks = [
    { Icon: TelegramIcon,  href: '#', label: 'Telegram'  },
    { Icon: InstagramIcon, href: '#', label: 'Instagram' },
    { Icon: FacebookIcon,  href: '#', label: 'Facebook'  },
  ]

  return (
    <footer className="bg-zinc-900 text-slate-300 w-full">

      {/* ── UPPER BLOCK ───────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-10">

          {/* Left zone — Logo + tagline */}
          <div className="flex flex-col items-start md:max-w-[220px]">
            <a href="#hero" className="mb-5" aria-label="AutoService — zur Startseite">
              <div className="border-2 border-yellow-400 text-yellow-400 font-black tracking-widest uppercase px-3 py-1 text-lg">
                AutoService
              </div>
            </a>
            <p className="text-sm text-slate-400 leading-relaxed mb-1">
              {t('tagline1')}
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t('tagline2')}
            </p>
          </div>

          {/* Right zone — 3 columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-12 gap-y-8 w-full md:w-auto">

            {/* Column 1 — Navigation */}
            <nav aria-label={t('nav.title')}>
              <p className="text-slate-200 font-semibold text-sm mb-4 uppercase tracking-wider">
                {t('nav.title')}
              </p>
              <ul className="flex flex-col gap-2.5">
                {navLinks.map(({ key, href }) => (
                  <li key={key}>
                    <a
                      href={href}
                      className="text-sm text-slate-400 hover:text-yellow-400 transition-colors duration-200"
                    >
                      {t(`nav.${key}`)}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Column 2 — Legal + Socials */}
            <nav aria-label={t('legal.title')}>
              <p className="text-slate-200 font-semibold text-sm mb-4 uppercase tracking-wider">
                {t('legal.title')}
              </p>
              <ul className="flex flex-col gap-2.5">
                {legalLinks.map(({ key, href }) => (
                  <li key={key}>
                    <Link
                      href={href}
                      className="text-sm text-slate-400 hover:text-yellow-400 transition-colors duration-200"
                    >
                      {t(`legal.${key}`)}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Social icons */}
              <div className="flex gap-3 mt-6">
                {socialLinks.map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="
                      w-9 h-9 rounded-full
                      bg-zinc-700 text-slate-300
                      flex items-center justify-center
                      hover:bg-yellow-400 hover:text-zinc-900
                      transition-colors duration-200
                    "
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </nav>

            {/* Column 3 — Contact */}
            <address
              aria-label={t('contact.title')}
              itemScope
              itemType="https://schema.org/Organization"
              className="not-italic"
            >
              <p className="text-slate-200 font-semibold text-sm mb-4 uppercase tracking-wider"
                itemProp="name">
                {t('contact.title')}
              </p>
              <div className="flex flex-col gap-2.5">
                <a
                  href="tel:+491234567890"
                  itemProp="telephone"
                  className="text-sm text-slate-400 hover:text-yellow-400 transition-colors duration-200"
                >
                  {t('contact.phone')}
                </a>
                <a
                  href={`mailto:${t('contact.email')}`}
                  itemProp="email"
                  className="text-sm text-slate-400 hover:text-yellow-400 transition-colors duration-200"
                >
                  {t('contact.email')}
                </a>
                <p className="text-sm text-slate-500 mt-1">
                  {t('contact.hours')}
                </p>
              </div>
            </address>

          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ────────────────────────────────────────────────────── */}
      <div className="border-t border-zinc-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex justify-center items-center">
          <span className="text-xs text-slate-500 text-center">
            {t('copyright', { year })}
            <Link
              href="https://labrity.com"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="hover:text-yellow-400 transition-colors duration-200"
              title="LABRITY – Web Design & Development"
            >
              LABRITY
            </Link>
          </span>
        </div>
      </div>

    </footer>
  )
}
