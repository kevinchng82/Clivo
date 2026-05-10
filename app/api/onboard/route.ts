import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { createCheckoutSession } from '@/lib/stripe'
import { isRateLimited } from '@/lib/rateLimit'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^\+\d{7,15}$/

export async function POST(req: NextRequest) {
  // M-03: rate limit by IP to prevent database flooding
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (isRateLimited(`onboard:${ip}`, 5, 60_000)) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
  }

  const { name, email, whatsapp, pdpaConsent } = await req.json()

  if (!pdpaConsent) {
    return NextResponse.json({ error: 'PDPA consent is required' }, { status: 400 })
  }

  if (!name || !email || !whatsapp) {
    return NextResponse.json({ error: 'name, email, and whatsapp are required' }, { status: 400 })
  }

  // M-03: validate email and phone format
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }
  if (!PHONE_RE.test(whatsapp)) {
    return NextResponse.json({ error: 'WhatsApp number must be in international format, e.g. +6591234567' }, { status: 400 })
  }

  const { data: clinic, error } = await supabase
    .from('clinics')
    .insert({
      name,
      owner_email: email,
      owner_whatsapp: whatsapp,
      pdpa_consent: true,
      pdpa_consent_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    const msg = error.code === '23505'
      ? 'An account with this email already exists.'
      : 'Registration failed. Please try again.'
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  // M-01: check clinic_settings insert — failure means AI has no context
  const { error: settingsError } = await supabase
    .from('clinic_settings')
    .insert({ clinic_id: clinic.id })

  if (settingsError) {
    console.error('clinic_settings insert failed:', settingsError)
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 })
  }

  await supabase.from('audit_log').insert({
    clinic_id: clinic.id,
    event: 'clinic_registered',
    actor: email,
    detail: { name, whatsapp },
  })

  const checkoutUrl = await createCheckoutSession(clinic.id, email)
  return NextResponse.json({ checkoutUrl })
}
