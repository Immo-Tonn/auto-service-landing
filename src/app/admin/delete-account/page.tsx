'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import PasswordInput from '@/components/admin/PasswordInput'

export default function DeleteAccountPage() {
  const [password, setPassword] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setError('')
    setLoading(true)

    const res = await fetch('/api/admin/account', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error ?? 'Fehler beim Löschen des Kontos')
      setLoading(false)
      return
    }

    await signOut({ callbackUrl: '/admin/login' })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-800 mb-2 text-center">
          Konto löschen
        </h1>
        <p className="text-sm text-slate-500 text-center mb-6">
          Diese Aktion ist unwiderruflich. Das Konto wird dauerhaft gelöscht.
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <PasswordInput
            placeholder="Aktuelles Passwort zur Bestätigung"
            value={password}
            onChange={setPassword}
          />

          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-0.5 accent-red-600"
            />
            <span className="text-sm text-slate-600">
              Ich verstehe, dass mein Konto unwiderruflich gelöscht wird
            </span>
          </label>

          <button
            onClick={handleDelete}
            disabled={loading || !password || !confirmed}
            className="bg-red-600 hover:bg-red-700 disabled:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-60 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            {loading ? 'Laden...' : 'Konto endgültig löschen'}
          </button>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          <Link href="/admin/dashboard" className="text-blue-600 hover:underline">
            ← Zurück zum Dashboard
          </Link>
        </p>
      </div>
    </div>
  )
}
