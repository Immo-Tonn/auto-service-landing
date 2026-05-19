// src/components/AboutSection.tsx
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
  { src: '/office.JPG',      alt: 'photo5', unpot: false },
  { src: '/visitors.png',    alt: 'photo4', unopt: false },
]

export default function AboutSection() {
  const t = useTranslations('about')

  return (
    <section id="about" className="bg-zinc-950 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

{/* ── SPLIT: image + text ── */}
<div className="relative max-w-[900px] mx-auto">

  {/* Белая карточка — в потоке, задаёт высоту wrapper-а */}
  <div
    className="
      bg-white text-zinc-900 flex flex-col justify-center
      px-8 py-10
      min-[768px]:ml-[35%]
      min-[768px]:px-14 min-[650px]:py-14
      max-[937px]:h-[447px]
      max-[920px]:h-[435px]
      max-[890px]:h-[420px]
      max-[875px]:h-[400px]
      max-[845px]:h-[380px]
      max-[815px]:h-[375px]
      // min-[938px]:h-[460px]
    "
    // style={{ minHeight: '460px' }}
  >
    <h2 className="pl-4 text-3xl font-bold mb-6 
                   max-[875px]:mb-2 max-[875px]:mb-2 text-zinc-900">{t('title')}</h2>
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

  {/* Image — absolute, без fill, явные размеры, центрирован по вертикали */}
  <div
    className="absolute z-10 max-[768px]:hidden"
    style={{
      left: '-44%',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '135%',
    }}
  >
    <Image
      src="/about_us_123.png"
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
          {GALLERY.map(({ src, alt, unopt }) => (
            <div key={src} className="relative overflow-hidden rounded-sm group" style={{ height: '220px' }}>
              <Image src={src} alt={t(alt)} fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, 25vw"
                unoptimized={unopt} />
              <div className="absolute inset-0 bg-black/50 flex items-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-xs font-medium tracking-wide uppercase px-3 pb-3">
                  {t(alt)}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}