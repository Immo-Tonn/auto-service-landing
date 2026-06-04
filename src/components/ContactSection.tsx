'use client'
// src/components/ContactSection.tsx

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Modal shell ───────────────────────────────────────────────────────────────

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
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-yellow-400 text-2xl leading-none transition-colors duration-200"
          aria-label="Schließen"
        >
          ×
        </button>
        <h2 className="text-xl font-bold text-slate-100 mb-6">{title}</h2>
        {children}
      </motion.div>
    </motion.div>
  )
}

// ─── Success overlay ───────────────────────────────────────────────────────────

interface SuccessProps {
  message: string
  confirmation: string
  clickToClose: string
  onClose: () => void
}

function SuccessOverlay({ message, confirmation, clickToClose, onClose }: SuccessProps) {
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
        <p className="text-slate-200 text-base font-semibold">{message}</p>
        <p className="text-slate-400 text-sm mt-2">{confirmation}</p>
        <p className="text-xs text-slate-500 mt-4">{clickToClose}</p>
      </div>
    </motion.div>
  )
}

// ─── Contact form ──────────────────────────────────────────────────────────────

function ContactForm({ onSuccess }: { onSuccess: () => void }) {
  const t = useTranslations('contactSection')
  const locale = useLocale()

  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isValid =
    form.name.trim() &&
    form.email.trim() &&
    form.phone.trim() &&
    form.message.trim()

  const handleReset = () => {
    setForm({ name: '', email: '', phone: '', message: '' })
    setError('')
  }

  const handleSubmit = async () => {
    if (!isValid) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, locale }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || t('modal.error'))
        return
      }

      onSuccess()
    } catch {
      setError(t('modal.error'))
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full bg-transparent border border-slate-500 text-slate-200 placeholder-slate-500 rounded px-4 py-3 text-sm focus:outline-none focus:border-yellow-400 transition-colors duration-200'

  return (
    <div className="flex flex-col gap-3 dark-form">
      <input
        id="contact-name"
        name="name"
        type="text"
        autoComplete="name"
        placeholder={t('modal.name')}
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className={inputClass}
      />
      <input
        id="contact-email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder={t('modal.email')}
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className={inputClass}
      />
      <input
        id="contact-phone"
        name="phone"
        type="tel"
        autoComplete="tel"
        placeholder={t('modal.phone')}
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        className={inputClass}
      />
      <div className="relative">
        <textarea
          id="contact-message"
          name="message"
          placeholder={t('modal.message')}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value.slice(0, 600) })}
          rows={4}
          className={`${inputClass} resize-none`}
        />
        <span className="absolute bottom-3 right-3 text-xs text-slate-500 pointer-events-none">
          {form.message.length}/600
        </span>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex gap-3 mt-1">
        <button
          onClick={handleReset}
          className="flex-1 border border-slate-500 text-slate-400 font-medium py-2.5 px-4 rounded hover:border-slate-300 hover:text-slate-200 transition-colors duration-200"
        >
          {t('modal.reset')}
        </button>
        <button
          onClick={handleSubmit}
          disabled={!isValid || loading}
          className="flex-1 border-2 border-yellow-400 text-yellow-400 font-bold py-2.5 px-4 rounded uppercase tracking-wider hover:bg-yellow-400 hover:text-zinc-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {loading ? '...' : t('modal.submit')}
        </button>
      </div>
    </div>
  )
}

// ─── Main section ──────────────────────────────────────────────────────────────

export default function ContactSection() {
  const t = useTranslations('contactSection')

  const [modalOpen, setModalOpen] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSuccess = () => {
    setModalOpen(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 4000)
  }

  return (
    <section id="contact">

      {/* ── Upper CTA block ─────────────────────────────────────────────── */}
      <div className="bg-zinc-950 py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            {t('headline')}
          </h2>
          <p className="text-yellow-400 font-bold text-lg sm:text-xl mb-8">
            {t('subheadline')}
          </p>
          <p className="text-slate-300 font-semibold mb-3">{t('callUs')}</p>
          <p className="text-white font-bold text-xl mb-1">{t('phone1')}</p>
          <p className="text-white font-bold text-xl mb-8">{t('phone2')}</p>
          <p className="text-slate-400 text-sm mb-8 max-w-md mx-auto leading-relaxed">
            {t('orClick')}
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="border-2 border-yellow-400 text-yellow-400 font-bold px-10 py-3 text-sm uppercase tracking-wider hover:bg-yellow-400 hover:text-zinc-900 transition-colors duration-200"
          >
            {t('btn')}
          </button>
        </div>
      </div>

      {/* ── Map ─────────────────────────────────────────────────────────── */}
      <div className="relative h-[420px] sm:h-[500px]">
        <iframe
          src="https://www.openstreetmap.org/export/embed.html?bbox=13.3149%2C52.4928%2C13.3269%2C52.4988&layer=mapnik&marker=52.4958%2C13.3209"
          className="w-full h-full border-0"
          title="Auto Service location"
          loading="lazy"
        />

        {/* Info card overlay */}
        <div className="absolute bottom-4 left-4 bg-zinc-900/95 backdrop-blur-sm rounded-xl p-5 max-w-xs shadow-2xl border border-zinc-700">
          <div className="flex items-start gap-3 mb-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/pin.svg" alt="" width={20} height={20} className="mt-0.5 shrink-0" />
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">
                {t('mapAddressLabel')}
              </p>
              <p className="text-white text-sm font-medium">{t('mapAddressStreet')}</p>
              <p className="text-white text-sm font-medium">{t('mapAddressCity')}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 mb-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/phone_orange.svg" alt="" width={24} height={24} className="mt-[-2px] shrink-0" />
            <div>
              <p className="text-white text-sm">{t('mapPhone1')}</p>
              <p className="text-white text-sm">{t('mapPhone2')}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/email_128.svg" alt="" width={20} height={20} className="mt-0.5 shrink-0" />
            <p className="text-white text-sm">{t('mapEmail')}</p>
          </div>

          <div className="flex gap-2 mt-4 pt-4 border-t border-zinc-700">
            <a
              href="https://www.openstreetmap.org/?mlat=52.4958&mlon=13.3209#map=17/52.4958/13.3209"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center text-xs font-semibold text-zinc-300 border border-zinc-600 rounded py-1.5 hover:border-yellow-400 hover:text-yellow-400 transition-colors duration-200"
            >
              {t('mapOpenLink')}
            </a>
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=D%C3%BCsseldorfer+Str.+67%2C+10719+Berlin"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center text-xs font-semibold text-zinc-900 bg-yellow-400 rounded py-1.5 hover:bg-yellow-300 transition-colors duration-200"
            >
              {t('mapDirections')}
            </a>
          </div>
        </div>
      </div>

      {/* ── Modal + success overlay ──────────────────────────────────────── */}
      <AnimatePresence>
        {modalOpen && (
          <Modal
            key="contact-modal"
            onClose={() => setModalOpen(false)}
            title={t('modal.title')}
          >
            <ContactForm onSuccess={handleSuccess} />
          </Modal>
        )}
        {success && (
          <SuccessOverlay
            key="contact-success"
            message={t('modal.success')}
            confirmation={t('modal.confirmation')}
            clickToClose={t('modal.clickToClose')}
            onClose={() => setSuccess(false)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
