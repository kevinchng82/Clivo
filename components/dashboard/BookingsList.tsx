'use client'
import { useEffect, useState } from 'react'

interface Booking {
  id: string
  customer_name: string
  customer_phone: string
  service: string
  appointment_dt: string
  status: string
}

export default function BookingsList({ clinicId: _clinicId }: { clinicId: string }) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/bookings')
      .then(r => r.json())
      .then(d => setBookings(d.bookings || []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-gray-500">Loading bookings...</p>
  if (!bookings.length) return <p className="text-gray-500">No bookings yet. Once patients message your clinic WhatsApp, bookings will appear here.</p>

  return (
    <div className="space-y-3">
      {bookings.map(b => (
        <div key={b.id} className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center">
          <div>
            <p className="font-semibold text-gray-900">{b.customer_name || 'Unknown'}</p>
            <p className="text-gray-500 text-sm">{b.service} — {new Date(b.appointment_dt).toLocaleString('en-SG', { timeZone: 'Asia/Singapore' })}</p>
            <p className="text-gray-400 text-sm">{b.customer_phone}</p>
          </div>
          <span className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full">{b.status}</span>
        </div>
      ))}
    </div>
  )
}
