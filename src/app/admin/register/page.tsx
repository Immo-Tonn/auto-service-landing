'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PasswordInput from '@/components/admin/PasswordInput'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setError('')

    if (password !== confirm) {
      setError('Passwörter stimmen nicht überein')
      return
    }
    if (password.length < 6) {
      setError('Passwort muss mindestens 6 Zeichen haben')
      return
    }

    setLoading(true)

    const res = await fetch('/api/admin/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error ?? 'Fehler bei der Registrierung')
      setLoading(false)
      return
    }

    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">
          Admin registrieren
        </h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="E-Mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-slate-300 rounded-lg px-4 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <PasswordInput
            placeholder="Passwort (min. 6 Zeichen)"
            value={password}
            onChange={setPassword}
          />
          <PasswordInput
            placeholder="Passwort bestätigen"
            value={confirm}
            onChange={setConfirm}
          />
          <button
            onClick={handleSubmit}
            disabled={loading || !email || !password || !confirm}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-60 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            {loading ? 'Laden...' : 'Registrieren'}
          </button>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Bereits registriert?{' '}
          <Link href="/admin/login" className="text-blue-600 hover:underline">
            Anmelden
          </Link>
        </p>
      </div>
    </div>
  )
}
