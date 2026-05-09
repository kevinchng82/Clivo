export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 mb-8">
        <p className="font-semibold mb-1">Your PDPA obligations as a clinic operator (Singapore)</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Inform your patients that their WhatsApp messages are processed by an AI assistant</li>
          <li>Include a privacy notice on your clinic website or at reception</li>
          <li>You may not use patient data for any purpose other than appointment management</li>
          <li>Patients may request access to or deletion of their data — contact support@clivo.app to action this</li>
          <li>Notify PDPC and affected patients within 3 days of any data breach</li>
        </ul>
      </div>

      <p className="text-gray-500 text-sm">More settings (clinic hours, services, WhatsApp number ID) coming in the next release.</p>
    </div>
  )
}
