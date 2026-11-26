'use client'
// src/components/AboutSection.tsx
import { useState, useRef } from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Dialog from './ui/Dialog'

const STATS = [
  { valueKey: 'stat1Value', labelKey: 'stat1Label' },
  { valueKey: 'stat2Value', labelKey: 'stat2Label' },
  { valueKey: 'stat3Value', labelKey: 'stat3Label' },
  { valueKey: 'stat4Value', labelKey: 'stat4Label' },
]

const GALLERY = [
  { src: '/mainhall.webp',   alt: 'photo1' },
  { src: '/mechaniker.webp', alt: 'photo2' },
  { src: '/geometry.webp',   alt: 'photo3' },
  { src: '/office.webp',     alt: 'photo5' },
  { src: '/visitors.webp',   alt: 'photo4' },
]

export default function AboutSection() {
  const t = useTranslations('about')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const openLightbox = (index: number) => { setLightboxIndex(index); setLightboxOpen(true) }
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
              px-8 py-8
              min-[768px]:ml-[35%]
              min-[768px]:pl-17
              min-[768px]:min-h-[440px]
              min-[768px]:py-3
              min-[768px]:pr-7 
              [@media(834px<=width<=880px)]:py-5
              min-[881px]:py-7
            "
          >
            <h2 className="pl-4 text-3xl font-bold mb-4">{t('title')}</h2>
            <p className="text-zinc-700 text-base leading-relaxed mb-2">{t('p1')}</p>
            <p className="text-zinc-700 text-base leading-relaxed mb-2">{t('p2')}</p>
            <p className="text-zinc-700 text-base leading-relaxed">{t('p3')}</p>
          </div>

          {/* Photo — absolute, overlaps the white card.
              Fixed width 22.5rem; right edge follows a linear fit of the old
              layout (container 720px -> 344px, 900px -> 394px).
              Replaces 12 pixel-tuned media queries. */}
          <div
            className="
              max-[768px]:hidden absolute z-10 top-1/2 -translate-y-1/2
              right-[calc(72%-8.875rem)]
              w-[22.5rem]
            "
          >
            <Image
              src="/about_us_124.png"
              alt={t('imgAlt')}
              width={398}
              height={564}
              sizes="360px"
              className="w-full h-auto block"
            />
          </div>
        </div>

        {/* Stats — 4 columns as soon as the block itself is wide enough */}
        <div className="@container mt-12">
          <dl className="grid grid-cols-2 @3xl:grid-cols-4 gap-px bg-zinc-800 rounded-lg overflow-hidden">
            {STATS.map(({ valueKey, labelKey }) => (
              <div key={valueKey} className="bg-zinc-900 flex flex-col-reverse items-center justify-end py-8 px-4 text-center">
                <dt className="text-slate-400 text-sm mt-2 uppercase tracking-wider">
                  {t(labelKey)}
                </dt>
                <dd className="text-stat font-black text-yellow-400 leading-none"
                  style={{ textShadow: '0 0 25px rgba(250,204,21,0.4)' }}>
                  {t(valueKey)}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Gallery */}
        <div
          className="flex gap-3 mt-3 overflow-x-auto pb-2 snap-x snap-mandatory"
        >
          {GALLERY.map(({ src, alt }, index) => (
            <button
              type="button"
              key={src}
              className="relative flex-shrink-0 overflow-hidden rounded-sm group cursor-pointer snap-start"
              style={{ height: '220px', width: '280px' }}
              onClick={() => openLightbox(index)}
            >
              <Image
                src={src}
                alt={t(alt)}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="280px"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-black/50 flex items-end opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300">
                <span className="text-white text-xs font-medium tracking-wide uppercase px-3 pb-3">
                  {t(alt)}
                </span>
              </div>
            </button>
          ))}
        </div>

      </div>

      {/* Lightbox (native <dialog>) */}
      <Dialog
        open={lightboxOpen && lightboxIndex !== null}
        onClose={() => setLightboxOpen(false)}
        ariaLabel={lightboxIndex !== null ? t(GALLERY[lightboxIndex].alt) : undefined}
        onKeyDown={handleKeyDown}
        backdropClassName="bg-black/90"
        panelClassName="relative w-full max-w-4xl mt-12 select-none"
        closeClassName="absolute -top-10 right-0 text-white text-4xl leading-none z-10 hover:text-yellow-400 transition-colors"
      >
        {lightboxIndex !== null && (
          <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
            {/* Image */}
            <div className="relative w-full" style={{ height: 'min(75vh, 600px)' }}>
              <Image
                src={GALLERY[lightboxIndex].src}
                alt={t(GALLERY[lightboxIndex].alt)}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 900px"
              />
            </div>

            {/* Prev */}
            <button
              type="button"
              onClick={goPrev}
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
              type="button"
              onClick={goNext}
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
        )}
      </Dialog>
    </section>
  )
}

