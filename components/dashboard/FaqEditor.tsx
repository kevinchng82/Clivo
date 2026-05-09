'use client'
import { useState } from 'react'

interface Faq { question: string; answer: string }

export default function FaqEditor({ clinicId, initial }: { clinicId: string; initial: Faq[] }) {
  const [faqs, setFaqs] = useState<Faq[]>(initial)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  function addFaq() {
    setFaqs([...faqs, { question: '', answer: '' }])
  }

  function removeFaq(i: number) {
    setFaqs(faqs.filter((_, idx) => idx !== i))
  }

  function updateFaq(i: number, field: 'question' | 'answer', value: string) {
    const updated = [...faqs]
    updated[i][field] = value
    setFaqs(updated)
  }

  async function save() {
    setSaving(true)
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clinicId, faqs }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      alert('Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      {faqs.map((faq, i) => (
        <div key={i} className="bg-white p-4 rounded-xl shadow-sm space-y-2">
          <input
            placeholder="Question (e.g. What are your opening hours?)"
            value={faq.question}
            onChange={e => updateFaq(i, 'question', e.target.value)}
            className="w-full border rounded-lg p-2 text-gray-900"
          />
          <textarea
            placeholder="Answer"
            value={faq.answer}
            onChange={e => updateFaq(i, 'answer', e.target.value)}
            className="w-full border rounded-lg p-2 text-gray-900"
            rows={2}
          />
          <button onClick={() => removeFaq(i)} className="text-red-500 text-sm hover:underline">Remove</button>
        </div>
      ))}
      <div className="flex gap-3">
        <button onClick={addFaq} className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50">Add FAQ</button>
        <button onClick={save} disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
          {saved ? 'Saved!' : saving ? 'Saving...' : 'Save FAQs'}
        </button>
      </div>
    </div>
  )
}
