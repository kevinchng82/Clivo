'use client'
import Link from 'next/link'

const navLinks = [
  {
    href: '/dashboard',
    label: 'Bookings',
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <rect x="2" y="3" width="11" height="10" rx="1" stroke="currentColor" strokeWidth="1.1"/>
        <path d="M2 6h11M5 2v2M10 2v2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: '/dashboard/faqs',
    label: 'FAQs',
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M2 4h11M2 7.5h8M2 11h6" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: '/dashboard/settings',
    label: 'Settings',
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <circle cx="7.5" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.1"/>
        <path d="M7.5 1v1.5M7.5 12.5V14M1 7.5h1.5M12.5 7.5H14M2.6 2.6l1 1M11.4 11.4l1 1M11.4 2.6l-1 1M2.6 11.4l1-1" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
      </svg>
    ),
  },
]

export default function SidebarNav() {
  return (
    <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
      {navLinks.map(link => (
        <Link
          key={link.href}
          href={link.href}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 12px',
            color: 'var(--muted-light)',
            fontSize: '0.85rem',
            fontWeight: 400,
            borderRadius: '2px',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
            letterSpacing: '0.01em',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(250,246,239,0.07)'
            e.currentTarget.style.color = 'var(--gold-light)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = 'var(--muted-light)'
          }}
        >
          {link.icon}
          {link.label}
        </Link>
      ))}
    </nav>
  )
}
