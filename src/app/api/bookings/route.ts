import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sendBookingEmails } from '@/lib/email'
import { sendTelegramNotification } from '@/lib/telegram'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { firstName, lastName, email, phone, date, locale } = body

    if (!firstName || !lastName || !email || !phone || !date) {
      return NextResponse.json(
        { error: 'Alle Felder sind erforderlich' },
        { status: 400 }
      )
    }

    const bookingDate = new Date(date + 'T10:00:00.000Z')

    // Checking that the date is not already booked
    const existing = await prisma.booking.findUnique({
      where: { date: bookingDate },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Dieser Termin ist bereits vergeben' },
        { status: 409 }
      )
    }

    const booking = await prisma.booking.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        date: bookingDate,
        locale: locale || 'de',
      },
    })

    // await sendBookingEmails({
    //   firstName,
    //   lastName,
    //   email,
    //   phone,
    //   date,
    //   locale: locale || 'de',
    // }).catch((err) => console.error('Email error:', err))
    
    const notificationData = {
  firstName,
  lastName,
  email,
  phone,
  date,
  locale: locale || 'de',
}

await Promise.all([
  sendBookingEmails(notificationData).catch((err) =>
    console.error('Email error:', err)
  ),
  sendTelegramNotification(notificationData).catch((err) =>
    console.error('Telegram error:', err)
  ),
])

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}

export async function GET() {
  const bookings = await prisma.booking.findMany({
    orderBy: { date: 'asc' },
  })
  return NextResponse.json(bookings)
}