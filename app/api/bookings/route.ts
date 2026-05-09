import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const clinicId = req.nextUrl.searchParams.get('clinicId')
  if (!clinicId) return NextResponse.json({ error: 'Missing clinicId' }, { status: 400 })

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('clinic_id', clinicId)
    .order('appointment_dt', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ bookings })
}
