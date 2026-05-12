'use client'
import { useState } from 'react'

export default function Pricing() {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', whatsapp: '', pdpaConsent: false })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.pdpaConsent) {
      alert('Please agree to the data privacy terms to continue.')
      return
    }
    if (!/^\d{10,15}$/.test(form.whatsapp)) {
      alert('Please enter a valid WhatsApp number (digits only, e.g. 6591234567).')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const { checkoutUrl, error } = await res.json()
      if (error) {
        alert(error)
        return
      }
      window.location.href = checkoutUrl
    } catch {
      alert('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      id="pricing"
      style={{ background: 'var(--forest)', borderTop: '1px solid var(--forest-mid)' }}
      className="py-28 px-6 relative overflow-hidden"
    >
      {/* Decorative background shapes */}
      <div
        style={{
          position: 'absolute',
          top: '-80px',
          right: '-80px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-60px',
          left: '-60px',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(61,122,92,0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="max-w-5xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div
            className="ornament mb-5 justify-center"
            style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', display: 'flex' }}
          >
            Pricing
          </div>
          <h2
            className="font-display"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              fontWeight: 400,
              color: 'var(--cream)',
              lineHeight: 1.1,
            }}
          >
            Simple, honest pricing
          </h2>
          <p style={{ color: 'var(--muted-light)', marginTop: '12px', fontWeight: 300, fontSize: '1rem' }}>
            One plan. Everything included. No surprises.
          </p>
        </div>

        {/* Pricing card + form side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0" style={{ border: '1px solid rgba(201,168,76,0.25)' }}>
          {/* Left: plan details */}
          <div
            style={{
              padding: '48px',
              borderRight: '1px solid rgba(201,168,76,0.2)',
              background: 'rgba(255,255,255,0.03)',
            }}
          >
            <div className="font-display" style={{ color: 'var(--gold)', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '24px' }}>
              Clinic Plan
            </div>

            <div className="font-display" style={{ fontSize: '4.5rem', fontWeight: 300, color: 'var(--cream)', lineHeight: 1, letterSpacing: '-0.03em' }}>
              $49
              <span style={{ fontSize: '1.1rem', color: 'var(--muted-light)', fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>/month</span>
            </div>
            <div style={{ color: 'var(--muted-light)', fontSize: '0.85rem', marginTop: '6px', marginBottom: '36px' }}>SGD · per clinic</div>

            <div style={{ borderTop: '1px solid rgba(201,168,76,0.15)', paddingTop: '32px' }}>
              {[
                'Unlimited patient conversations',
                'Appointment booking via WhatsApp',
                'Instant owner notifications',
                'Web dashboard & analytics',
                '14-day free trial included',
                'PDPA compliant',
              ].map(item => (
                <div key={item} className="flex items-center gap-3 mb-4">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M2 7l3.5 3.5L12 3" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span style={{ color: 'var(--cream-dark)', fontSize: '0.9rem', fontWeight: 300 }}>{item}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(201,168,76,0.1)' }}>
              <p style={{ color: 'var(--muted-light)', fontSize: '0.78rem', lineHeight: 1.6, fontWeight: 300 }}>
                Cancel anytime. No setup fees. Your data stays yours.
              </p>
            </div>
          </div>

          {/* Right: form */}
          <div style={{ padding: '48px', background: 'rgba(255,255,255,0.04)' }}>
            <div className="font-display" style={{ color: 'var(--cream)', fontSize: '1.5rem', fontWeight: 400, marginBottom: '8px' }}>
              Start your free trial
            </div>
            <p style={{ color: 'var(--muted-light)', fontSize: '0.85rem', marginBottom: '28px', fontWeight: 300 }}>
              14 days free. No credit card required until after trial.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label style={{ display: 'block', color: 'var(--muted-light)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Clinic Name
                </label>
                <input
                  required
                  placeholder="Tan Family Clinic"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'rgba(250,246,239,0.07)',
                    border: '1px solid rgba(201,168,76,0.2)',
                    borderRadius: '2px',
                    padding: '12px 16px',
                    color: 'var(--cream)',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(201,168,76,0.6)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(201,168,76,0.2)')}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: 'var(--muted-light)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  placeholder="doctor@clinic.com.sg"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'rgba(250,246,239,0.07)',
                    border: '1px solid rgba(201,168,76,0.2)',
                    borderRadius: '2px',
                    padding: '12px 16px',
                    color: 'var(--cream)',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(201,168,76,0.6)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(201,168,76,0.2)')}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: 'var(--muted-light)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  WhatsApp Number
                </label>
                <input
                  required
                  placeholder="6591234567"
                  value={form.whatsapp}
                  onChange={e => setForm({ ...form, whatsapp: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'rgba(250,246,239,0.07)',
                    border: '1px solid rgba(201,168,76,0.2)',
                    borderRadius: '2px',
                    padding: '12px 16px',
                    color: 'var(--cream)',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(201,168,76,0.6)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(201,168,76,0.2)')}
                />
              </div>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  cursor: 'pointer',
                  marginTop: '4px',
                }}
              >
                <input
                  type="checkbox"
                  required
                  checked={form.pdpaConsent}
                  onChange={e => setForm({ ...form, pdpaConsent: e.target.checked })}
                  style={{ marginTop: '3px', flexShrink: 0, accentColor: 'var(--gold)' }}
                />
                <span style={{ color: 'var(--muted-light)', fontSize: '0.78rem', lineHeight: 1.6, fontWeight: 300 }}>
                  I agree that patient appointment data collected via WhatsApp will be processed and stored by Clivo on behalf of my clinic, in accordance with Singapore&apos;s PDPA.
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="btn-gold"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  marginTop: '8px',
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? 'Redirecting to payment…' : 'Begin free trial'}
                {!loading && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
