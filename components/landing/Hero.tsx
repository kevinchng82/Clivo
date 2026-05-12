export default function Hero() {
  return (
    <section
      style={{ background: 'var(--cream)' }}
      className="relative min-h-screen flex flex-col overflow-hidden"
    >
      {/* Top nav */}
      <nav className="flex items-center justify-between px-8 md:px-16 pt-8 pb-0 animate-fade-up">
        <div className="font-display text-2xl font-semibold tracking-tight" style={{ color: 'var(--forest)' }}>
          Clivo
        </div>
        <a
          href="#pricing"
          className="btn-gold text-xs"
        >
          Start Free Trial
        </a>
      </nav>

      {/* Decorative vertical lines */}
      <div
        className="absolute top-0 left-1/4 h-full w-px opacity-20 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, var(--gold), transparent)' }}
      />
      <div
        className="absolute top-0 right-1/4 h-full w-px opacity-10 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, var(--forest-mid), transparent)' }}
      />

      {/* Hero content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-16 pb-24">
        {/* Eyebrow */}
        <div className="ornament mb-8 animate-fade-up-delay-1" style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', fontFamily: "'DM Sans', sans-serif" }}>
          AI Receptionist for Singapore Clinics
        </div>

        {/* Headline */}
        <h1
          className="font-display animate-fade-up-delay-2"
          style={{
            fontSize: 'clamp(3rem, 8vw, 6.5rem)',
            fontWeight: 400,
            lineHeight: 1.05,
            color: 'var(--forest)',
            maxWidth: '800px',
            letterSpacing: '-0.02em',
          }}
        >
          Your clinic never<br />
          <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>misses a patient</em><br />
          again.
        </h1>

        {/* Subtext */}
        <p
          className="animate-fade-up-delay-3 mt-8"
          style={{
            color: 'var(--muted)',
            fontSize: '1.1rem',
            maxWidth: '520px',
            lineHeight: 1.7,
            fontWeight: 300,
          }}
        >
          Clivo is a WhatsApp AI receptionist that answers questions, books appointments, and notifies you — 24 hours a day, 7 days a week.
        </p>

        {/* CTA */}
        <div className="animate-fade-up-delay-4 mt-10 flex flex-col sm:flex-row items-center gap-4">
          <a href="#pricing" className="btn-gold">
            Start 14-day free trial
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </a>
          <span style={{ color: 'var(--muted-light)', fontSize: '0.8rem' }}>No setup fee · Cancel anytime</span>
        </div>

        {/* AI status badge */}
        <div
          className="animate-fade-up-delay-4 mt-16"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            background: 'white',
            border: '1px solid var(--cream-border)',
            borderRadius: '2px',
            padding: '10px 20px',
            fontSize: '0.8rem',
            color: 'var(--ink-mid)',
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'var(--forest-light)',
              display: 'inline-block',
              boxShadow: '0 0 0 3px rgba(61,122,92,0.2)',
              flexShrink: 0,
            }}
          />
          <span style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.05em' }}>
            AI is online — answering patients right now
          </span>
        </div>
      </div>

      {/* Bottom decorative band */}
      <div
        style={{
          height: '3px',
          background: 'linear-gradient(to right, transparent, var(--gold), var(--forest-mid), var(--gold), transparent)',
          opacity: 0.4,
        }}
      />
    </section>
  )
}
