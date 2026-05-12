import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 })
  }

  const anonClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`

  // Always return success to prevent email enumeration
  await anonClient.auth.resetPasswordForEmail(email.trim().toLowerCase(), { redirectTo })

  return NextResponse.json({ ok: true })
}
