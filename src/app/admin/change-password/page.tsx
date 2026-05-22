'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PasswordInput from '@/components/admin/PasswordInput'

export default function ChangePasswordPage() {
  const router = useRouter()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setError('')

    if (newPassword !== confirm) {
      setError('Neue Passwörter stimmen nicht überein')
      return
    }
    if (newPassword.length < 6) {
      setError('Neues Passwort muss mindestens 6 Zeichen haben')
      return
    }

    setLoading(true)

    const res = await fetch('/api/admin/password', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error ?? 'Fehler beim Ändern des Passworts')
      setLoading(false)
      return
    }

    setSuccess(true)
    setTimeout(() => router.push('/admin/dashboard'), 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">
          Passwort ändern
        </h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {success ? (
          <div className="bg-green-50 text-green-700 p-4 rounded-lg text-center text-sm">
            Passwort erfolgreich geändert. Weiterleitung...
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <PasswordInput
              placeholder="Aktuelles Passwort"
              value={currentPassword}
              onChange={setCurrentPassword}
            />
            <PasswordInput
              placeholder="Neues Passwort (min. 6 Zeichen)"
              value={newPassword}
              onChange={setNewPassword}
            />
            <PasswordInput
              placeholder="Neues Passwort bestätigen"
              value={confirm}
              onChange={setConfirm}
            />
            <button
              onClick={handleSubmit}
              disabled={loading || !currentPassword || !newPassword || !confirm}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-60 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              {loading ? 'Laden...' : 'Passwort ändern'}
            </button>
          </div>
        )}

        <p className="text-center text-sm text-slate-500 mt-6">
          <Link href="/admin/dashboard" className="text-blue-600 hover:underline">
            ← Zurück zum Dashboard
          </Link>
        </p>
      </div>
    </div>
  )
}
