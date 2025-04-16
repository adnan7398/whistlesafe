'use client'

import { useAuth } from '@/app/context/AuthContext'

export default function AdminDashboard({ params: { lang } }) {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900">Welcome, Admin {user?.name}</h2>
        <p className="mt-2 text-gray-600">This is your admin dashboard.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900">Manage Users</h3>
          <p className="mt-2 text-gray-600">View and manage user accounts.</p>
          <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
            View Users
          </button>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900">Reports Management</h3>
          <p className="mt-2 text-gray-600">Review and process submitted reports.</p>
          <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
            Manage Reports
          </button>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900">Analytics</h3>
          <p className="mt-2 text-gray-600">View system statistics and reports.</p>
          <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
            View Analytics
          </button>
        </div>
      </div>
    </div>
  )
} 