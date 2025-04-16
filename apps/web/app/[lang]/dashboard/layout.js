'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from '../../i18n/client'
import Link from 'next/link'

export default function DashboardLayout({ children, params: { lang } }) {
  const { t } = useTranslation(lang, 'common')
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const menuItems = [
    { href: '/dashboard', label: 'dashboard', icon: '📊' },
    { href: '/dashboard/reports', label: 'my_reports', icon: '📝' },
    { href: '/dashboard/new-report', label: 'new_report', icon: '➕' },
    { href: '/dashboard/settings', label: 'settings', icon: '⚙️' },
  ]

  const handleLogout = () => {
    // Clear auth token and redirect to login
    localStorage.removeItem('token')
    router.push(`/${lang}/auth/login`)
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-white shadow-lg transition-all duration-300`}
      >
        <div className="p-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {isSidebarOpen ? '←' : '→'}
          </button>
        </div>
        <nav className="mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={`/${lang}${item.href}`}
              className="flex items-center p-4 hover:bg-gray-100"
            >
              <span className="text-xl mr-4">{item.icon}</span>
              {isSidebarOpen && <span>{t(`dashboard.${item.label}`)}</span>}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full p-4">
          <button
            onClick={handleLogout}
            className="w-full p-2 text-red-600 hover:bg-red-50 rounded-lg"
          >
            {isSidebarOpen && t('dashboard.logout')}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm p-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            {t('dashboard.title')}
          </h1>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
} 