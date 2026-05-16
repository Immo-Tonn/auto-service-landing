'use client'
// src/components/ServicesSection.tsx

import { useState, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'

const SERVICES = [
  {
    id: 'maintenance',
    slides: ['/maintenance_1.webp', '/maintenance_2.webp', '/maintenance_4_en.jfif'],
  },
  { id: 'suspension',  slides: [] },
  {
    id: 'engine',
    slides: ['/computer_dignost.jpg', '/engineelectric.jpg', '/engine_overhaul.jpg'],
  },
  { id: 'steering',    slides: [] },
  { id: 'aircon',      slides: [] },
  { id: 'alignment',   slides: [] },
  { id: 'tires',       slides: [] },
  { id: 'injector',    slides: [] },
  { id: 'diagnostics', slides: [] },
]

function ServiceCard({ id, hasSlides, onClick }: { id: string; hasSlides: boolean; onClick: () => void }) {
  const t = useTranslations('services')
  return (
    <div
  onClick={hasSlides ? onClick : undefined}
  className={`
    group relative flex flex-col
    transition-transform duration-300
    ${hasSlides ? 'cursor-pointer hover:-translate-y-1' : 'cursor-default opacity-60'}
  `}
>
  {/* Карточка — градиент ярче и теплее */}
  <div
    className="rounded-sm flex flex-col flex-1"
    style={{
      background:
        'linear-gradient(170deg, #090909 0%, #1c1200 28%, #4a3000 56%, #7a5000 78%, #9a6800 100%)',
      minHeight: '280px',
      width: '260px',
    }}
  >
    <div className="flex flex-col flex-1 px-6 pt-8 pb-5">
      <div className="flex-1 flex items-center justify-center">
        <h3
          className="text-white font-bold text-center uppercase text-[11px] sm:text-xs lg:text-[13px] tracking-[0.13em] leading-[1.9]"
          style={{ textShadow: '0 0 22px rgba(255,255,255,0.4)' }}
        >
          {t(`cards.${id}.title`)}
        </h3>
      </div>
      <div className="text-center mt-5">
        <span className="text-[9px] tracking-[0.3em] uppercase font-medium transition-colors duration-300 text-yellow-600/60 group-hover:text-yellow-400/90">
          {t('more')}
        </span>
      </div>
    </div>
  </div>

  {/* Полоска — шире карточки, ярче */}
  <div
    style={{
      height: '7px',
      marginLeft: '-10px',
      marginRight: '-10px',
      background:
        'linear-gradient(90deg, #8b6200 0%, #f5c000 25%, #ffe566 50%, #f5c000 75%, #8b6200 100%)',
      boxShadow:
        '0 0 28px 9px rgba(255,210,0,0.9), 0 0 60px 20px rgba(255,180,0,0.5)',
      borderRadius: '0 0 4px 4px',
    }}
  />
</div>
 )
}

function SliderModal({ serviceId, slides, onClose }: { serviceId: string; slides: string[]; onClose: () => void }) {
  const t = useTranslations('services')
  const captions = t.raw(`cards.${serviceId}.slides`) as string[]
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const scrollRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number | null>(null)

  const goTo = (index: number, dir: number) => { setDirection(dir); setCurrent(index) }
  const prev = () => { if (current > 0) goTo(current - 1, -1) }
  const next = () => { if (current < slides.length - 1) goTo(current + 1, 1) }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(dx) < 50) return
    const el = scrollRef.current
    if (!el) return
    if (dx < 0 && current < slides.length - 1) {
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 4) next()
    } else if (dx > 0 && current > 0) {
      if (el.scrollLeft <= 4) prev()
    }
  }

  const variants = {
    enter:  (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:   (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.25 }}
        className="relative w-full max-w-3xl bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose}
          className="absolute top-3 right-4 z-10 text-slate-400 hover:text-yellow-400 text-3xl leading-none transition-colors duration-200">
          ×
        </button>

        <div
          className="relative overflow-hidden"
          style={{ height: '420px' }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence custom={direction} mode="wait">
            <motion.div key={current} custom={direction} variants={variants}
              initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="absolute inset-0"
            >
              <div
                ref={scrollRef}
                className="w-full h-full overflow-x-auto overflow-y-hidden"
                style={{ touchAction: 'pan-x' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slides[current]}
                  alt={captions?.[current] ?? ''}
                  className="h-full w-auto max-w-none sm:w-full sm:object-cover"
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {current > 0 && (
            <button onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-yellow-400/90 text-white hover:text-zinc-900 flex items-center justify-center transition-colors duration-200">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          )}

          {current < slides.length - 1 && (
            <button onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-yellow-400/90 text-white hover:text-zinc-900 flex items-center justify-center transition-colors duration-200">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}
        </div>

        <div className="px-6 py-5 bg-zinc-900">
          <p className="text-slate-200 text-sm font-medium text-center min-h-[20px]">
            {captions?.[current] ?? ''}
          </p>
          <div className="flex justify-center gap-2 mt-3">
            {slides.map((_, i) => (
              <button key={i} onClick={() => goTo(i, i > current ? 1 : -1)}
                className={`rounded-full transition-all duration-200 ${i === current ? 'w-5 h-2 bg-yellow-400' : 'w-2 h-2 bg-zinc-600 hover:bg-zinc-400'}`}
                aria-label={`Bild ${i + 1}`} />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function ServicesSection() {
  const t = useTranslations('services')
  const [activeId, setActiveId] = useState<string | null>(null)
  const activeService = SERVICES.find((s) => s.id === activeId)

  return (
    <section id="services" className="bg-zinc-950 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-14 tracking-wide">
          {t('sectionTitle')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 justify-items-center">
          {SERVICES.map((service) => (
            <ServiceCard key={service.id} id={service.id}
              hasSlides={service.slides.length > 0}
              onClick={() => setActiveId(service.id)} />
          ))}
        </div>
      </div>
      <AnimatePresence>
        {activeId && activeService && activeService.slides.length > 0 && (
          <SliderModal key={activeId} serviceId={activeId}
            slides={activeService.slides} onClose={() => setActiveId(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}