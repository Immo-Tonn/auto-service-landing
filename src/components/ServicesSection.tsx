'use client'
// src/components/ServicesSection.tsx

import { useState, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import Dialog from './ui/Dialog'

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
  // Clickable cards are real buttons (keyboard + screen readers)
  const Wrapper: React.ElementType = hasSlides ? 'button' : 'div'
  return (
    <Wrapper
  {...(hasSlides ? { type: 'button', onClick } : {})}
  className={`
    group relative flex flex-col w-full max-w-[16.25rem]
    transition-transform duration-300
    ${hasSlides ? 'cursor-pointer hover:-translate-y-1' : 'cursor-default opacity-60'}
  `}
>
  {/* Карточка — градиент ярче и теплее */}
  <div
    className="rounded-sm flex flex-col flex-1 min-h-[17.5rem]"
    style={{
      background:
        'linear-gradient(170deg, #090909 0%, #1c1200 28%, #4a3000 56%, #7a5000 78%, #9a6800 100%)',
    }}
  >
    <div className="flex flex-col flex-1 px-6 pt-8 pb-5">
      <div className="flex-1 flex items-center justify-center">
        <h3
          className="text-white font-bold text-center uppercase text-[0.8125rem] tracking-[0.13em] leading-[1.9]"
          style={{ textShadow: '0 0 22px rgba(255,255,255,0.4)' }}
        >
          {t(`cards.${id}.title`)}
        </h3>
      </div>
      <div className="text-center mt-5">
        <span className="text-xs tracking-[0.2em] uppercase font-semibold transition-colors duration-300 text-yellow-500/90 group-hover:text-yellow-300 group-focus-visible:text-yellow-300">
          {t('more')}
        </span>
      </div>
    </div>
  </div>

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
</Wrapper>
 )
}

function SliderContent({ serviceId, slides }: { serviceId: string; slides: string[] }) {
  const t = useTranslations('services')
  const tc = useTranslations('common')
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
    <>
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
            <button type="button" onClick={prev} aria-label={tc('prevImage')}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-yellow-400/90 text-white hover:text-zinc-900 flex items-center justify-center transition-colors duration-200">
              <svg aria-hidden="true" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          )}

          {current < slides.length - 1 && (
            <button type="button" onClick={next} aria-label={tc('nextImage')}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-yellow-400/90 text-white hover:text-zinc-900 flex items-center justify-center transition-colors duration-200">
              <svg aria-hidden="true" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
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
              <button key={i} type="button" onClick={() => goTo(i, i > current ? 1 : -1)}
                aria-current={i === current ? 'true' : undefined}
                className={`rounded-full transition-all duration-200 ${i === current ? 'w-5 h-2 bg-yellow-400' : 'w-2 h-2 bg-zinc-600 hover:bg-zinc-400'}`}
                aria-label={tc('imageN', { n: i + 1 })} />
            ))}
          </div>
        </div>
    </>
  )
}

export default function ServicesSection() {
  const t = useTranslations('services')
  const [activeId, setActiveId] = useState<string | null>(null)
  const [sliderOpen, setSliderOpen] = useState(false)
  const activeService = SERVICES.find((s) => s.id === activeId)

  return (
    <section id="services" className="bg-zinc-950 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-section font-bold text-center text-white mb-14 tracking-wide">
          {t('sectionTitle')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 justify-items-center">
          {SERVICES.map((service) => (
            <ServiceCard key={service.id} id={service.id}
              hasSlides={service.slides.length > 0}
              onClick={() => { setActiveId(service.id); setSliderOpen(true) }} />
          ))}
        </div>
      </div>
      <Dialog
        open={sliderOpen && !!activeService}
        onClose={() => setSliderOpen(false)}
        ariaLabel={activeService ? t(`cards.${activeService.id}.title`) : undefined}
        backdropClassName="bg-black/50"
        panelClassName="relative w-full max-w-3xl bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden shadow-2xl"
        closeClassName="absolute top-3 right-4 z-10 text-slate-400 hover:text-yellow-400 text-3xl leading-none transition-colors duration-200"
      >
        {activeService && activeService.slides.length > 0 && (
          <SliderContent key={activeService.id} serviceId={activeService.id} slides={activeService.slides} />
        )}
      </Dialog>
    </section>
  )
}