import BookingsList from '@/components/dashboard/BookingsList'

export default function DashboardPage() {
  const clinicId = process.env.DEMO_CLINIC_ID || ''
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Bookings</h1>
      {clinicId ? (
        <BookingsList clinicId={clinicId} />
      ) : (
        <p className="text-amber-600">DEMO_CLINIC_ID not set. Add it to .env.local to see bookings.</p>
      )}
    </div>
  )
}
