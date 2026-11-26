import { use } from 'react'
import { setRequestLocale } from 'next-intl/server'
import { useTranslations } from 'next-intl'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const SECTIONS = ['controller', 'data', 'cookies', 'maps', 'rights'] as const

export default function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = use(params)
  setRequestLocale(locale)
  const t = useTranslations('privacy')

  return (
    <>
      <Header />

      <main className="min-h-screen bg-zinc-900 text-slate-300">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-wide text-white mb-6">
            {t('title')}
          </h1>

          <p className="border border-yellow-400/40 bg-yellow-400/5 text-yellow-300 text-sm px-4 py-3 mb-12">
            {t('disclaimer')}
          </p>

          {SECTIONS.map((key) => (
            <section key={key} id={key} className="mb-10 scroll-mt-24">
              <h2 className="text-xl font-bold text-white mb-3">
                {t(`sections.${key}.title`)}
              </h2>
              <p className="leading-relaxed whitespace-pre-line text-slate-400">
                {t(`sections.${key}.body`)}
              </p>
            </section>
          ))}
        </div>
      </main>

      <Footer />
    </>
  )
}
