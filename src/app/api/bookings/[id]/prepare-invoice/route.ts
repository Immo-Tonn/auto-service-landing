import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params

    const card = await prisma.repairCard.findUnique({ where: { bookingId: id } })
    if (!card) return NextResponse.json({ error: 'RepairCard not found' }, { status: 404 })

    // If invoice already issued — return existing number
    if (card.invoiceNumber) {
      return NextResponse.json({ invoiceNumber: card.invoiceNumber })
    }

    // Generate sequential invoice number: RE-YYYY-NNNN
    const year = new Date().getFullYear()
    const count = await prisma.repairCard.count({ where: { invoiceNumber: { not: null } } })
    const invoiceNumber = `RE-${year}-${String(count + 1).padStart(4, '0')}`

    await prisma.repairCard.update({
      where: { id: card.id },
      data: { invoiceNumber, invoicedAt: new Date() },
    })

    return NextResponse.json({ invoiceNumber })
  } catch (err) {
    console.error('[prepare-invoice]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }
}
