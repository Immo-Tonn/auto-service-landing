import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'

export default async function DashboardPage() {
  const session = await getServerSession()

  if (!session) {
    redirect('/admin/login')
  }

  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800">
            Dashboard — Termine
          </h1>
          <span className="text-slate-500 text-sm">{session.user?.email}</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-left p-4 text-slate-600 font-medium">Name</th>
                <th className="text-left p-4 text-slate-600 font-medium">Datum</th>
                <th className="text-left p-4 text-slate-600 font-medium">Kontakt</th>
                <th className="text-left p-4 text-slate-600 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center p-8 text-slate-400">
                    Noch keine Termine
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id} className="border-b hover:bg-slate-50">
                    <td className="p-4 text-slate-800">
                      {booking.firstName} {booking.lastName}
                    </td>
                    <td className="p-4 text-slate-600">
                      {new Date(booking.date).toLocaleDateString('de-DE')}
                    </td>
                    <td className="p-4 text-slate-600">
                      <div>{booking.email}</div>
                      <div className="text-sm text-slate-400">{booking.phone}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'NEU'
                          ? 'bg-blue-100 text-blue-700'
                          : booking.status === 'IN_ARBEIT'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}