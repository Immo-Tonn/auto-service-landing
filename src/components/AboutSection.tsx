'use client'
// src/components/AboutSection.tsx
import { useState, useRef } from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

const STATS = [
  { valueKey: 'stat1Value', labelKey: 'stat1Label' },
  { valueKey: 'stat2Value', labelKey: 'stat2Label' },
  { valueKey: 'stat3Value', labelKey: 'stat3Label' },
  { valueKey: 'stat4Value', labelKey: 'stat4Label' },
]

const GALLERY = [
  { src: '/mainhall.JPG',    alt: 'photo1', unopt: false },
  { src: '/mechaniker.jfif', alt: 'photo2', unopt: true  },
  { src: '/geometry.png',    alt: 'photo3', unopt: false },
  { src: '/office.JPG',      alt: 'photo5', unopt: false },
  { src: '/visitors.png',    alt: 'photo4', unopt: false },
]

export default function AboutSection() {
  const t = useTranslations('about')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const touchStartX = useRef<number>(0)

  const goNext = () =>
    setLightboxIndex(i => i !== null ? (i + 1) % GALLERY.length : null)
  const goPrev = () =>
    setLightboxIndex(i => i !== null ? (i - 1 + GALLERY.length) % GALLERY.length : null)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(delta) > 50) {
      if (delta > 0) goNext()
      else goPrev()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') goNext()
    if (e.key === 'ArrowLeft')  goPrev()
    if (e.key === 'Escape')     setLightboxIndex(null)
  }

  return (
    <section id="about" className="bg-zinc-950 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── SPLIT: image + text ── */}
        <div className="relative max-w-[900px] mx-auto">

          {/* White card */}
          <div
            className="
              bg-white text-zinc-900 flex flex-col justify-center
              px-8 py-10
              min-[768px]:ml-[35%]
              min-[768px]:px-14 min-[768px]:py-14
              min-[938px]:h-[460px]
              max-[938px]:h-[447px]
              max-[920px]:h-[435px]
              max-[890px]:h-[420px]
              max-[875px]:h-[400px]
              max-[845px]:h-[380px]
              max-[815px]:h-[375px]
              max-[500px]:h-[460px]
            "
          >
            <h2 className="pl-4 text-3xl font-bold mb-6
                           max-[875px]:mb-2 text-zinc-900">{t('title')}</h2>
            <p className="text-zinc-700 text-base
                          leading-relaxed mb-4
                          max-[875px]:leading-snug max-[875px]:mb-2">{t('p1')}</p>
            <p className="text-zinc-700 text-base
                          leading-relaxed mb-4
                          max-[875px]:leading-snug max-[875px]:mb-2">{t('p2')}</p>
            <p className="text-zinc-700 text-base
                          leading-relaxed mb-4
                          max-[875px]:leading-snug">{t('p3')}</p>
          </div>

          {/* Photo — absolute */}
          <div
            className="absolute z-10 max-[768px]:hidden"
            style={{ left: '-44%', top: '50%', transform: 'translateY(-50%)', width: '135%' }}
          >
            <Image
              src="/about_us_12.png"
              alt={t('imgAlt')}
              width={520}
              height={680}
              className="w-full h-auto block"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-800 mt-12 rounded-lg overflow-hidden">
          {STATS.map(({ valueKey, labelKey }) => (
            <div key={valueKey} className="bg-zinc-900 flex flex-col items-center justify-center py-8 px-4 text-center">
              <span className="text-4xl lg:text-5xl font-black text-yellow-400 leading-none"
                style={{ textShadow: '0 0 25px rgba(250,204,21,0.4)' }}>
                {t(valueKey)}
              </span>
              <span className="text-slate-400 text-sm mt-2 uppercase tracking-wider">
                {t(labelKey)}
              </span>
            </div>
          ))}
        </div>

        {/* Gallery */}
        <div
          className="flex gap-3 mt-3 overflow-x-auto pb-2 snap-x snap-mandatory"
        >
          {GALLERY.map(({ src, alt, unopt }, index) => (
            <div
              key={src}
              className="relative flex-shrink-0 overflow-hidden rounded-sm group cursor-pointer snap-start"
              style={{ height: '220px', width: '280px' }}
              onClick={() => setLightboxIndex(index)}
            >
              <Image
                src={src}
                alt={t(alt)}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="280px"
                unoptimized={unopt}
              />
              <div className="absolute inset-0 bg-black/50 flex items-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-xs font-medium tracking-wide uppercase px-3 pb-3">
                  {t(alt)}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightboxIndex(null)}
          onKeyDown={handleKeyDown}
          tabIndex={-1}
        >
          <div
            className="relative w-full max-w-4xl mx-4 select-none"
            onClick={e => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Close */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute -top-10 right-0 text-white text-4xl leading-none z-10 hover:text-yellow-400 transition-colors"
              aria-label="Close"
            >
              &times;
            </button>

            {/* Image */}
            <div className="relative w-full" style={{ height: 'min(75vh, 600px)' }}>
              <Image
                src={GALLERY[lightboxIndex].src}
                alt={t(GALLERY[lightboxIndex].alt)}
                fill
                className="object-contain"
                unoptimized={GALLERY[lightboxIndex].unopt}
                sizes="(max-width: 768px) 100vw, 900px"
              />
            </div>

            {/* Prev */}
            <button
              onClick={e => { e.stopPropagation(); goPrev() }}
              className="absolute left-2 top-1/2 -translate-y-1/2
                         bg-black/60 hover:bg-yellow-400 text-white hover:text-zinc-900
                         w-10 h-10 rounded-full flex items-center justify-center
                         text-2xl transition-colors"
              aria-label="Previous"
            >
              ‹
            </button>

            {/* Next */}
            <button
              onClick={e => { e.stopPropagation(); goNext() }}
              className="absolute right-2 top-1/2 -translate-y-1/2
                         bg-black/60 hover:bg-yellow-400 text-white hover:text-zinc-900
                         w-10 h-10 rounded-full flex items-center justify-center
                         text-2xl transition-colors"
              aria-label="Next"
            >
              ›
            </button>

            {/* Counter */}
            <p className="text-center text-white/50 text-sm mt-3">
              {lightboxIndex + 1} / {GALLERY.length}
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
