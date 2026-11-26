'use client'
// src/components/CallbackForm.tsx

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'

interface Props {
  onSuccess: () => void
}

export default function CallbackForm({ onSuccess }: Props) {
  const t      = useTranslations('callback')
  const locale = useLocale()

  const [form, setForm]       = useState({ name: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const isValid = form.name.trim() && form.phone.trim()

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!isValid) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, locale }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || t('error'))
        return
      }

      onSuccess()
    } catch {
      setError(t('error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 dark-form">
      <label htmlFor="callback-name" className="sr-only">{t('name')}</label>
      <input
        id="callback-name"
        required
        name="name"
        type="text"
        autoComplete="name"
        placeholder={t('name')}
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="
          w-full bg-transparent
          border border-slate-500
          text-slate-200 placeholder-slate-500
          rounded px-4 py-3 text-sm
          focus:border-yellow-400
          focus-visible:outline-1 focus-visible:outline-offset-0 focus-visible:outline-yellow-400
          transition-colors duration-200
        "
      />
      <label htmlFor="callback-phone" className="sr-only">{t('phone')}</label>
      <input
        id="callback-phone"
        required
        name="phone"
        type="tel"
        autoComplete="tel"
        placeholder={t('phone')}
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        className="
          w-full bg-transparent
          border border-slate-500
          text-slate-200 placeholder-slate-500
          rounded px-4 py-3 text-sm
          focus:border-yellow-400
          focus-visible:outline-1 focus-visible:outline-offset-0 focus-visible:outline-yellow-400
          transition-colors duration-200
        "
      />

      {error && (
        <p role="alert" className="text-red-400 text-sm">{error}</p>
      )}

      <button
        type="submit"
        disabled={!isValid || loading}
        className="
          self-start
          border-2 border-yellow-400
          text-yellow-400 font-bold
          px-6 py-2.5 text-sm
          uppercase tracking-wider
          hover:bg-yellow-400 hover:text-zinc-900
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-colors duration-200
        "
      >
        {loading ? '...' : t('submit')}
      </button>
    </form>
  )
}