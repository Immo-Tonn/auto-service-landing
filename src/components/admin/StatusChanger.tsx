'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Props = {
  bookingId: string
  currentStatus: string
}

const TRANSITIONS: Record<string, string[]> = {
  NEU: ['IN_ARBEIT'],
  IN_ARBEIT: ['NEU', 'FERTIG'],
}

const LABELS: Record<string, string> = {
  NEU: 'NEU',
  IN_ARBEIT: 'IN ARBEIT',
  FERTIG: 'FERTIG',
}

const BTN_COLORS: Record<string, string> = {
  IN_ARBEIT: 'bg-yellow-500 hover:bg-yellow-600 text-white',
  FERTIG: 'bg-green-600 hover:bg-green-700 text-white',
  NEU: 'bg-blue-600 hover:bg-blue-700 text-white',
}

export default function StatusChanger({ bookingId, currentStatus }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [unlocked, setUnlocked] = useState(false)

  const changeStatus = async (status: string) => {
    setLoading(true)
    await fetch(`/api/bookings/${bookingId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setLoading(false)
    setUnlocked(false)
    router.refresh()
  }

  // FERTIG — locked view with unlock button
  if (currentStatus === 'FERTIG') {
    return (
      <div className="flex items-center gap-3">
        {!unlocked ? (
          <>
            <span className="inline-flex items-center px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold">
              STATUS: FERTIG
            </span>
            <button
              onClick={() => setUnlocked(true)}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 hover:border-slate-500 hover:text-slate-800 text-sm font-medium transition"
            >
              Update
            </button>
          </>
        ) : (
          <button
            onClick={() => changeStatus('IN_ARBEIT')}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50 bg-yellow-500 hover:bg-yellow-600 text-white"
          >
            {loading ? '…' : `→ ${LABELS['IN_ARBEIT']}`}
          </button>
        )}
      </div>
    )
  }

  const next = TRANSITIONS[currentStatus] ?? []
  if (next.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      {next.map(s => (
        <button
          key={s}
          onClick={() => changeStatus(s)}
          disabled={loading}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50 ${BTN_COLORS[s]}`}
        >
          {loading ? '…' : `→ ${LABELS[s]}`}
        </button>
      ))}
    </div>
  )
}
