import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { clinicId, faqs } = await req.json()
  if (!clinicId) return NextResponse.json({ error: 'Missing clinicId' }, { status: 400 })

  const { error } = await supabase
    .from('clinic_settings')
    .update({ faqs, updated_at: new Date().toISOString() })
    .eq('clinic_id', clinicId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
