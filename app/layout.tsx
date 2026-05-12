import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Clivo — AI Receptionist for Clinics',
  description: 'Your clinic never misses a patient again. AI-powered WhatsApp receptionist that books appointments 24/7.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
