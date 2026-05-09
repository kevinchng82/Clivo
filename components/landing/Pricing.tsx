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
    setLoading(true)
    const res = await fetch('/api/onboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const { checkoutUrl, error } = await res.json()
    if (error) {
      alert(error)
      setLoading(false)
      return
    }
    window.location.href = checkoutUrl
  }

  return (
    <section id="pricing" className="bg-white py-20 px-6">
      <div className="max-w-md mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Simple pricing</h2>
        <p className="text-center text-gray-600 mb-8">SGD $49/month per clinic. Cancel anytime.</p>
        <div className="bg-blue-600 text-white p-8 rounded-2xl shadow-lg">
          <div className="text-4xl font-bold mb-2">SGD $49<span className="text-xl font-normal">/month</span></div>
          <ul className="mb-8 space-y-2 text-blue-100">
            <li>✓ Unlimited patient conversations</li>
            <li>✓ Appointment booking via WhatsApp</li>
            <li>✓ Instant owner notifications</li>
            <li>✓ Web dashboard</li>
            <li>✓ 14-day free trial</li>
          </ul>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              required
              placeholder="Clinic name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full p-3 rounded-lg text-gray-900"
            />
            <input
              required
              type="email"
              placeholder="Your email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full p-3 rounded-lg text-gray-900"
            />
            <input
              required
              placeholder="Clinic WhatsApp number (e.g. 6591234567)"
              value={form.whatsapp}
              onChange={e => setForm({ ...form, whatsapp: e.target.value })}
              className="w-full p-3 rounded-lg text-gray-900"
            />
            <label className="flex items-start gap-2 text-blue-100 text-sm cursor-pointer">
              <input
                type="checkbox"
                required
                checked={form.pdpaConsent}
                onChange={e => setForm({ ...form, pdpaConsent: e.target.checked })}
                className="mt-1 flex-shrink-0"
              />
              <span>
                I agree that patient appointment data collected via WhatsApp will be processed and stored by Clivo on behalf of my clinic, in accordance with Singapore&apos;s Personal Data Protection Act (PDPA). Patients will be informed via our clinic&apos;s privacy notice.
              </span>
            </label>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-blue-600 font-bold py-3 rounded-lg hover:bg-blue-50 transition disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Start Free Trial'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
