// src/app/[locale]/page.tsx
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HeroButtons from '@/components/HeroButtons'
import ServicesSection from '@/components/ServicesSection'
import AboutSection from '@/components/AboutSection'
import ContactSection from '@/components/ContactSection'

export default function Home() {
  const t = useTranslations()

  return (
    <>
      <Header />

      <main className="flex flex-col min-h-screen bg-zinc-900">

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section id="hero" className="bg-black text-white">

          {/* Hero image */}
          <div className="mt-[-60px]">
            <Image
              src="/E500.avif"
              alt="Auto Service Workshop"
              width={1920}
              height={1080}
              priority
              className="w-full h-auto block"
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
              text-2xl sm:text-3xl md:text-4xl lg:text-4xl
            ">
              {t('hero.title')}
            </h1>
            <p className="
              text-slate-300
              text-sm sm:text-base md:text-lg lg:text-xl
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
