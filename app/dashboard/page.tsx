import BookingsList from '@/components/dashboard/BookingsList'
import { verifySession } from '@/lib/session'

export default async function DashboardPage() {
  const { clinicId } = await verifySession()
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Bookings</h1>
      <BookingsList clinicId={clinicId} />
    </div>
  )
}
