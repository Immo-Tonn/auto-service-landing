import { useTranslations } from 'next-intl'
import BookingForm from '@/components/BookingForm'

export default function Home() {
  const t = useTranslations()

  return (
    <main className="flex flex-col min-h-screen bg-zinc-50">
      {/* Hero section */}
      <section className="bg-slate-900 text-white py-20 px-10 text-center">
        <h1 className="text-5xl font-bold mb-4">{t('hero.title')}</h1>
        <p className="text-xl text-slate-300 mb-8">{t('hero.subtitle')}</p>
      </section>

      {/* Booking form */}
      <section className="py-16 max-w-3xl mx-auto px-4 w-full">
        <h2 className="text-3xl font-bold text-center mb-8 text-slate-800">
          {t('booking.title')}
        </h2>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <BookingForm />
        </div>
      </section>
    </main>
  )
}