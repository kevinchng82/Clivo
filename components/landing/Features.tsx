const features = [
  { title: '24/7 WhatsApp Receptionist', desc: 'Patients message your clinic WhatsApp any time. Clivo replies instantly — even at midnight.' },
  { title: 'Answers FAQs Automatically', desc: 'Set up your clinic hours, services, and common questions once. Clivo handles the rest.' },
  { title: 'Books Appointments', desc: 'Clivo collects patient name, service, and preferred time — then confirms the booking.' },
  { title: 'Notifies You Instantly', desc: 'Every new booking sends you a WhatsApp notification with full patient details.' },
]

export default function Features() {
  return (
    <section className="bg-gray-50 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Everything your receptionist does — automated</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map(f => (
            <div key={f.title} className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
