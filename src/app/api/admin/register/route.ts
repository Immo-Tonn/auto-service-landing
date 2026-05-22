import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  const { email, password } = await req.json()

  if (!email || !password || password.length < 6) {
    return NextResponse.json({ error: 'Ungültige Eingaben' }, { status: 400 })
  }

  const existingAdmin = await prisma.adminUser.findFirst()
  if (existingAdmin) {
    return NextResponse.json(
      { error: 'Registrierung nicht erlaubt' },
      { status: 403 }
    )
  }

  const hashed = await bcrypt.hash(password, 12)
  await prisma.adminUser.create({ data: { email, password: hashed } })

  return NextResponse.json({ ok: true })
}
