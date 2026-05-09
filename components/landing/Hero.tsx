export default function Hero() {
  return (
    <section className="bg-white py-20 px-6 text-center">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Your clinic never misses a patient again
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Clivo is an AI receptionist on WhatsApp. It answers FAQs, books appointments, and notifies you — 24 hours a day, 7 days a week. No staff needed.
        </p>
        <a
          href="#pricing"
          className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
        >
          Start Free Trial
        </a>
      </div>
    </section>
  )
}
