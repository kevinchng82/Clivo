import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export interface ClinicContext {
  clinicName: string
  businessHours: Record<string, string>
  services: string[]
  faqs: Array<{ question: string; answer: string }>
}

export interface ConversationResult {
  reply: string
  action: 'none' | 'book_appointment' | 'escalate'
  bookingDetails?: {
    customerName: string
    service: string
    requestedTime: string
  }
}

export async function processMessage(
  customerMessage: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>,
  context: ClinicContext
): Promise<ConversationResult> {
  const systemPrompt = `You are the AI receptionist for ${context.clinicName}.

Business hours: ${JSON.stringify(context.businessHours)}
Services offered: ${context.services.join(', ')}

FAQs you know:
${context.faqs.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n')}

Your job:
1. Answer questions about the clinic using the information above
2. Help patients book appointments by collecting: their name, service needed, and preferred date/time
3. If you cannot answer a question, say you will get the clinic staff to follow up

When you have collected all booking details (name, service, date/time), end your reply with exactly:
BOOKING_READY|name:<name>|service:<service>|time:<requested_time>

If a question is too complex or sensitive (medical advice, complaints), end your reply with:
ESCALATE

Keep replies short and friendly. Use simple English. This is WhatsApp — no markdown.`

  const messages = [
    ...conversationHistory,
    { role: 'user' as const, content: customerMessage },
  ]

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 500,
    system: systemPrompt,
    messages,
  })

  const replyText = response.content[0]?.type === 'text' ? response.content[0].text : ''

  if (replyText.includes('BOOKING_READY|')) {
    const parts = replyText.split('|')
    const name = parts.find(p => p.startsWith('name:'))?.replace('name:', '') ?? ''
    const service = parts.find(p => p.startsWith('service:'))?.replace('service:', '') ?? ''
    const time = parts.find(p => p.startsWith('time:'))?.replace('time:', '') ?? ''
    const reply = replyText.split('BOOKING_READY|')[0].trim()
    return {
      reply: reply || `Thank you ${name}! I have noted your appointment for ${service} at ${time}. We will confirm shortly.`,
      action: 'book_appointment',
      bookingDetails: { customerName: name, service, requestedTime: time },
    }
  }

  if (replyText.trimEnd().endsWith('ESCALATE')) {
    return {
      reply: replyText.replace('ESCALATE', '').trim() || 'Our staff will follow up with you shortly.',
      action: 'escalate',
    }
  }

  return { reply: replyText, action: 'none' }
}
