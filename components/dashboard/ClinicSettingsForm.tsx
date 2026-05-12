'use client'
import { useState } from 'react'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

interface Props {
  initial: {
    clinicName: string
    ownerWhatsapp: string
    whatsappPhoneNumberId: string
    businessHours: Record<string, string>
    services: string[]
  }
}

export default function ClinicSettingsForm({ initial }: Props) {
  const [clinicName, setClinicName] = useState(initial.clinicName)
  const [ownerWhatsapp, setOwnerWhatsapp] = useState(initial.ownerWhatsapp)
  const [whatsappPhoneNumberId, setWhatsappPhoneNumberId] = useState(initial.whatsappPhoneNumberId)
  const [businessHours, setBusinessHours] = useState<Record<string, string>>(
    initial.businessHours ?? {}
  )
  const [services, setServices] = useState<string[]>(
    initial.services?.length ? initial.services : ['']
  )
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  function setHours(day: string, value: string) {
    setBusinessHours(prev => ({ ...prev, [day]: value }))
  }

  function updateService(i: number, value: string) {
    const updated = [...services]
    updated[i] = value
    setServices(updated)
  }

  function addService() {
    setServices([...services, ''])
  }

  function removeService(i: number) {
    setServices(services.filter((_, idx) => idx !== i))
  }

  async function save() {
    setError('')
    setSaving(true)
    try {
      const res = await fetch('/api/clinic-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clinicName: clinicName.trim(),
          ownerWhatsapp: ownerWhatsapp.trim(),
          whatsappPhoneNumberId: whatsappPhoneNumberId.trim(),
          businessHours,
          services: services.map(s => s.trim()).filter(Boolean),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Server error')
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

      {/* Clinic Info */}
      <section style={{ background: 'white', border: '1px solid var(--cream-border)', borderRadius: '2px', padding: '32px' }}>
        <h2 className="font-display" style={{ fontSize: '1.2rem', fontWeight: 500, color: 'var(--forest)', marginBottom: '20px' }}>
          Clinic Information
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '6px' }}>
              Clinic Name
            </label>
            <input
              className="input-warm"
              value={clinicName}
              onChange={e => setClinicName(e.target.value)}
              placeholder="Tan Family Clinic"
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '6px' }}>
              Owner WhatsApp (for booking notifications)
            </label>
            <input
              className="input-warm"
              value={ownerWhatsapp}
              onChange={e => setOwnerWhatsapp(e.target.value)}
              placeholder="+6591234567"
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--muted-light)', marginTop: '4px' }}>
              International format, e.g. +6591234567. New bookings will be sent here.
            </p>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '6px' }}>
              WhatsApp Phone Number ID
            </label>
            <input
              className="input-warm"
              value={whatsappPhoneNumberId}
              onChange={e => setWhatsappPhoneNumberId(e.target.value)}
              placeholder="1125625120631898"
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--muted-light)', marginTop: '4px' }}>
              Found in Meta Developer Console → WhatsApp → API Setup.
            </p>
          </div>
        </div>
      </section>

      {/* Business Hours */}
      <section style={{ background: 'white', border: '1px solid var(--cream-border)', borderRadius: '2px', padding: '32px' }}>
        <h2 className="font-display" style={{ fontSize: '1.2rem', fontWeight: 500, color: 'var(--forest)', marginBottom: '8px' }}>
          Business Hours
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '20px', fontWeight: 300 }}>
          The AI uses these to tell patients when you are open. Leave blank for closed.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {DAYS.map(day => (
            <div key={day} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ width: '96px', fontSize: '0.85rem', color: 'var(--ink-mid)', flexShrink: 0 }}>{day}</span>
              <input
                className="input-warm"
                style={{ maxWidth: '260px' }}
                value={businessHours[day] ?? ''}
                onChange={e => setHours(day, e.target.value)}
                placeholder="e.g. 9am – 6pm or Closed"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section style={{ background: 'white', border: '1px solid var(--cream-border)', borderRadius: '2px', padding: '32px' }}>
        <h2 className="font-display" style={{ fontSize: '1.2rem', fontWeight: 500, color: 'var(--forest)', marginBottom: '8px' }}>
          Services Offered
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '20px', fontWeight: 300 }}>
          List every service your clinic offers. The AI uses this when patients ask about or book services.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
          {services.map((svc, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                className="input-warm"
                value={svc}
                onChange={e => updateService(i, e.target.value)}
                placeholder={`Service ${i + 1} (e.g. General Consultation)`}
                style={{ flex: 1 }}
              />
              <button
                onClick={() => removeService(i)}
                style={{
                  background: 'none',
                  border: '1px solid var(--cream-border)',
                  borderRadius: '2px',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  color: 'var(--muted)',
                  fontSize: '0.8rem',
                  flexShrink: 0,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#FCA5A5'; e.currentTarget.style.color = '#EF4444' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--cream-border)'; e.currentTarget.style.color = 'var(--muted)' }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addService}
          style={{
            background: 'none',
            border: '1px solid var(--forest-light)',
            borderRadius: '2px',
            padding: '8px 16px',
            cursor: 'pointer',
            color: 'var(--forest-mid)',
            fontSize: '0.82rem',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--cream)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
        >
          + Add service
        </button>
      </section>

      {/* PDPA notice */}
      <section style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '2px', padding: '24px' }}>
        <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#92400E', marginBottom: '8px' }}>
          Your PDPA obligations (Singapore)
        </p>
        <ul style={{ fontSize: '0.8rem', color: '#92400E', lineHeight: 1.8, paddingLeft: '16px', fontWeight: 300 }}>
          <li>Inform patients that their WhatsApp messages are processed by an AI assistant</li>
          <li>Include a privacy notice on your clinic website or at reception</li>
          <li>Patient data may only be used for appointment management</li>
          <li>Patients may request access to or deletion of their data — contact support@clivo.app</li>
          <li>Notify PDPC and affected patients within 3 days of any data breach</li>
        </ul>
      </section>

      {/* Save bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={save}
          disabled={saving}
          className="btn-gold"
          style={{ opacity: saving ? 0.6 : 1 }}
        >
          {saving ? 'Saving…' : saved ? 'Saved!' : 'Save settings'}
          {!saving && !saved && (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          )}
          {saved && (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l3.5 3.5L12 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          )}
        </button>
        {error && <p style={{ color: '#EF4444', fontSize: '0.85rem' }}>{error}</p>}
      </div>
    </div>
  )
}
