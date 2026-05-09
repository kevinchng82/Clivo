import FaqEditor from '@/components/dashboard/FaqEditor'
import { supabase } from '@/lib/supabase'

export default async function FaqsPage() {
  const clinicId = process.env.DEMO_CLINIC_ID || ''
  const { data: settings } = await supabase
    .from('clinic_settings')
    .select('faqs')
    .eq('clinic_id', clinicId)
    .single()

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">FAQ Management</h1>
      <p className="text-gray-500 mb-6">Add questions your patients frequently ask. Clivo will answer these automatically on WhatsApp.</p>
      {clinicId ? (
        <FaqEditor clinicId={clinicId} initial={(settings?.faqs as Array<{question:string;answer:string}>) || []} />
      ) : (
        <p className="text-amber-600">DEMO_CLINIC_ID not set.</p>
      )}
    </div>
  )
}
