'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

type WorkItem = { description: string; price: string }
type PartItem = { description: string; quantity: string; price: string }

type RepairCardData = {
  licensePlate: string
  ownerFirst: string
  ownerLast: string
  vatPercent: string
  workItems: WorkItem[]
  partItems: PartItem[]
}

type Props = {
  bookingId: string
  status: string
  initialCard: {
    licensePlate: string
    ownerFirst: string
    ownerLast: string
    vatPercent: number
    invoiceNumber: string | null
    workItems: { description: string; price: number | null; position: number }[]
    partItems: { description: string; quantity: number; price: number | null; position: number }[]
  } | null
}

function emptyWork(): WorkItem { return { description: '', price: '' } }
function emptyPart(): PartItem { return { description: '', quantity: '1', price: '' } }

export default function RepairCardEditor({ bookingId, status, initialCard }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [preparingInvoice, setPreparingInvoice] = useState(false)
  const [invoiceNumber, setInvoiceNumber] = useState<string | null>(initialCard?.invoiceNumber ?? null)

  const [card, setCard] = useState<RepairCardData>(() => ({
    licensePlate: initialCard?.licensePlate ?? '',
    ownerFirst: initialCard?.ownerFirst ?? '',
    ownerLast: initialCard?.ownerLast ?? '',
    vatPercent: String(initialCard?.vatPercent ?? 19),
    workItems: initialCard?.workItems.length
      ? initialCard.workItems.map(w => ({ description: w.description, price: w.price != null ? String(w.price) : '' }))
      : [emptyWork()],
    partItems: initialCard?.partItems.length
      ? initialCard.partItems.map(p => ({ description: p.description, quantity: String(p.quantity), price: p.price != null ? String(p.price) : '' }))
      : [emptyPart()],
  }))

  const set = (field: keyof Omit<RepairCardData, 'workItems' | 'partItems'>, value: string) =>
    setCard(c => ({ ...c, [field]: value }))

  const setWork = (i: number, field: keyof WorkItem, value: string) =>
    setCard(c => {
      const items = [...c.workItems]
      items[i] = { ...items[i], [field]: value }
      return { ...c, workItems: items }
    })

  const setPart = (i: number, field: keyof PartItem, value: string) =>
    setCard(c => {
      const items = [...c.partItems]
      items[i] = { ...items[i], [field]: value }
      return { ...c, partItems: items }
    })

  const addWork = () => setCard(c => ({ ...c, workItems: [...c.workItems, emptyWork()] }))
  const removeWork = (i: number) => setCard(c => ({ ...c, workItems: c.workItems.filter((_, idx) => idx !== i) }))

  const addPart = () => setCard(c => ({ ...c, partItems: [...c.partItems, emptyPart()] }))
  const removePart = (i: number) => setCard(c => ({ ...c, partItems: c.partItems.filter((_, idx) => idx !== i) }))

  const buildPayload = useCallback(() => ({
    licensePlate: card.licensePlate,
    ownerFirst: card.ownerFirst,
    ownerLast: card.ownerLast,
    vatPercent: parseFloat(card.vatPercent) || 19,
    workItems: card.workItems
      .filter(w => w.description.trim())
      .map(w => ({ description: w.description, price: w.price !== '' ? parseFloat(w.price) : null })),
    partItems: card.partItems
      .filter(p => p.description.trim())
      .map(p => ({ description: p.description, quantity: parseInt(p.quantity) || 1, price: p.price !== '' ? parseFloat(p.price) : null })),
  }), [card])

  const saveToServer = useCallback(async () => {
    await fetch(`/api/bookings/${bookingId}/repair-card`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildPayload()),
    })
  }, [bookingId, buildPayload])

  const save = useCallback(async () => {
    setSaving(true)
    setSaved(false)
    await saveToServer()
    setSaving(false)
    setSaved(true)
    router.refresh()
  }, [saveToServer, router])

  const prepareInvoice = useCallback(async () => {
    setPreparingInvoice(true)
    await saveToServer()
    const res = await fetch(`/api/bookings/${bookingId}/prepare-invoice`, { method: 'POST' })
    const data = await res.json()
    if (data.invoiceNumber) setInvoiceNumber(data.invoiceNumber)
    setPreparingInvoice(false)
    window.open(`/api/invoice/${bookingId}`, '_blank', 'noopener,noreferrer')
    router.refresh()
  }, [saveToServer, bookingId, router])

  // Invoice calculation
  const workNet = card.workItems.reduce((s, w) => s + (parseFloat(w.price) || 0), 0)
  const partNet = card.partItems.reduce((s, p) => s + (parseFloat(p.price) || 0) * (parseInt(p.quantity) || 1), 0)
  const net = workNet + partNet
  const vat = parseFloat(card.vatPercent) || 19
  const vatAmount = net * (vat / 100)
  const gross = net + vatAmount

  const fmt = (n: number) => n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const inputCls = 'border border-slate-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-400'
  const labelCls = 'block text-xs font-medium text-slate-500 mb-1'

  return (
    <div className="space-y-6">

      {/* Card header fields */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-base font-semibold text-slate-700 mb-4">Reparaturkarte</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Kennzeichen</label>
            <input className={inputCls} value={card.licensePlate} onChange={e => set('licensePlate', e.target.value)} placeholder="z.B. M-AB 1234" />
          </div>
          <div>
            <label className={labelCls}>Vorname des Fahrzeughalters</label>
            <input className={inputCls} value={card.ownerFirst} onChange={e => set('ownerFirst', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Nachname des Fahrzeughalters</label>
            <input className={inputCls} value={card.ownerLast} onChange={e => set('ownerLast', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Work items */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-base font-semibold text-slate-700 mb-4">Arbeiten</h2>
        <div className="space-y-2">
          {card.workItems.map((w, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                className={`${inputCls} flex-1`}
                value={w.description}
                onChange={e => setWork(i, 'description', e.target.value)}
                placeholder="Beschreibung der Arbeit"
              />
              <input
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm w-28 focus:outline-none focus:ring-2 focus:ring-blue-400 text-right"
                value={w.price}
                onChange={e => setWork(i, 'price', e.target.value)}
                placeholder="Preis €"
                type="number"
                min="0"
                step="0.01"
              />
              <button
                onClick={() => removeWork(i)}
                className="text-slate-400 hover:text-red-500 transition px-1 text-lg leading-none"
                title="Entfernen"
              >×</button>
            </div>
          ))}
        </div>
        <button onClick={addWork} className="mt-3 text-sm text-blue-600 hover:text-blue-800 transition">
          + Arbeit hinzufügen
        </button>
      </div>

      {/* Part items */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-base font-semibold text-slate-700 mb-4">Ersatzteile</h2>
        <div className="space-y-2">
          {card.partItems.map((p, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                className={`${inputCls} flex-1`}
                value={p.description}
                onChange={e => setPart(i, 'description', e.target.value)}
                placeholder="Bezeichnung des Ersatzteils"
              />
              <input
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm w-20 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
                value={p.quantity}
                onChange={e => setPart(i, 'quantity', e.target.value)}
                placeholder="Menge"
                type="number"
                min="1"
              />
              <input
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm w-28 focus:outline-none focus:ring-2 focus:ring-blue-400 text-right"
                value={p.price}
                onChange={e => setPart(i, 'price', e.target.value)}
                placeholder="Preis €"
                type="number"
                min="0"
                step="0.01"
              />
              <button
                onClick={() => removePart(i)}
                className="text-slate-400 hover:text-red-500 transition px-1 text-lg leading-none"
                title="Entfernen"
              >×</button>
            </div>
          ))}
        </div>
        <button onClick={addPart} className="mt-3 text-sm text-blue-600 hover:text-blue-800 transition">
          + Ersatzteil hinzufügen
        </button>
      </div>

      {/* Invoice summary — always visible once there are prices */}
      {net > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-base font-semibold text-slate-700 mb-4">Rechnung</h2>

          {/* Work items with prices */}
          {card.workItems.filter(w => w.description.trim() && w.price !== '').length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Arbeiten</p>
              <table className="w-full text-sm">
                <tbody>
                  {card.workItems.filter(w => w.description.trim()).map((w, i) => (
                    <tr key={i} className="border-b border-slate-100">
                      <td className="py-1.5 text-slate-700">{w.description}</td>
                      <td className="py-1.5 text-right text-slate-700 w-28">
                        {w.price !== '' ? `${fmt(parseFloat(w.price))} €` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Part items with prices */}
          {card.partItems.filter(p => p.description.trim() && p.price !== '').length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Ersatzteile</p>
              <table className="w-full text-sm">
                <tbody>
                  {card.partItems.filter(p => p.description.trim()).map((p, i) => (
                    <tr key={i} className="border-b border-slate-100">
                      <td className="py-1.5 text-slate-700">{p.description}</td>
                      <td className="py-1.5 text-center text-slate-500 w-16">{p.quantity} ×</td>
                      <td className="py-1.5 text-right text-slate-700 w-28">
                        {p.price !== '' ? `${fmt(parseFloat(p.price))} €` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Totals */}
          <div className="border-t border-slate-200 pt-3 space-y-1">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Nettobetrag</span>
              <span>{fmt(net)} €</span>
            </div>
            <div className="flex justify-between text-sm text-slate-500 items-center gap-2">
              <span className="flex items-center gap-1">
                MwSt.
                <input
                  className="border border-slate-300 rounded px-1.5 py-0.5 text-xs w-12 text-center focus:outline-none focus:ring-1 focus:ring-blue-400"
                  value={card.vatPercent}
                  onChange={e => set('vatPercent', e.target.value)}
                  type="number"
                  min="0"
                  max="100"
                />
                %
              </span>
              <span>{fmt(vatAmount)} €</span>
            </div>
            <div className="flex justify-between font-semibold text-slate-800 text-base pt-1 border-t border-slate-200">
              <span>Gesamtbetrag</span>
              <span>{fmt(gross)} €</span>
            </div>
          </div>
        </div>
      )}

      {/* Save / Invoice buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={save}
          disabled={saving || preparingInvoice}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium px-6 py-2 rounded-lg transition text-sm"
        >
          {saving ? 'Speichern…' : 'Speichern'}
        </button>

        {invoiceNumber ? (
          <a
            href={`/api/invoice/${bookingId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-2 rounded-lg transition text-sm"
          >
            PDF öffnen
            <span className="text-emerald-200 text-xs font-normal">{invoiceNumber}</span>
          </a>
        ) : (
          <button
            onClick={prepareInvoice}
            disabled={saving || preparingInvoice}
            className="bg-slate-700 hover:bg-slate-800 disabled:opacity-50 text-white font-medium px-6 py-2 rounded-lg transition text-sm"
          >
            {preparingInvoice ? 'Wird erstellt…' : 'Rechnung vorbereiten'}
          </button>
        )}

        {saved && !preparingInvoice && <span className="text-green-600 text-sm">Gespeichert ✓</span>}
      </div>
    </div>
  )
}
