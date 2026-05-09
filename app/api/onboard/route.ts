import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { createCheckoutSession } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  const { name, email, whatsapp, pdpaConsent } = await req.json()

  if (!pdpaConsent) {
    return NextResponse.json({ error: 'PDPA consent is required' }, { status: 400 })
  }

  if (!name || !email || !whatsapp) {
    return NextResponse.json({ error: 'name, email, and whatsapp are required' }, { status: 400 })
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
    // Postgres unique violation — don't leak internal constraint names
    const msg = error.code === '23505'
      ? 'An account with this email already exists.'
      : 'Registration failed. Please try again.'
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  await supabase.from('clinic_settings').insert({ clinic_id: clinic.id })

  await supabase.from('audit_log').insert({
    clinic_id: clinic.id,
    event: 'clinic_registered',
    actor: email,
    detail: { name, whatsapp },
  })

  const checkoutUrl = await createCheckoutSession(clinic.id, email)
  return NextResponse.json({ checkoutUrl })
}
