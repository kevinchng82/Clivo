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

  if (loading) {
    return (
      <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--muted)', fontSize: '0.9rem', fontWeight: 300 }}>
        Loading bookings…
      </div>
    )
  }

  if (!bookings.length) {
    return (
      <div
        style={{
          padding: '60px 40px',
          textAlign: 'center',
          background: 'white',
          border: '1px solid var(--cream-border)',
          borderRadius: '2px',
        }}
      >
        <div className="font-display" style={{ fontSize: '1.5rem', color: 'var(--forest)', fontWeight: 400, marginBottom: '10px' }}>
          No bookings yet
        </div>
        <p style={{ color: 'var(--muted)', fontSize: '0.88rem', fontWeight: 300, maxWidth: '320px', margin: '0 auto', lineHeight: 1.7 }}>
          Once patients message your clinic WhatsApp, bookings will appear here automatically.
        </p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', border: '1px solid var(--cream-border)' }}>
      {bookings.map((b, i) => (
        <div
          key={b.id}
          style={{
            background: 'white',
            padding: '20px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: i < bookings.length - 1 ? '1px solid var(--cream-border)' : 'none',
            transition: 'background 0.2s ease',
            cursor: 'default',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--cream)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'white')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* Avatar initials */}
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '2px',
                background: 'var(--gold-pale)',
                border: '1px solid var(--cream-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <span
                className="font-display"
                style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--forest)', lineHeight: 1 }}
              >
                {(b.customer_name || 'U').charAt(0).toUpperCase()}
              </span>
            </div>

            <div>
              <p style={{ fontWeight: 500, color: 'var(--ink)', fontSize: '0.92rem', marginBottom: '3px' }}>
                {b.customer_name || 'Unknown patient'}
              </p>
              <p style={{ color: 'var(--muted)', fontSize: '0.8rem', fontWeight: 300 }}>
                {b.service}
                <span style={{ margin: '0 8px', color: 'var(--cream-border)' }}>·</span>
                {new Date(b.appointment_dt).toLocaleString('en-SG', {
                  timeZone: 'Asia/Singapore',
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </p>
              <p style={{ color: 'var(--muted-light)', fontSize: '0.75rem', marginTop: '2px' }}>{b.customer_phone}</p>
            </div>
          </div>

          <span
            style={{
              background: 'rgba(26,60,46,0.08)',
              color: 'var(--forest-mid)',
              fontSize: '0.7rem',
              padding: '5px 12px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              border: '1px solid rgba(26,60,46,0.15)',
              fontWeight: 500,
            }}
          >
            {b.status}
          </span>
        </div>
      ))}
    </div>
  )
}
