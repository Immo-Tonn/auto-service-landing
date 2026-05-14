import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const today = new Date()

  const workingDays: Date[] = []
  const current = new Date(Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate() + 1, // start from tomorrow
    10, 0, 0, 0 // 10:00 UTC
  ))

  while (workingDays.length < 10) {
    const day = current.getUTCDay() // use UTC day
    if (day !== 0) {
      workingDays.push(new Date(current))
    }
    current.setUTCDate(current.getUTCDate() + 1)
  }

  const bookedDates = await prisma.booking.findMany({
    where: {
      date: { in: workingDays },
    },
    select: { date: true },
  })

  const bookedSet = new Set(
    bookedDates.map((b) => b.date.toISOString().split('T')[0])
  )

  const result = workingDays.map((date) => ({
    date: date.toISOString().split('T')[0],
    available: !bookedSet.has(date.toISOString().split('T')[0]),
  }))

  return NextResponse.json(result)
}