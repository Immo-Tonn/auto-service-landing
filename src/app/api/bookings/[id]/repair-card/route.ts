import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  const card = await prisma.repairCard.findUnique({
    where: { bookingId: id },
    include: {
      workItems: { orderBy: { position: 'asc' } },
      partItems: { orderBy: { position: 'asc' } },
    },
  })

  if (!card) return NextResponse.json(null)
  return NextResponse.json(card)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const { licensePlate, ownerFirst, ownerLast, vatPercent, workItems, partItems } = body

  // Upsert card header fields
  const card = await prisma.repairCard.upsert({
    where: { bookingId: id },
    create: {
      bookingId: id,
      licensePlate: licensePlate ?? '',
      ownerFirst: ownerFirst ?? '',
      ownerLast: ownerLast ?? '',
      vatPercent: vatPercent ?? 19,
    },
    update: {
      licensePlate: licensePlate ?? '',
      ownerFirst: ownerFirst ?? '',
      ownerLast: ownerLast ?? '',
      vatPercent: vatPercent ?? 19,
    },
  })

  // Replace work items
  if (Array.isArray(workItems)) {
    await prisma.workItem.deleteMany({ where: { repairCardId: card.id } })
    if (workItems.length > 0) {
      await prisma.workItem.createMany({
        data: workItems.map((w: { description: string; price?: number }, i: number) => ({
          repairCardId: card.id,
          description: w.description,
          price: w.price ?? null,
          position: i,
        })),
      })
    }
  }

  // Replace part items
  if (Array.isArray(partItems)) {
    await prisma.partItem.deleteMany({ where: { repairCardId: card.id } })
    if (partItems.length > 0) {
      await prisma.partItem.createMany({
        data: partItems.map((p: { description: string; quantity?: number; price?: number }, i: number) => ({
          repairCardId: card.id,
          description: p.description,
          quantity: p.quantity ?? 1,
          price: p.price ?? null,
          position: i,
        })),
      })
    }
  }

  const updated = await prisma.repairCard.findUnique({
    where: { id: card.id },
    include: {
      workItems: { orderBy: { position: 'asc' } },
      partItems: { orderBy: { position: 'asc' } },
    },
  })

  return NextResponse.json(updated)
}
