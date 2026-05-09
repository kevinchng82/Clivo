import FaqEditor from '@/components/dashboard/FaqEditor'
import { supabase } from '@/lib/supabase'
import { verifySession } from '@/lib/session'

export default async function FaqsPage() {
  const { clinicId } = await verifySession()
  const { data: settings } = await supabase
    .from('clinic_settings')
    .select('faqs')
    .eq('clinic_id', clinicId)
    .single()

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">FAQ Management</h1>
      <p className="text-gray-500 mb-6">Add questions your patients frequently ask. Clivo will answer these automatically on WhatsApp.</p>
      <FaqEditor clinicId={clinicId} initial={(settings?.faqs as Array<{question:string;answer:string}>) || []} />
    </div>
  )
}
