'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [tokenError, setTokenError] = useState(false)

  // Supabase sends access_token and refresh_token as URL hash params (#)
  // We extract them client-side
  const [accessToken, setAccessToken] = useState('')

  useEffect(() => {
    // Check for token in hash (Supabase default) or query param (PKCE flow)
    const hash = window.location.hash
    const hashParams = new URLSearchParams(hash.replace('#', ''))
    const token = hashParams.get('access_token') || searchParams.get('access_token') || ''
    if (!token) setTokenError(true)
    setAccessToken(token)
  }, [searchParams])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Server error')
      setDone(true)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (tokenError) {
    return (
      <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '2px', padding: '24px', textAlign: 'center' }}>
        <p style={{ color: '#B91C1C', fontSize: '0.9rem' }}>
          Invalid or expired reset link. Please{' '}
          <a href="/forgot-password" style={{ color: '#7F1D1D', textDecoration: 'underline' }}>request a new one</a>.
        </p>
      </div>
    )
  }

  if (done) {
    return (
      <div style={{ background: 'white', border: '1px solid var(--cream-border)', borderRadius: '2px', padding: '28px', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '12px' }}>✅</div>
        <p className="font-display" style={{ fontSize: '1.1rem', color: 'var(--forest)', marginBottom: '8px' }}>Password updated</p>
        <p style={{ color: 'var(--muted)', fontSize: '0.85rem', fontWeight: 300, marginBottom: '20px' }}>
          Your password has been changed successfully.
        </p>
        <a href="/login" className="btn-gold" style={{ display: 'inline-flex', justifyContent: 'center' }}>
          Sign in
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-mid)', marginBottom: '8px', fontWeight: 500 }}>
          New password
        </label>
        <input
          type="password"
          required
          minLength={8}
          className="input-warm"
          placeholder="Minimum 8 characters"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-mid)', marginBottom: '8px', fontWeight: 500 }}>
          Confirm new password
        </label>
        <input
          type="password"
          required
          className="input-warm"
          placeholder="Repeat your new password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
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
        {loading ? 'Saving…' : 'Set new password'}
        {!loading && (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        )}
      </button>
    </form>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--cream)' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <h1 className="font-display" style={{ fontSize: '2rem', fontWeight: 400, color: 'var(--forest)', marginBottom: '8px' }}>
          Set new password
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '28px', fontWeight: 300 }}>
          Choose a strong password for your clinic account.
        </p>
        <Suspense>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  )
}
