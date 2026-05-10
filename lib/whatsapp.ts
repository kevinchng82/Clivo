import axios from 'axios'

const BASE_URL = `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION ?? 'v21.0'}`

export async function sendWhatsAppMessage(
  phoneNumberId: string,
  to: string,
  message: string
): Promise<void> {
  await axios.post(
    `${BASE_URL}/${phoneNumberId}/messages`,
    {
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: message },
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    }
  )
}

export function extractMessageData(body: unknown): {
  from: string
  text: string
  phoneNumberId: string
} | null {
  try {
    const b = body as Record<string, unknown>
    const entry = (b.entry as unknown[])?.[0] as Record<string, unknown>
    const change = (entry?.changes as unknown[])?.[0] as Record<string, unknown>
    const value = change?.value as Record<string, unknown>
    const messages = value?.messages as unknown[]
    const message = messages?.[0] as Record<string, unknown>
    if (!message || message.type !== 'text') return null
    const textObj = message.text as Record<string, string>
    const metadata = value.metadata as Record<string, string>
    return {
      from: message.from as string,
      text: textObj.body,
      phoneNumberId: metadata.phone_number_id,
    }
  } catch {
    return null
  }
}
