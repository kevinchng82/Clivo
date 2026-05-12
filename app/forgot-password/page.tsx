'use client'
import { useState } from 'react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Server error')
      setSent(true)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--cream)' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <a
          href="/login"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--muted)', fontSize: '0.82rem', textDecoration: 'none', marginBottom: '32px' }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M13 7H1M6 2L1 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Back to sign in
        </a>

        <h1 className="font-display" style={{ fontSize: '2rem', fontWeight: 400, color: 'var(--forest)', marginBottom: '8px' }}>
          Reset your password
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '28px', fontWeight: 300 }}>
          Enter your email and we will send you a reset link.
        </p>

        {sent ? (
          <div style={{ background: 'white', border: '1px solid var(--cream-border)', borderRadius: '2px', padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>✉️</div>
            <p className="font-display" style={{ fontSize: '1.1rem', color: 'var(--forest)', marginBottom: '8px' }}>Check your email</p>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem', fontWeight: 300, lineHeight: 1.6 }}>
              A password reset link has been sent to <strong>{email}</strong>. Check your inbox and click the link to set a new password.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-mid)', marginBottom: '8px', fontWeight: 500 }}>
                Email address
              </label>
              <input
                type="email"
                required
                className="input-warm"
                placeholder="you@yourclinic.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            {error && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '2px', padding: '12px 16px', color: '#B91C1C', fontSize: '0.85rem' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-gold"
              style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.6 : 1 }}
            >
              {loading ? 'Sending…' : 'Send reset link'}
              {!loading && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
