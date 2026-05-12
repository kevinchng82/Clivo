import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { verifySession } from '@/lib/session'

const PHONE_RE = /^\+\d{7,15}$/

export async function POST(req: NextRequest) {
  const { clinicId } = await verifySession()

  const { clinicName, ownerWhatsapp, whatsappPhoneNumberId, businessHours, services } = await req.json()

  if (!clinicName?.trim()) {
    return NextResponse.json({ error: 'Clinic name is required.' }, { status: 400 })
  }
  if (ownerWhatsapp && !PHONE_RE.test(ownerWhatsapp)) {
    return NextResponse.json({ error: 'Owner WhatsApp must be in international format, e.g. +6591234567' }, { status: 400 })
  }

  // Update clinics table
  const { error: clinicError } = await supabase
    .from('clinics')
    .update({
      name: clinicName.trim(),
      owner_whatsapp: ownerWhatsapp?.trim() || null,
      whatsapp_phone_number_id: whatsappPhoneNumberId?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', clinicId)

  if (clinicError) {
    return NextResponse.json({ error: clinicError.message }, { status: 500 })
  }

  // Update clinic_settings table
  const { error: settingsError } = await supabase
    .from('clinic_settings')
    .update({
      business_hours: businessHours ?? {},
      services: services ?? [],
      updated_at: new Date().toISOString(),
    })
    .eq('clinic_id', clinicId)

  if (settingsError) {
    return NextResponse.json({ error: settingsError.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
