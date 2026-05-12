'use client'
import { useActionState } from 'react'
import { login } from '@/app/actions/auth'

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined)

  return (
    <div
      className="min-h-screen flex"
      style={{ background: 'var(--cream)' }}
    >
      {/* Left decorative panel */}
      <div
        className="hidden lg:flex flex-col justify-between p-16"
        style={{
          width: '420px',
          flexShrink: 0,
          background: 'var(--forest)',
          borderRight: '1px solid var(--forest-mid)',
        }}
      >
        <div className="font-display text-2xl font-semibold" style={{ color: 'var(--gold-light)' }}>
          Clivo
        </div>

        <div>
          <p
            className="font-display"
            style={{
              fontSize: '2.4rem',
              fontWeight: 300,
              color: 'var(--cream)',
              lineHeight: 1.2,
              marginBottom: '20px',
            }}
          >
            Your AI receptionist is{' '}
            <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>always on duty.</em>
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'var(--forest-light)',
                display: 'inline-block',
                boxShadow: '0 0 0 3px rgba(61,122,92,0.3)',
                flexShrink: 0,
              }}
            />
            <span style={{ color: 'var(--muted-light)', fontSize: '0.82rem', fontWeight: 300 }}>
              AI is live — answering patients now
            </span>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(201,168,76,0.15)', paddingTop: '24px' }}>
          <p style={{ color: 'var(--muted-light)', fontSize: '0.78rem', lineHeight: 1.6, fontWeight: 300 }}>
            Clivo · AI Receptionist for Singapore Clinics
          </p>
        </div>
      </div>

      {/* Right: login form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div style={{ width: '100%', maxWidth: '380px' }}>
          {/* Mobile logo */}
          <div className="lg:hidden font-display text-2xl font-semibold mb-10" style={{ color: 'var(--forest)' }}>
            Clivo
          </div>

          <div style={{ marginBottom: '36px' }}>
            <h1
              className="font-display"
              style={{ fontSize: '2rem', fontWeight: 400, color: 'var(--forest)', lineHeight: 1.1, marginBottom: '8px' }}
            >
              Welcome back
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', fontWeight: 300 }}>
              Sign in to your clinic dashboard
            </p>
          </div>

          <form action={action} className="flex flex-col gap-5">
            <div>
              <label
                htmlFor="email"
                style={{
                  display: 'block',
                  color: 'var(--ink-mid)',
                  fontSize: '0.7rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                  fontWeight: 500,
                }}
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@yourclinic.com"
                className="input-warm"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                style={{
                  display: 'block',
                  color: 'var(--ink-mid)',
                  fontSize: '0.7rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                  fontWeight: 500,
                }}
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="input-warm"
              />
            </div>

            {state?.error && (
              <div
                style={{
                  background: '#FEF2F2',
                  border: '1px solid #FECACA',
                  borderRadius: '2px',
                  padding: '12px 16px',
                  color: '#B91C1C',
                  fontSize: '0.85rem',
                }}
              >
                {state.error}
              </div>
            )}

            <button
              type="submit"
              disabled={pending}
              className="btn-gold"
              style={{ width: '100%', justifyContent: 'center', marginTop: '4px', opacity: pending ? 0.6 : 1 }}
            >
              {pending ? 'Signing in…' : 'Sign in'}
              {!pending && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              )}
            </button>
          </form>

          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <a
              href="/forgot-password"
              style={{ color: 'var(--muted)', fontSize: '0.82rem', textDecoration: 'none', borderBottom: '1px solid var(--cream-border)' }}
            >
              Forgot your password?
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
