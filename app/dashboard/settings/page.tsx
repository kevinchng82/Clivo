import { supabase } from '@/lib/supabase'
import { verifySession } from '@/lib/session'
import ClinicSettingsForm from '@/components/dashboard/ClinicSettingsForm'

export default async function SettingsPage() {
  const { clinicId } = await verifySession()

  const [{ data: clinic }, { data: settings }] = await Promise.all([
    supabase.from('clinics').select('name, owner_whatsapp, whatsapp_phone_number_id').eq('id', clinicId).single(),
    supabase.from('clinic_settings').select('business_hours, services').eq('clinic_id', clinicId).single(),
  ])

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '8px' }}>
          Dashboard
        </div>
        <h1 className="font-display" style={{ fontSize: '2.2rem', fontWeight: 400, color: 'var(--forest)', lineHeight: 1.1 }}>
          Settings
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginTop: '6px', fontWeight: 300 }}>
          Configure your clinic information, hours, and services
        </p>
      </div>

      <ClinicSettingsForm
        initial={{
          clinicName: clinic?.name ?? '',
          ownerWhatsapp: clinic?.owner_whatsapp ?? '',
          whatsappPhoneNumberId: clinic?.whatsapp_phone_number_id ?? '',
          businessHours: (settings?.business_hours as Record<string, string>) ?? {},
          services: (settings?.services as string[]) ?? [],
        }}
      />
    </div>
  )
}
