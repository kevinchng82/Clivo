import { NextRequest, NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'
import { supabase } from '@/lib/supabase'
import { sendWhatsAppMessage, extractMessageData } from '@/lib/whatsapp'
import { processMessage } from '@/lib/claude'
import { isRateLimited } from '@/lib/rateLimit'

// GET: Meta webhook verification handshake
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')
  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 })
  }
  return new NextResponse('Forbidden', { status: 403 })
}

export async function POST(req: NextRequest) {
  const appSecret = process.env.WHATSAPP_APP_SECRET
  if (!appSecret) return new NextResponse('Forbidden', { status: 403 })

  const rawBody = await req.text()
  const sig = req.headers.get('x-hub-signature-256') ?? ''
  const expected = 'sha256=' + createHmac('sha256', appSecret).update(rawBody).digest('hex')

  // H-03: timing-safe comparison to prevent HMAC oracle attacks
  const sigBuf = Buffer.from(sig)
  const expectedBuf = Buffer.from(expected)
  const valid = sigBuf.length === expectedBuf.length && timingSafeEqual(sigBuf, expectedBuf)
  if (!valid) return new NextResponse('Forbidden', { status: 403 })

  const body = JSON.parse(rawBody) as unknown
  const msg = extractMessageData(body)
  if (!msg) return NextResponse.json({ status: 'ignored' })

  const { from, text, phoneNumberId } = msg

  if (isRateLimited(from)) {
    return NextResponse.json({ status: 'rate_limited' })
  }

  // Find clinic by WhatsApp phone number ID
  const { data: clinic } = await supabase
    .from('clinics')
    .select('*, clinic_settings(*)')
    .eq('whatsapp_phone_number_id', phoneNumberId)
    .single()

  if (!clinic || clinic.subscription_status === 'cancelled') {
    return NextResponse.json({ status: 'no_clinic' })
  }

  // Load or create conversation record
  const { data: conv, error: convError } = await supabase
    .from('conversations')
    .upsert(
      { clinic_id: clinic.id, customer_phone: from },
      { onConflict: 'clinic_id,customer_phone' }
    )
    .select()
    .single()

  if (convError || !conv) {
    console.error('conversations upsert failed:', convError)
    return NextResponse.json({ status: 'db_error' }, { status: 500 })
  }

  const history = (
    (conv.context as { history?: Array<{ role: 'user' | 'assistant'; content: string }> })
      ?.history ?? []
  )

  // M-04: clinic_settings join returns an array — take first element defensively
  const settingsRaw = Array.isArray(clinic.clinic_settings)
    ? clinic.clinic_settings[0]
    : clinic.clinic_settings
  const settings = settingsRaw as {
    business_hours: Record<string, string>
    services: string[]
    faqs: Array<{ question: string; answer: string }>
  } | null

  const context = {
    clinicName: clinic.name as string,
    businessHours: settings?.business_hours ?? {},
    services: settings?.services ?? [],
    faqs: settings?.faqs ?? [],
  }

  let result
  try {
    result = await processMessage(text, history, context)
  } catch {
    await sendWhatsAppMessage(
      phoneNumberId,
      from,
      'Sorry, I am having trouble right now. Please try again shortly.'
    ).catch(() => undefined)
    return NextResponse.json({ status: 'ai_error' })
  }

  // Keep last 20 individual messages (10 exchange pairs) within context budget
  const updatedHistory = [
    ...history,
    { role: 'user' as const, content: text },
    { role: 'assistant' as const, content: result.reply },
  ].slice(-20)

  await supabase
    .from('conversations')
    .update({
      context: { history: updatedHistory },
      updated_at: new Date().toISOString(),
    })
    .eq('id', conv.id)

  // Handle booking
  if (result.action === 'book_appointment' && result.bookingDetails) {
    const { customerName, service, requestedTime } = result.bookingDetails

    // H-04: reject unparseable dates instead of silently using current time
    const parsedDate = new Date(requestedTime)
    if (isNaN(parsedDate.getTime())) {
      console.error('Invalid requestedTime from AI:', requestedTime)
      await sendWhatsAppMessage(
        phoneNumberId,
        from,
        'Could you please confirm the exact date and time you would like? For example: "Thursday 3pm" or "15 May at 10am".'
      ).catch(() => undefined)
      return NextResponse.json({ status: 'ok' })
    }

    const appointmentDt = parsedDate.toISOString()

    const { error: bookingError } = await supabase.from('bookings').insert({
      clinic_id: clinic.id,
      customer_phone: from,
      customer_name: customerName,
      service,
      appointment_dt: appointmentDt,
    })

    if (!bookingError) {
      await supabase.from('audit_log').insert({
        clinic_id: clinic.id,
        event: 'booking_created',
        actor: 'whatsapp_webhook',
        detail: { customer_phone: from, service, requestedTime },
      })

      await sendWhatsAppMessage(
        phoneNumberId,
        clinic.owner_whatsapp as string,
        `New booking at ${clinic.name}:\nPatient: ${customerName}\nService: ${service}\nTime: ${requestedTime}\nPhone: ${from}`
      ).catch(() => undefined)
    } else {
      console.error('bookings insert failed:', bookingError)
    }
  }

  // M-06: catch patient reply failure — return 200 so Meta doesn't retry and double-process
  try {
    await sendWhatsAppMessage(phoneNumberId, from, result.reply)
  } catch (err) {
    console.error('Failed to send WhatsApp reply to patient:', err)
  }
  return NextResponse.json({ status: 'ok' })
}
