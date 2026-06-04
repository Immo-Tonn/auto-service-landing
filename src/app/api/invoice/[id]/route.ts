import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import PDFDocument from 'pdfkit'

// ── Auto-service data (edit here) ─────────────────────────────────────────
const COMPANY = {
  name: 'Auto Service Muster GmbH',
  owner: 'Hans Muster',
  street: 'Musterstraße 12',
  city: '80331 München',
  phone: '+49 89 123456',
  email: 'info@autoservice-muster.de',
  taxId: 'DE123456789',
}
// ──────────────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      repairCard: {
        include: {
          workItems: { orderBy: { position: 'asc' } },
          partItems: { orderBy: { position: 'asc' } },
        },
      },
    },
  })

  if (!booking?.repairCard) {
    return NextResponse.json({ error: 'Keine Reparaturkarte gefunden' }, { status: 404 })
  }

  const card = booking.repairCard
  const invoiceNum = card.invoiceNumber ?? `RE-ENTWURF-${id.slice(-6).toUpperCase()}`
  const invoiceDate = card.invoicedAt
    ? new Date(card.invoicedAt).toLocaleDateString('de-DE')
    : new Date().toLocaleDateString('de-DE')

  // Build PDF
  const doc = new PDFDocument({ margin: 55, size: 'A4' })
  const chunks: Buffer[] = []

  await new Promise<void>((resolve) => {
    doc.on('data', (c: Buffer) => chunks.push(c))
    doc.on('end', resolve)

    const pageW = doc.page.width - 110 // usable width (both margins)
    const gray = '#6b7280'
    const dark = '#1e293b'
    const line = '#e2e8f0'

    // ── Header ──────────────────────────────────────────────────────────
    doc.fontSize(18).font('Helvetica-Bold').fillColor(dark).text(COMPANY.name, 55, 55)
    doc.fontSize(9).font('Helvetica').fillColor(gray)
      .text(COMPANY.owner, 55, 80)
      .text(`${COMPANY.street}  |  ${COMPANY.city}`, 55, 91)
      .text(`Tel: ${COMPANY.phone}  |  ${COMPANY.email}  |  USt-IdNr: ${COMPANY.taxId}`, 55, 102)

    // ── Invoice block (top-right) ────────────────────────────────────────
    const rightX = 55 + pageW - 150
    doc.fontSize(10).font('Helvetica-Bold').fillColor(dark)
      .text('RECHNUNG', rightX, 55, { width: 150, align: 'right' })
    doc.fontSize(9).font('Helvetica').fillColor(gray)
      .text(`Nr. ${invoiceNum}`, rightX, 70, { width: 150, align: 'right' })
      .text(`Datum: ${invoiceDate}`, rightX, 83, { width: 150, align: 'right' })

    // ── Divider ──────────────────────────────────────────────────────────
    doc.moveTo(55, 120).lineTo(55 + pageW, 120).strokeColor(line).lineWidth(1).stroke()

    // ── Client info ──────────────────────────────────────────────────────
    doc.y = 132
    doc.fontSize(9).font('Helvetica-Bold').fillColor(gray).text('KUNDE', 55)
    doc.fontSize(10).font('Helvetica').fillColor(dark)
      .text(`${card.ownerFirst} ${card.ownerLast}`, 55)
      .text(`${booking.email}`, 55)
      .text(`${booking.phone}`, 55)
    doc.moveDown(0.4)
    doc.fontSize(9).font('Helvetica-Bold').fillColor(gray).text('KENNZEICHEN', 55)
    doc.fontSize(10).font('Helvetica').fillColor(dark).text(card.licensePlate || '—', 55)
    doc.moveDown(0.4)
    doc.fontSize(9).font('Helvetica-Bold').fillColor(gray).text('TERMINDATUM', 55)
    doc.fontSize(10).font('Helvetica').fillColor(dark)
      .text(new Date(booking.date).toLocaleDateString('de-DE'), 55)

    // ── Table helper ─────────────────────────────────────────────────────
    function tableHeader(y: number) {
      doc.rect(55, y, pageW, 20).fill('#f1f5f9')
      doc.fontSize(9).font('Helvetica-Bold').fillColor('#475569')
      doc.text('Pos.', 60, y + 5, { width: 28 })
      doc.text('Bezeichnung', 92, y + 5, { width: pageW - 160 })
      doc.text('Menge', 55 + pageW - 140, y + 5, { width: 45, align: 'right' })
      doc.text('Preis (€)', 55 + pageW - 90, y + 5, { width: 85, align: 'right' })
    }

    function tableRow(y: number, pos: number, desc: string, qty: string, price: string, shade: boolean) {
      if (shade) doc.rect(55, y, pageW, 18).fill('#f8fafc')
      doc.fontSize(9).font('Helvetica').fillColor(dark)
      doc.text(String(pos), 60, y + 4, { width: 28 })
      doc.text(desc, 92, y + 4, { width: pageW - 160 })
      doc.text(qty, 55 + pageW - 140, y + 4, { width: 45, align: 'right' })
      doc.text(price, 55 + pageW - 90, y + 4, { width: 85, align: 'right' })
    }

    // ── Works table ──────────────────────────────────────────────────────
    doc.moveDown(1)
    let y = doc.y

    if (card.workItems.length > 0) {
      doc.fontSize(10).font('Helvetica-Bold').fillColor(dark).text('Arbeiten', 55, y)
      y = doc.y + 4
      tableHeader(y)
      y += 20
      card.workItems.forEach((w, i) => {
        const price = w.price != null ? fmt(w.price) : '—'
        tableRow(y, i + 1, w.description, '1', price, i % 2 === 0)
        y += 18
      })
      doc.moveTo(55, y).lineTo(55 + pageW, y).strokeColor(line).lineWidth(0.5).stroke()
      y += 8
    }

    // ── Parts table ───────────────────────────────────────────────────────
    if (card.partItems.length > 0) {
      doc.fontSize(10).font('Helvetica-Bold').fillColor(dark).text('Ersatzteile', 55, y)
      y = doc.y + 4
      tableHeader(y)
      y += 20
      card.partItems.forEach((p, i) => {
        const price = p.price != null ? fmt(p.price) : '—'
        tableRow(y, i + 1, p.description, String(p.quantity), price, i % 2 === 0)
        y += 18
      })
      doc.moveTo(55, y).lineTo(55 + pageW, y).strokeColor(line).lineWidth(0.5).stroke()
      y += 8
    }

    // ── Totals ────────────────────────────────────────────────────────────
    const workNet = card.workItems.reduce((s, w) => s + (w.price ?? 0), 0)
    const partNet = card.partItems.reduce((s, p) => s + (p.price ?? 0) * p.quantity, 0)
    const net = workNet + partNet
    const vat = card.vatPercent
    const vatAmt = net * (vat / 100)
    const gross = net + vatAmt

    const totalsX = 55 + pageW - 200

    y += 8
    doc.fontSize(9).font('Helvetica').fillColor(gray)
      .text('Nettobetrag', totalsX, y, { width: 115 })
    doc.fontSize(9).font('Helvetica').fillColor(dark)
      .text(fmt(net), totalsX + 115, y, { width: 85, align: 'right' })

    y += 16
    doc.fontSize(9).font('Helvetica').fillColor(gray)
      .text(`MwSt. ${vat} %`, totalsX, y, { width: 115 })
    doc.fontSize(9).font('Helvetica').fillColor(dark)
      .text(fmt(vatAmt), totalsX + 115, y, { width: 85, align: 'right' })

    y += 4
    doc.moveTo(totalsX, y + 12).lineTo(55 + pageW, y + 12).strokeColor(dark).lineWidth(0.8).stroke()
    y += 16

    doc.fontSize(11).font('Helvetica-Bold').fillColor(dark)
      .text('Gesamtbetrag', totalsX, y, { width: 115 })
    doc.fontSize(11).font('Helvetica-Bold').fillColor(dark)
      .text(fmt(gross), totalsX + 115, y, { width: 85, align: 'right' })

    // ── Footer ────────────────────────────────────────────────────────────
    const footerY = doc.page.height - 60
    doc.moveTo(55, footerY - 10).lineTo(55 + pageW, footerY - 10).strokeColor(line).lineWidth(0.5).stroke()
    doc.fontSize(8).font('Helvetica').fillColor(gray)
      .text(`${COMPANY.name}  ·  ${COMPANY.owner}  ·  ${COMPANY.street}, ${COMPANY.city}`, 55, footerY, { align: 'center', width: pageW })
      .text(`${COMPANY.phone}  ·  ${COMPANY.email}`, 55, footerY + 12, { align: 'center', width: pageW })

    doc.end()
  })

  const buffer = Buffer.concat(chunks)
  const filename = `Rechnung-${invoiceNum}.pdf`

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${filename}"`,
    },
  })
  } catch (err) {
    console.error('[invoice/pdf]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }
}
