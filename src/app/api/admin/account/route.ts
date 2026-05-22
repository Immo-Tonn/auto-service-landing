import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { authOptions } from '@/lib/auth'

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
  }

  const { password } = await req.json()

  if (!password) {
    return NextResponse.json({ error: 'Passwort erforderlich' }, { status: 400 })
  }

  const admin = await prisma.adminUser.findUnique({
    where: { email: session.user.email },
  })
  if (!admin) {
    return NextResponse.json({ error: 'Benutzer nicht gefunden' }, { status: 404 })
  }

  const isValid = await bcrypt.compare(password, admin.password)
  if (!isValid) {
    return NextResponse.json({ error: 'Passwort ist falsch' }, { status: 400 })
  }

  await prisma.adminUser.delete({ where: { email: session.user.email } })

  return NextResponse.json({ ok: true })
}
