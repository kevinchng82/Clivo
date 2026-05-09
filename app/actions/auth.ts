'use server'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { createSession, deleteSession } from '@/lib/session'

export interface LoginState {
  error?: string
}

export async function login(_prev: LoginState | undefined, formData: FormData): Promise<LoginState> {
  const email = formData.get('email')?.toString().trim() ?? ''
  const password = formData.get('password')?.toString() ?? ''

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  // Look up clinic by owner email
  const { data: clinic, error: clinicError } = await supabase
    .from('clinics')
    .select('id, owner_email')
    .eq('owner_email', email)
    .single()

  if (clinicError || !clinic) {
    return { error: 'Invalid email or password.' }
  }

  // Verify password against Supabase Auth (anon key path)
  const { createClient } = await import('@supabase/supabase-js')
  const anonClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { error: authError } = await anonClient.auth.signInWithPassword({ email, password })

  if (authError) {
    return { error: 'Invalid email or password.' }
  }

  await createSession(clinic.id, email)
  redirect('/dashboard')
}

export async function logout() {
  await deleteSession()
  redirect('/login')
}
