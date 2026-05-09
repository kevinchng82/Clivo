import Link from 'next/link'
import { logout } from '@/app/actions/auth'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-56 bg-white border-r p-6 flex flex-col gap-4">
        <div className="text-xl font-bold text-blue-600 mb-4">Clivo</div>
        <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">Bookings</Link>
        <Link href="/dashboard/faqs" className="text-gray-700 hover:text-blue-600 font-medium">FAQs</Link>
        <Link href="/dashboard/settings" className="text-gray-700 hover:text-blue-600 font-medium">Settings</Link>
        <div className="mt-auto">
          <form action={logout}>
            <button type="submit" className="w-full text-left text-sm text-gray-500 hover:text-red-600 transition">
              Sign out
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
