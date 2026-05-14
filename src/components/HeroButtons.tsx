'use client'
// src/components/HeroButtons.tsx

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import BookingForm from './BookingForm'
import CallbackForm from './CallbackForm'

type ModalType = 'booking' | 'callback' | null

// ─── Reusable modal shell ──────────────────────────────────────────────────────

interface ModalProps {
  onClose: () => void
  title: string
  children: React.ReactNode
}

function Modal({ onClose, title, children }: ModalProps) {
  return (
    <motion.div
      key="backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1,    y: 0  }}
        exit={{    opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.25 }}
        className="
          relative w-full max-w-lg
          bg-zinc-900 border border-zinc-700
          rounded-xl shadow-2xl
          p-8
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="
            absolute top-4 right-4
            text-slate-500 hover:text-yellow-400
            text-2xl leading-none transition-colors duration-200
          "
          aria-label="Schließen"
        >
          ×
        </button>

        {/* Title */}
        <h2 className="text-xl font-bold text-slate-100 mb-6">
          {title}
        </h2>

        {children}
      </motion.div>
    </motion.div>
  )
}

// ─── Success overlay ───────────────────────────────────────────────────────────

function SuccessOverlay({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 cursor-pointer"
      onClick={onClose}
    >
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl px-10 py-10 text-center max-w-sm mx-4">
        <div className="text-5xl mb-4">✅</div>
        <p className="text-slate-200 text-base">{message}</p>
        <p className="text-xs text-slate-500 mt-4">Klicken Sie irgendwo, um zu schließen</p>
      </div>
    </motion.div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function HeroButtons() {
  const t = useTranslations()

  const [modal, setModal]           = useState<ModalType>(null)
  const [callbackSuccess, setCallbackSuccess] = useState(false)

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
          rounded-full overflow-hidden cursor-pointer
          shadow-[0_0_15px_4px_rgba(255,255,255,0.6)]
          hover:shadow-[0_0_20px_6px_rgba(250,204,21,0.7)]
          transition-shadow duration-300
        "
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/calendar.svg" alt="Termin buchen" width={90} height={90} />
      </button>

      <button
        onClick={() => setModal('callback')}
        aria-label={t('hero.callbackBtn')}
        className="
          fixed bottom-36 right-4 z-50
          rounded-full overflow-hidden cursor-pointer
          shadow-[0_0_15px_4px_rgba(255,255,255,0.6)]
          hover:shadow-[0_0_20px_6px_rgba(250,204,21,0.7)]
          transition-shadow duration-300
        "
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/phone.svg" alt="Rückruf anfordern" width={90} height={90} />
      </button>

      {/* ── Modals ──────────────────────────────────────────────────────── */}
      <AnimatePresence>

        {/* Booking modal */}
        {modal === 'booking' && (
          <Modal
            key="booking-modal"
            onClose={closeModal}
            title={t('booking.title')}
          >
            {/* BookingForm управляет своим success-overlay самостоятельно */}
            <BookingForm />
          </Modal>
        )}

        {/* Callback modal */}
        {modal === 'callback' && (
          <Modal
            key="callback-modal"
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
          </Modal>
        )}

        {/* Callback success overlay */}
        {callbackSuccess && (
          <SuccessOverlay
            key="callback-success"
            message={t('callback.success')}
            onClose={() => setCallbackSuccess(false)}
          />
        )}

      </AnimatePresence>
    </>
  )
}