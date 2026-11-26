'use client'
// src/components/HeroButtons.tsx

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import BookingForm from './BookingForm'
import CallbackForm from './CallbackForm'
import Dialog from './ui/Dialog'
import SuccessDialog from './ui/SuccessDialog'

type ModalType = 'booking' | 'callback' | null

// ─── Main component ────────────────────────────────────────────────────────────

export default function HeroButtons() {
  const t = useTranslations()

  const [modal, setModal]           = useState<ModalType>(null)
  const [callbackSuccess, setCallbackSuccess] = useState(false)
  const [bookingSuccess, setBookingSuccess]   = useState(false)

  const closeModal = () => setModal(null)

  return (
    <>
      {/* ── CTA Buttons ─────────────────────────────────────────────────── */}
      <div className="
        flex flex-col sm:flex-row
        gap-4 justify-center
        mt-8 px-4
        max-w-2xl mx-auto
      ">
        <button
          onClick={() => setModal('booking')}
          className="
            flex-1
            border-2 border-yellow-400
            text-yellow-400 font-bold
            py-4 px-8
            text-base uppercase tracking-wider
            hover:bg-yellow-400 hover:text-zinc-900
            transition-colors duration-200
          "
        >
          {t('hero.bookingBtn')}
        </button>

        <button
          onClick={() => setModal('callback')}
          className="
            flex-1
            border-2 border-yellow-400
            text-yellow-400 font-bold
            py-4 px-8
            text-base uppercase tracking-wider
            hover:bg-yellow-400 hover:text-zinc-900
            transition-colors duration-200
          "
        >
          {t('hero.callbackBtn')}
        </button>
      </div>

      {/* ── Floating icons (visible when hero scrolls off screen) ───────── */}
      <button
        onClick={() => setModal('booking')}
        aria-label={t('hero.bookingBtn')}
        className="
          fixed bottom-36 left-4 z-50
          max-[460px]:bottom-18
          rounded-full overflow-hidden cursor-pointer
          shadow-[0_0_15px_4px_rgba(255,255,255,0.6)]
          hover:shadow-[0_0_20px_6px_rgba(250,204,21,0.7)]
          transition-shadow duration-300
        "
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
  <img 
    src="/icons/calendar.svg" 
    alt="" 
    width={90} 
    height={90} 
    className="
    max-[460px]:w-[60px] max-[460px]:h-[60px]
    max-[768px]:w-[75px] max-[768px]:h-[75px]" 
  /> 

      </button>

      <button
        onClick={() => setModal('callback')}
        aria-label={t('hero.callbackBtn')}
        className="
          fixed bottom-36 right-4 z-50
          max-[460px]:bottom-18
          rounded-full overflow-hidden cursor-pointer
          shadow-[0_0_15px_4px_rgba(255,255,255,0.6)]
          hover:shadow-[0_0_20px_6px_rgba(250,204,21,0.7)]
          transition-shadow duration-300
        "
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/phone.svg" 
          alt="" 
          width={90} 
          height={90}
          className="
            max-[460px]:w-[60px] max-[460px]:h-[60px]
            max-[768px]:w-[75px] max-[768px]:h-[75px]" 
        /> 
      </button>

      {/* ── Modals (native <dialog>) ────────────────────────────────────── */}
      <Dialog
        open={modal === 'booking'}
        onClose={closeModal}
        title={t('booking.title')}
      >
        <BookingForm
          onSuccess={() => {
            closeModal()
            setBookingSuccess(true)
            setTimeout(() => setBookingSuccess(false), 5000)
          }}
        />
      </Dialog>

      <Dialog
        open={modal === 'callback'}
        onClose={closeModal}
        title={t('callback.title')}
      >
        <CallbackForm
          onSuccess={() => {
            closeModal()
            setCallbackSuccess(true)
            setTimeout(() => setCallbackSuccess(false), 4000)
          }}
        />
      </Dialog>

      <SuccessDialog
        open={bookingSuccess}
        onClose={() => setBookingSuccess(false)}
        message={t('booking.success')}
        confirmation={t('booking.confirmation')}
        clickToClose={t('contactSection.modal.clickToClose')}
      />

      <SuccessDialog
        open={callbackSuccess}
        onClose={() => setCallbackSuccess(false)}
        message={t('callback.success')}
        clickToClose={t('contactSection.modal.clickToClose')}
      />
    </>
  )
}