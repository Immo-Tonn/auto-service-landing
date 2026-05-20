// src/app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { sendContactNotification } from '@/lib/telegram'
import { sendContactEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, message, locale } = body

    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: 'Alle Felder sind erforderlich' },
        { status: 400 }
      )
    }

    const data = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      message: message.trim(),
      locale: locale || 'de',
    }

    await Promise.all([
      sendContactNotification(data),
      sendContactEmail(data),
    ])

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}
