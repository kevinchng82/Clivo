import Link from 'next/link'
import { logout } from '@/app/actions/auth'
import SidebarNav from '@/components/dashboard/SidebarNav'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex" style={{ background: 'var(--cream)' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: '220px',
          flexShrink: 0,
          background: 'var(--forest)',
          display: 'flex',
          flexDirection: 'column',
          padding: '32px 24px',
          gap: '4px',
        }}
      >
        {/* Logo */}
        <div
          className="font-display"
          style={{ fontSize: '1.6rem', fontWeight: 600, color: 'var(--gold-light)', marginBottom: '40px', letterSpacing: '-0.01em' }}
        >
          Clivo
        </div>

        {/* AI status pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(61,122,92,0.2)',
            border: '1px solid rgba(61,122,92,0.3)',
            borderRadius: '2px',
            padding: '8px 12px',
            marginBottom: '28px',
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'var(--forest-light)',
              display: 'inline-block',
              boxShadow: '0 0 0 2px rgba(61,122,92,0.4)',
              flexShrink: 0,
            }}
          />
          <span style={{ color: 'var(--muted-light)', fontSize: '0.7rem', letterSpacing: '0.05em' }}>AI Online</span>
        </div>

        {/* Nav links (client component for hover) */}
        <SidebarNav />

        {/* Sign out */}
        <div style={{ borderTop: '1px solid rgba(201,168,76,0.1)', paddingTop: '20px', marginTop: '8px' }}>
          <form action={logout}>
            <button
              type="submit"
              style={{
                width: '100%',
                textAlign: 'left',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--muted)',
                fontSize: '0.78rem',
                padding: '8px 12px',
                letterSpacing: '0.05em',
              }}
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-10" style={{ minWidth: 0 }}>
        {children}
      </main>
    </div>
  )
}
