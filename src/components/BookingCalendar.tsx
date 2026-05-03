'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

interface DateSlot {
  date: string
  available: boolean
}

interface Props {
  onDateSelect: (date: string) => void
  selectedDate: string | null
  refreshKey: number
}

export default function BookingCalendar({ onDateSelect, selectedDate, refreshKey }: Props) {
  const t = useTranslations('booking')
  const [slots, setSlots] = useState<DateSlot[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/bookings/available-dates')
      .then((res) => res.json())
      .then((data) => {
        setSlots(data)
        setLoading(false)
      })
  }, [refreshKey])

  if (loading) {
    return <div className="text-slate-400 text-center py-4">Laden...</div>
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
      {slots.map((slot) => {
        const date = new Date(slot.date + 'T12:00:00')
        const isSelected = selectedDate === slot.date

        return (
          <button
            key={slot.date}
            disabled={!slot.available}
            onClick={() => slot.available && onDateSelect(slot.date)}
            className={`
              p-3 rounded-lg text-sm font-medium transition border
              ${!slot.available
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200'
                : isSelected
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-700 hover:border-blue-400 border-slate-200 cursor-pointer'
              }
            `}
          >
            <div className="font-semibold">
              {date.toLocaleDateString('de-DE', { weekday: 'short' })}
            </div>
            <div>
              {date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}
            </div>
            {!slot.available && (
              <div className="text-xs mt-1">{t('booked')}</div>
            )}
          </button>
        )
      })}
    </div>
  )
}