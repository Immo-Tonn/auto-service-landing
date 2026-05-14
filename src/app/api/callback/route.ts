// src/app/api/callback/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { sendCallbackNotification } from '@/lib/telegram'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, phone, locale } = body

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Name und Telefon sind erforderlich' },
        { status: 400 }
      )
    }

    await sendCallbackNotification({
      name: name.trim(),
      phone: phone.trim(),
      locale: locale || 'de',
    })

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (error) {
    console.error('Callback error:', error)
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}