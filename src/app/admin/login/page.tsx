'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PasswordInput from '@/components/admin/PasswordInput'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('Ungültige E-Mail oder Passwort')
      setLoading(false)
    } else {
      router.push('/admin/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">
          Admin Panel
        </h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <div id="admin-login-form" className="flex flex-col gap-4">
          <input
            id="admin-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="E-Mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-slate-300 rounded-lg px-4 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <PasswordInput
            id="admin-password"
            name="password"
            autoComplete="current-password"
            placeholder="Passwort"
            value={password}
            onChange={setPassword}
          />
          <button
            onClick={handleSubmit}
            disabled={loading || !email || !password}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-60 text-white font-bold py-2 px-4 rounded-lg transition"
            // className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            {loading ? 'Laden...' : 'Anmelden'}
          </button>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Noch kein Konto?{' '}
          <Link href="/admin/register" className="text-blue-600 hover:underline">
            Registrieren
          </Link>
        </p>
      </div>
    </div>
  )
}