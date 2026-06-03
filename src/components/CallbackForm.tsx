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

  const handleSubmit = async () => {
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
    <div className="flex flex-col gap-4">
      <input
        id="callback-name"
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
          focus:outline-none focus:border-yellow-400
          transition-colors duration-200
        "
      />
      <input
        id="callback-phone"
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
          focus:outline-none focus:border-yellow-400
          transition-colors duration-200
        "
      />

      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}

      <button
        onClick={handleSubmit}
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
    </div>
  )
}