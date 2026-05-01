import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const today = new Date()

  const workingDays: Date[] = []
  const current = new Date(Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate() + 1, // начинаем с завтра
    10, 0, 0, 0 // 10:00 UTC
  ))

  while (workingDays.length < 10) {
    const day = current.getUTCDay() // используем UTC день
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

// import { NextResponse } from 'next/server'
// import { prisma } from '@/lib/db'

// export async function GET() {
//   const today = new Date()
//   today.setHours(0, 0, 0, 0)

//   // Следующие 10 рабочих дней (без выходных)
//   const workingDays: Date[] = []
//   const current = new Date(today)
//   current.setDate(current.getDate() + 1) // начинаем с завтра

//   while (workingDays.length < 10) {
//     const day = current.getDay()
//     console.log(`${current.toISOString()} — getDay: ${day}`)
//     if (day !== 0 && day !== 6) { // 0 = воскресенье, 6 = суббота
//       workingDays.push(new Date(current))
//     }
//     current.setDate(current.getDate() + 1)
//   }

//   // Занятые даты из БД
//   const bookedDates = await prisma.booking.findMany({
//     where: {
//       date: { in: workingDays },
//     },
//     select: { date: true },
//   })

//   const bookedSet = new Set(
//     bookedDates.map((b) => b.date.toISOString().split('T')[0])
//   )

//   const result = workingDays.map((date) => ({
//     date: date.toISOString().split('T')[0],
//     available: !bookedSet.has(date.toISOString().split('T')[0]),
//   }))

//   return NextResponse.json(result)
// }