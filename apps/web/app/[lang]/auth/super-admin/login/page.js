'use client'

import LoginForm from '../../../../components/LoginForm'

export default function SuperAdminLoginPage({ params: { lang } }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <LoginForm role="super-admin" lang={lang} />
      </div>
    </div>
  )
} 