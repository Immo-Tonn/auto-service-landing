import { getServerSession } from 'next-auth'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import { authOptions } from '@/lib/auth'
import StatusChanger from '@/components/admin/StatusChanger'
import RepairCardEditor from '@/components/admin/RepairCardEditor'

const statusClass = (status: string) =>
  status === 'NEU'
    ? 'bg-blue-100 text-blue-700'
    : status === 'IN_ARBEIT'
    ? 'bg-yellow-100 text-yellow-700'
    : 'bg-green-100 text-green-700'

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

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

  if (!booking) notFound()

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Back link */}
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition"
        >
          ← Zurück zum Dashboard
        </Link>

        {/* Booking info card */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
            <div>
              <h1 className="text-xl font-bold text-slate-800">
                {booking.firstName} {booking.lastName}
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Termin: {new Date(booking.date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
              </p>
            </div>
            <span className={`self-start px-3 py-1 rounded-full text-sm font-medium ${statusClass(booking.status)}`}>
              {booking.status.replace('_', ' ')}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-5">
            <div>
              <span className="text-slate-400 text-xs uppercase tracking-wide">E-Mail</span>
              <p className="text-slate-700 mt-0.5">{booking.email}</p>
            </div>
            <div>
              <span className="text-slate-400 text-xs uppercase tracking-wide">Telefon</span>
              <p className="text-slate-700 mt-0.5">{booking.phone}</p>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">Status ändern</p>
            <StatusChanger bookingId={booking.id} currentStatus={booking.status} />
          </div>
        </div>

        {/* Repair card — shown when status is IN_ARBEIT or FERTIG */}
        {(booking.status === 'IN_ARBEIT' || booking.status === 'FERTIG') && (
          <RepairCardEditor
            bookingId={booking.id}
            status={booking.status}
            initialCard={booking.repairCard}
          />
        )}

      </div>
    </div>
  )
}
