'use server'
import { redirect } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
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

  // H-05: run both checks always — prevents timing-based email enumeration
  const anonClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [{ data: clinic }, { error: authError }] = await Promise.all([
    supabase.from('clinics').select('id').eq('owner_email', email).single(),
    anonClient.auth.signInWithPassword({ email, password }),
  ])

  if (!clinic || authError) {
    return { error: 'Invalid email or password.' }
  }

  await createSession(clinic.id, email)
  redirect('/dashboard')
}

export async function logout() {
  await deleteSession()
  redirect('/login')
}
