import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Status } from '@/generated/prisma'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { status } = await req.json()

  if (!['NEU', 'IN_ARBEIT', 'FERTIG'].includes(status)) {
    return NextResponse.json({ error: 'Ungültiger Status' }, { status: 400 })
  }

  const booking = await prisma.booking.update({
    where: { id },
    data: { status: status as Status },
  })

  if (status === 'IN_ARBEIT') {
    await prisma.repairCard.upsert({
      where: { bookingId: id },
      create: {
        bookingId: id,
        ownerFirst: booking.firstName,
        ownerLast: booking.lastName,
      },
      update: {},
    })
  }

  // Delete RepairCard (and cascaded WorkItem/PartItem) when reverting to NEU
  if (status === 'NEU') {
    await prisma.repairCard.deleteMany({ where: { bookingId: id } })
  }

  return NextResponse.json(booking)
}
