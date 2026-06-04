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

const statusClass = (status: string) =>
  status === 'NEU'
    ? 'bg-blue-100 text-blue-700'
    : status === 'IN_ARBEIT'
    ? 'bg-yellow-100 text-yellow-700'
    : 'bg-green-100 text-green-700'

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
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl font-bold text-slate-800">
            Dashboard — Termine
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="text-slate-500 text-sm truncate max-w-[200px]">
              {session.user?.email}
            </span>
            <Link
              href="/admin/change-password"
              className="text-sm text-slate-500 hover:text-blue-600 transition whitespace-nowrap"
            >
              Passwort ändern
            </Link>
            <Link
              href="/admin/delete-account"
              className="text-sm text-slate-500 hover:text-red-600 transition whitespace-nowrap"
            >
              Konto löschen
            </Link>
            <LogoutButton />
          </div>
        </div>

        {/* Mobile: card list */}
        <div className="flex min-[576px]:hidden flex-col gap-3">

          {/* Sort controls */}
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Sortieren:</span>
            <Link
              href={sortHref(sortField, sortOrder, 'date')}
              className={`flex items-center gap-1 px-3 py-1 rounded-full border transition ${
                sortField === 'date'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-slate-300 text-slate-500 bg-white'
              }`}
            >
              Datum
              <span className="text-xs">{sortIcon(sortField, sortOrder, 'date')}</span>
            </Link>
            <Link
              href={sortHref(sortField, sortOrder, 'name')}
              className={`flex items-center gap-1 px-3 py-1 rounded-full border transition ${
                sortField === 'name'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-slate-300 text-slate-500 bg-white'
              }`}
            >
              Name
              <span className="text-xs">{sortIcon(sortField, sortOrder, 'name')}</span>
            </Link>
          </div>

          {bookings.length === 0 ? (
            <p className="text-center p-8 text-slate-400">Noch keine Termine</p>
          ) : (
            bookings.map((booking) => (
              <Link key={booking.id} href={`/admin/bookings/${booking.id}`} className="block bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <span className="font-semibold text-slate-800">
                    {booking.firstName} {booking.lastName}
                  </span>
                  <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${statusClass(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
                <div className="text-sm text-slate-500 mb-2">
                  {new Date(booking.date).toLocaleDateString('de-DE')}
                </div>
                <div className="text-sm text-slate-600">{booking.email}</div>
                <div className="text-sm text-slate-400">{booking.phone}</div>
              </Link>
            ))
          )}
        </div>

        {/* Desktop: table */}
        <div className="hidden min-[576px]:block bg-white rounded-xl shadow-sm overflow-hidden">
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
                    <td className="p-4">
                      <Link href={`/admin/bookings/${booking.id}`} className="block text-slate-800 hover:text-blue-600 transition">
                        {booking.firstName} {booking.lastName}
                      </Link>
                    </td>
                    <td className="p-4 text-slate-600">
                      {new Date(booking.date).toLocaleDateString('de-DE')}
                    </td>
                    <td className="p-4 text-slate-600">
                      <div>{booking.email}</div>
                      <div className="text-sm text-slate-400">{booking.phone}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusClass(booking.status)}`}>
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
