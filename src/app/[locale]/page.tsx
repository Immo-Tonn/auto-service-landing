// src/app/[locale]/page.tsx
import { use } from 'react'
import { setRequestLocale } from 'next-intl/server'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HeroButtons from '@/components/HeroButtons'
import ServicesSection from '@/components/ServicesSection'
import AboutSection from '@/components/AboutSection'
import ContactSection from '@/components/ContactSection'

export default function Home({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = use(params)
  setRequestLocale(locale)
  const t = useTranslations()

  return (
    <>
      {/* Skip link: first Tab stop. Always styled, parked above the
          viewport and slides in on focus (no sr-only/not-sr-only conflicts). */}
      <a
        href="#main"
        className="
          fixed top-2 left-2 z-[100]
          -translate-y-[200%] focus:translate-y-0
          bg-yellow-400 text-zinc-900 font-bold
          px-4 py-2 rounded shadow-lg
          transition-transform duration-200
        "
      >
        {t('common.skipToContent')}
      </a>

      <Header />

      <main id="main" tabIndex={-1} className="flex flex-col min-h-screen bg-zinc-900 outline-none">

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section id="hero" className="bg-black text-white">

          {/* Hero image */}

          <div
  className="
    -translate-y-[30px]
    sm:-translate-y-[35px]
    md:-translate-y-[45px]
    lg:-translate-y-[60px]
  "
>
  <Image
    src="/E500.avif"
    alt={t('hero.imgAlt')}
    width={3840}
    height={1664}
    loading="eager"
    fetchPriority="high"
    sizes="100vw"
    className="block h-auto w-full"
  />
</div>

          {/* Title + subtitle */}
          <div className="
            relative z-10
            max-w-4xl mx-auto
            px-4 sm:px-6 lg:px-8
            pt-0 pb-4
            text-center
          ">
            <h1 className="
              font-bold mb-4 leading-tight
              text-hero
            ">
              {t('hero.title')}
            </h1>
            <p className="
              text-slate-300
              text-hero-sub
            ">
              {t('hero.subtitle')}
            </p>
          </div>

          {/* CTA buttons + modals */}
          <div className="pb-10">
            <HeroButtons />
          </div>

        </section>

        {/* ── Services ──────────────────────────────────────────────────── */}        
        <ServicesSection />

        {/* ── About ─────────────────────────────────────────────────────── */}
        <AboutSection/>

        {/* ── Contact ───────────────────────────────────────────────────── */}
        <ContactSection />

      </main>

      <Footer />
    </>
  )
}
