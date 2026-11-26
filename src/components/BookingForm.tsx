'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import BookingCalendar from './BookingCalendar'

interface Props {
  onSuccess: () => void
}

export default function BookingForm({ onSuccess }: Props) {
  const t = useTranslations('booking')
  const locale = useLocale()

  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isValid =
    selectedDate &&
    form.firstName &&
    form.lastName &&
    form.email &&
    form.phone

  const handleReset = () => {
    setForm({ firstName: '', lastName: '', email: '', phone: '' })
    setSelectedDate(null)
    setError('')
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!isValid) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, date: selectedDate, locale }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Fehler beim Buchen')
        return
      }

      onSuccess()
    } catch {
      setError('Netzwerkfehler. Bitte versuchen Sie es erneut.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 dark-form">
      <div>
        <h3 className="text-lg font-semibold text-slate-300 mb-3">
          {t('selectDate')}
        </h3>
        <BookingCalendar
          onDateSelect={setSelectedDate}
          selectedDate={selectedDate}
          refreshKey={0}
        />
      </div>

      {selectedDate && (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <label htmlFor="booking-firstName" className="sr-only">{t('firstName')}</label>
            <input
              id="booking-firstName"
              required
              name="firstName"
              type="text"
              autoComplete="given-name"
              placeholder={t('firstName')}
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="bg-transparent border border-slate-500 text-slate-200 placeholder-slate-500 rounded-lg px-4 py-2 text-sm focus:border-yellow-400 focus-visible:outline-1 focus-visible:outline-offset-0 focus-visible:outline-yellow-400 transition-colors duration-200"
            />
            <label htmlFor="booking-lastName" className="sr-only">{t('lastName')}</label>
            <input
              id="booking-lastName"
              required
              name="lastName"
              type="text"
              autoComplete="family-name"
              placeholder={t('lastName')}
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="bg-transparent border border-slate-500 text-slate-200 placeholder-slate-500 rounded-lg px-4 py-2 text-sm focus:border-yellow-400 focus-visible:outline-1 focus-visible:outline-offset-0 focus-visible:outline-yellow-400 transition-colors duration-200"
            />
          </div>
          <label htmlFor="booking-email" className="sr-only">{t('email')}</label>
          <input
            id="booking-email"
            required
            name="email"
            type="email"
            autoComplete="email"
            placeholder={t('email')}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="bg-transparent border border-slate-500 text-slate-200 placeholder-slate-500 rounded-lg px-4 py-2 text-sm focus:border-yellow-400 focus-visible:outline-1 focus-visible:outline-offset-0 focus-visible:outline-yellow-400 transition-colors duration-200"
          />
          <label htmlFor="booking-phone" className="sr-only">{t('phone')}</label>
          <input
            id="booking-phone"
            required
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder={t('phone')}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="bg-transparent border border-slate-500 text-slate-200 placeholder-slate-500 rounded-lg px-4 py-2 text-sm focus:border-yellow-400 focus-visible:outline-1 focus-visible:outline-offset-0 focus-visible:outline-yellow-400 transition-colors duration-200"
          />

          {error && (
            <div role="alert" className="text-red-500 text-sm">{error}</div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 border border-slate-500 text-slate-300 font-medium py-2 px-4 rounded-lg hover:border-slate-300 hover:text-slate-100 transition-colors"
            >
              {t('reset')}
            </button>
            <button
              type="submit"
              disabled={!isValid || loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:text-slate-400 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              {loading ? 'Laden...' : t('submit')}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}