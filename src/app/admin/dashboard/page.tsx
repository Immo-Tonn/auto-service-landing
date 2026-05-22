import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import { authOptions } from '@/lib/auth'
import LogoutButton from '@/components/admin/LogoutButton'

type SortField = 'name' | 'date'
type SortOrder = 'asc' | 'desc'

function sortHref(active: SortField, order: SortOrder, target: SortField) {
  if (active === target) {
    return `?sort=${target}&order=${order === 'asc' ? 'desc' : 'asc'}`
  }
  return `?sort=${target}&order=asc`
}

function sortIcon(active: SortField, order: SortOrder, target: SortField) {
  if (active !== target) return '↕'
  return order === 'asc' ? '↑' : '↓'
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; order?: string }>
}) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const params = await searchParams
  const sortField: SortField =
    params.sort === 'name' || params.sort === 'date' ? params.sort : 'date'
  const sortOrder: SortOrder =
    params.order === 'asc' || params.order === 'desc' ? params.order : 'desc'

  const orderBy =
    sortField === 'name'
      ? [{ firstName: sortOrder }, { lastName: sortOrder }]
      : [{ date: sortOrder }]

  const bookings = await prisma.booking.findMany({ orderBy })

  const thClass = 'text-left p-4 font-medium'
  const linkClass =
    'flex items-center gap-1 text-slate-600 hover:text-slate-900 select-none'
  const iconClass = 'text-slate-400 text-xs'

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800">
            Dashboard — Termine
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-slate-500 text-sm">{session.user?.email}</span>
            <Link
              href="/admin/change-password"
              className="text-sm text-slate-500 hover:text-blue-600 transition"
            >
              Passwort ändern
            </Link>
            <Link
              href="/admin/delete-account"
              className="text-sm text-slate-500 hover:text-red-600 transition"
            >
              Konto löschen
            </Link>
            <LogoutButton />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className={thClass}>
                  <Link href={sortHref(sortField, sortOrder, 'name')} className={linkClass}>
                    Name
                    <span className={iconClass}>{sortIcon(sortField, sortOrder, 'name')}</span>
                  </Link>
                </th>
                <th className={thClass}>
                  <Link href={sortHref(sortField, sortOrder, 'date')} className={linkClass}>
                    Datum
                    <span className={iconClass}>{sortIcon(sortField, sortOrder, 'date')}</span>
                  </Link>
                </th>
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
