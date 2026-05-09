import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { verifySession } from '@/lib/session'

export async function GET() {
  const { clinicId } = await verifySession()

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('clinic_id', clinicId)
    .order('appointment_dt', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ bookings })
}
