import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { authOptions } from '@/lib/auth'

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
  }

  const { currentPassword, newPassword } = await req.json()

  if (!currentPassword || !newPassword || newPassword.length < 6) {
    return NextResponse.json({ error: 'Ungültige Eingaben' }, { status: 400 })
  }

  const admin = await prisma.adminUser.findUnique({
    where: { email: session.user.email },
  })
  if (!admin) {
    return NextResponse.json({ error: 'Benutzer nicht gefunden' }, { status: 404 })
  }

  const isValid = await bcrypt.compare(currentPassword, admin.password)
  if (!isValid) {
    return NextResponse.json({ error: 'Aktuelles Passwort ist falsch' }, { status: 400 })
  }

  const hashed = await bcrypt.hash(newPassword, 12)
  await prisma.adminUser.update({
    where: { email: session.user.email },
    data: { password: hashed },
  })

  return NextResponse.json({ ok: true })
}
