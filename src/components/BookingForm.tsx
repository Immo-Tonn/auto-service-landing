'use client'

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import BookingCalendar from './BookingCalendar'

export default function BookingForm() {
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
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [calendarKey, setCalendarKey] = useState(0)

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

  const handleSubmit = async () => {
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

      setSuccess(true)
      setCalendarKey((k) => k + 1)
    } catch {
      setError('Netzwerkfehler. Bitte versuchen Sie es erneut.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setSuccess(false)
    handleReset()
  }

  useEffect(() => {
    if (!success) return
    const timer = setTimeout(() => {
      setSuccess(false)
      setForm({ firstName: '', lastName: '', email: '', phone: '' })
      setSelectedDate(null)
      setError('')
    }, 5000)
    return () => clearTimeout(timer)
  }, [success])

  if (success) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 cursor-pointer"
        onClick={handleClose}
      >
        <div className="bg-white rounded-2xl shadow-xl px-10 py-10 text-center max-w-sm mx-4">
          <div className="text-5xl mb-4">✅</div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">{t('success')}</h3>
          <p className="text-slate-500">{t('confirmation')}</p>
          <p className="text-xs text-slate-400 mt-4">Klicken Sie irgendwo, um zu schließen</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-700 mb-3">
          {t('selectDate')}
        </h3>
        <BookingCalendar
          onDateSelect={setSelectedDate}
          selectedDate={selectedDate}
          refreshKey={calendarKey}
        />
      </div>

      {selectedDate && (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder={t('firstName')}
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder={t('lastName')}
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <input
            type="email"
            placeholder={t('email')}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="tel"
            placeholder={t('phone')}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="flex-1 border border-slate-300 text-slate-600 font-medium py-2 px-4 rounded-lg hover:bg-slate-50 transition"
            >
              {t('reset')}
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isValid || loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              {loading ? 'Laden...' : t('submit')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}