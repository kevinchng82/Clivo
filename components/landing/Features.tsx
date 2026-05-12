const features = [
  {
    number: '01',
    title: '24/7 WhatsApp Receptionist',
    desc: 'Patients message your clinic WhatsApp any time. Clivo replies instantly — even at midnight, even on public holidays.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="9" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M11 6v5l3 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Answers FAQs Automatically',
    desc: 'Set up your clinic hours, services, and common questions once. Clivo handles every patient inquiry with calm precision.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M4 7h14M4 11h10M4 15h7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Books Appointments',
    desc: "Clivo collects the patient's name, service requested, and preferred time — then confirms the booking automatically.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="3" y="5" width="16" height="14" rx="1" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M3 9h16M8 3v4M14 3v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Notifies You Instantly',
    desc: 'Every new booking sends you a WhatsApp notification with full patient details. Stay informed without checking anything.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 3a8 8 0 0 1 8 8c0 3-1.5 5.5-4 7l-4 1-4-1C4.5 16.5 3 14 3 11a8 8 0 0 1 8-8Z" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M11 12V8M11 14.5v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
]

export default function Features() {
  return (
    <section style={{ background: 'white', borderTop: '1px solid var(--cream-border)' }} className="py-28 px-6">
      <style>{`
        .feature-card { transition: background 0.25s ease; }
        .feature-card:hover { background: var(--cream) !important; }
      `}</style>

      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="mb-20 max-w-xl">
          <div
            className="ornament mb-5"
            style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)' }}
          >
            What Clivo does
          </div>
          <h2
            className="font-display"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              fontWeight: 400,
              color: 'var(--forest)',
              lineHeight: 1.15,
              letterSpacing: '-0.01em',
            }}
          >
            Everything your receptionist does —{' '}
            <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>automated</em>
          </h2>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ border: '1px solid var(--cream-border)' }}>
          {features.map((f, i) => (
            <div
              key={f.number}
              className="feature-card"
              style={{
                padding: '40px 36px',
                background: 'white',
                borderRight: i % 2 === 0 ? '1px solid var(--cream-border)' : 'none',
                borderBottom: i < 2 ? '1px solid var(--cream-border)' : 'none',
              }}
            >
              <div className="flex items-start gap-5">
                <span
                  className="font-display"
                  style={{ fontSize: '0.75rem', color: 'var(--gold)', letterSpacing: '0.1em', paddingTop: '2px', flexShrink: 0 }}
                >
                  {f.number}
                </span>

                <div className="flex-1">
                  <div style={{ color: 'var(--forest-mid)', marginBottom: '14px' }}>
                    {f.icon}
                  </div>
                  <h3
                    className="font-display"
                    style={{ fontSize: '1.3rem', fontWeight: 500, color: 'var(--forest)', marginBottom: '10px', lineHeight: 1.3 }}
                  >
                    {f.title}
                  </h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.7, fontWeight: 300 }}>
                    {f.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom stat bar */}
        <div
          className="mt-16 grid grid-cols-3"
          style={{ borderTop: '1px solid var(--cream-border)', borderBottom: '1px solid var(--cream-border)' }}
        >
          {[
            { value: '24/7', label: 'Always available' },
            { value: '< 3s', label: 'Response time' },
            { value: '100%', label: 'Patient replies answered' },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="text-center py-10"
              style={{ borderRight: i < 2 ? '1px solid var(--cream-border)' : 'none' }}
            >
              <div
                className="font-display"
                style={{ fontSize: '2.2rem', fontWeight: 300, color: 'var(--forest)', letterSpacing: '-0.02em' }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '4px' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
