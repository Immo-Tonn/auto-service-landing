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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 text-center">
          <h1 className="
            font-bold 
            mb-4 
            leading-tight
            text-2xl 
            sm:text-3xl 
            md:text-4xl 
            lg:text-5xl
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
        {/* <div className="w-full"> */}
          <Image
            src="/E500.jpg"
            alt="Auto Service Workshop"
            width={1920}
            height={1080}
            // priority
            className="w-full h-auto block"
          />
        {/* </div> */}
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

// export default function Home() {
//   const t = useTranslations()

//   return (
//     <main className="flex flex-col min-h-screen bg-zinc-50">
//       {/* Hero section */}
//       <section className="relative text-center text-white">
//         <Image
//           src="/E500.jpg"
//           alt="Auto Service Workshop"
//           width={1920}
//           height={1080}
//           className="w-full h-auto block"
//           priority
//         />
//         <div className="absolute inset-x-0 top-0 pt-16 pb-24 px-10 bg-gradient-to-b from-black/70 to-transparent">
//           <h1 className="text-5xl font-bold mb-4">{t('hero.title')}</h1>
//           <p className="text-xl text-slate-300">{t('hero.subtitle')}</p>
//         </div>
//       </section>

//       {/* Booking form */}
//       <section className="py-16 max-w-3xl mx-auto px-4 w-full">
//         <h2 className="text-3xl font-bold text-center mb-8 text-slate-800">
//           {t('booking.title')}
//         </h2>
//         <div className="bg-white rounded-xl shadow-sm p-6">
//           <BookingForm />
//         </div>
//       </section>
//     </main>
//   )
// }