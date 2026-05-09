import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { verifySession } from '@/lib/session'

export async function POST(req: NextRequest) {
  const { clinicId } = await verifySession()

  const { faqs } = await req.json()

  const { error } = await supabase
    .from('clinic_settings')
    .update({ faqs, updated_at: new Date().toISOString() })
    .eq('clinic_id', clinicId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
