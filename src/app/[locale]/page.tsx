import { useTranslations } from 'next-intl'
import Image from 'next/image'
import BookingForm from '@/components/BookingForm'

export default function Home() {
  const t = useTranslations()
  return (
    <main className="flex flex-col min-h-screen bg-zinc-50">

      {/* Hero */}
      <section className="bg-black text-white">
        
        {/* Text block */}
        {/* <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 text-center"> */}
        <div className="relative z-10
                        max-w-8xl mx-auto
                        px-4 sm:px-6 lg:px-8
                        pt-6
                        pb-0
                        text-center"
        >
          <h1 className="
            font-bold 
            mb-4 
            leading-tight
            text-2xl 
            sm:text-3xl 
            md:text-4xl 
            lg:text-4xl
          ">
            {t('hero.title')}
          </h1>

          <p className="
            text-slate-300
            text-sm 
            sm:text-base 
            md:text-lg 
            lg:text-xl
          ">
            {t('hero.subtitle')}
          </p>
        </div>

        {/* Image */}
        <div className="
        -mt-[30px]

        min-[588px]:-mt-[50px]
        min-[768px]:-mt-[70px]
        min-[900px]:-mt-[80px]
        min-[1070px]:-mt-[90px]
        min-[1270px]:-mt-[110px]
        min-[1440px]:-mt-[128px]">
          <Image
            src="/E500_conv.avif"
            alt="Auto Service Workshop"
            width={1920}
            height={1080}
            // priority
            className="w-full h-auto block"
          />
        </div>
      </section>

      {/* Booking */}
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
