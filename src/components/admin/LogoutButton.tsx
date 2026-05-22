'use client'

import { signOut } from 'next-auth/react'

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/admin/login' })}
      className="text-sm text-slate-500 hover:text-red-600 transition"
    >
      Abmelden
    </button>
  )
}
