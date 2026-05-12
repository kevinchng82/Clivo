import BookingsList from '@/components/dashboard/BookingsList'
import { verifySession } from '@/lib/session'

export default async function DashboardPage() {
  const { clinicId } = await verifySession()
  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: '32px' }}>
        <div
          style={{
            fontSize: '0.7rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            marginBottom: '8px',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Dashboard
        </div>
        <h1
          className="font-display"
          style={{ fontSize: '2.2rem', fontWeight: 400, color: 'var(--forest)', lineHeight: 1.1 }}
        >
          Bookings
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginTop: '6px', fontWeight: 300 }}>
          All appointments booked by your AI receptionist
        </p>
      </div>

      <BookingsList clinicId={clinicId} />
    </div>
  )
}
